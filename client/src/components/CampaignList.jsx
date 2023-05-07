import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import CampaignFactory from "../contracts/CampaignFactory.json";
import getWeb3 from "../getWeb3.js";
import { Link } from "react-router-dom";
import Campaign from "../contracts/Campaign.json"
function CampaignList() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [factoryContract, setFactoryContract] = useState(null);
  const [deployedCampaigns, setDeployedCampaigns] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = await getWeb3();
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = CampaignFactory.networks[networkId];
        const factoryContractInstance = new web3Instance.eth.Contract(
          CampaignFactory.abi,
          deployedNetwork && deployedNetwork.address
        );
        setFactoryContract(factoryContractInstance);
      } catch (error) {
        console.error(error);
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaigns = await factoryContract.methods
        .getDeployedCampaigns()
        .call();
      setDeployedCampaigns(campaigns);
    };

    if (factoryContract) {
      fetchCampaigns();
    }
  }, [factoryContract]);

  const renderCampaignCards = () => {
    return deployedCampaigns.map((address) => (
      <Col key={address} className="mb-4">
        <Card>
          <Card.Body>
            <Card.Title>{`${address.slice(0, 6)}...${address.slice(
              -4
            )}`}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Campaign Summary
            </Card.Subtitle>
            <Card.Text>Target: TODO</Card.Text>
            <Card.Text>Minimum Contribution: TODO</Card.Text>
            <Button variant="primary" href={`campaigns/${address}`}>
              View Campaign
            </Button>
          </Card.Body>
        </Card>
      </Col>
    ));
  };
  

  return (
    <Container>
      <Row className="justify-content-between align-items-center mb-4">
        <h1>Crowdfunding Campaigns</h1>
        <Link to="/campaigns/new" className="btn btn-primary">
          Create Campaign
        </Link>
      </Row>
      <Row>{renderCampaignCards()}</Row>
    </Container>
  );
}

export default CampaignList;
