import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Campaign from "../contracts/Campaign.json";
import getWeb3 from "../getWeb3.js";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

function CampaignDetails() {
  const [web3, setWeb3] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contractAddress, setContractAddress] = useState(null);
  const [contributionAmount, setContributionAmount] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [creatorAddress, setCreatorAddress] = useState(null);
  const { address } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = await getWeb3();
        setWeb3(web3Instance);
        const campaignInstance = new web3Instance.eth.Contract(
          Campaign.abi,
          address
        );
        const summary = await campaignInstance.methods.getSummary().call();
        console.log(summary); 
        const result = await campaignInstance.methods.getSummary().call();
        const name = result[0];
        const description = result[1];
        const url = result[2];
        const target = result[3];
        const minimumContribution = result[4];
        const balance = result[5];
        const numRequests = result[6];
        const contributors = result[7];
        const manager = result[8];

        const etherBalance = web3Instance.utils.fromWei(balance, "ether");
        setCampaign({
          name,
          description,
          url,
          target,
          minimumContribution,
          balance: etherBalance,
          numRequests,
          contributors,
          manager,
        });
        setContractAddress(address);
        setIsLoading(false);

        const accounts = await web3Instance.eth.getAccounts();
        const isCreator = accounts[0] === manager;
        setCreatorAddress(manager);
        setIsCreator(isCreator);
      } catch (error) {
        console.error(error);
      }
    };
    initWeb3();
    window.ethereum.on("accountsChanged", (accounts) => {
      window.location.reload();
    });
  }, [address]);

  const handleContributionAmountChange = (event) => {
    setContributionAmount(event.target.value);
  };

  const contributeToCampaign = async () => {
    const campaignInstance = new web3.eth.Contract(Campaign.abi, address);
    const accounts = await web3.eth.getAccounts();
    await campaignInstance.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei(contributionAmount, "ether")
    });
  }


  
  if (isLoading) {
    return <div>Loading campaign details...</div>;
  }

  const etherscanUrl = `https://etherscan.io/address/${address}`;

  return (
    <Container>
      <Row>
        <Col>
          <h1>Name: {campaign.name}</h1>
          <h2>
            Contract Address:{" "}
            <a href={etherscanUrl} target="_blank" rel="noreferrer">
              {contractAddress}
            </a>
          </h2>
          <p>{campaign.description}</p>
  
          <p>
            <strong>Target:</strong>{" "}
            {web3.utils.fromWei(campaign.target, "ether")} ETH
          </p>
          <p>
            <strong>Minimum Contribution:</strong>{" "}
            {web3.utils.fromWei(campaign.minimumContribution, "ether")} ETH
          </p>
          <p>
            <strong>Current Balance:</strong> {campaign.balance} ETH
          </p>
          <p>
            <strong>Number of Requests:</strong> {campaign.numRequests}
          </p>
          <p>
            <strong>Number of Contributors:</strong> {campaign.contributors}
          </p>
          <p>
            <strong>Manager:</strong>{" "}
            <a href={etherscanUrl} target="_blank" rel="noreferrer">
              {campaign.manager}
            </a>
          </p>
  
          <hr />
  
          <h3>Contribute to Campaign</h3>
          <p>
            To contribute to the campaign, please enter the amount in Ether below:
          </p>
          <input
            type="number"
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
          />
          <button onClick={contributeToCampaign}>Contribute</button>

          <div>

      {isCreator && (
        <div>
          <Button
            variant="primary"
            onClick={() => navigate(`/campaigns/${address}/newrequests/`)}
          >
            Create Request
          </Button>
        </div>
      )}
    </div>
    <br></br>
    <div>
          <Button
            variant="primary"
            onClick={() => navigate(`/campaigns/${address}/requests/`)}
          >
            View Requests
          </Button>
        </div>
        </Col>
      </Row>
    </Container>
  );
}
export default CampaignDetails;