import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Campaign from "../contracts/Campaign.json";
import getWeb3 from "../getWeb3.js";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

function NewRequest({ creatorAddress }) {
  const [web3, setWeb3] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [recipient, setRecipient] = useState("");
  const { address } = useParams();
  const navigate = useNavigate();

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleValueChange = (event) => {
    setValue(event.target.value);
  };

  const handleRecipientChange = (event) => {
    setRecipient(event.target.value);
  };

  const createRequest = async () => {
    const campaignInstance = new web3.eth.Contract(Campaign.abi, address);
    const accounts = await web3.eth.getAccounts();
    await campaignInstance.methods
      .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
      .send({ from: accounts[0] });
    navigate(`/campaigns/${address}/requests`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createRequest();
  };

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = await getWeb3();
        setWeb3(web3Instance);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <Container>
      <Row>
        <Col>
          <h1>Create a new request</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Enter a description of the request"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="number"
                value={value}
                onChange={handleValueChange}
                placeholder="Enter the amount in ether (ETH)"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Recipient</Form.Label>
              <Form.Control
                type="text"
                value={recipient}
                onChange={handleRecipientChange}
                placeholder="Enter the address of the recipient"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create Request
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default NewRequest;
