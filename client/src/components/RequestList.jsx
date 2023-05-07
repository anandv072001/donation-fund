import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import getWeb3 from "../getWeb3";
import Campaign from "../contracts/Campaign.json";
import { Table, Button } from "semantic-ui-react";

const RequestList = () => {
  const { address } = useParams();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const getRequests = async () => {
      const web3 = await getWeb3();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Campaign.networks[networkId];
      const campaign = new web3.eth.Contract(
        Campaign.abi,
        address
      );
      const requestsCount = await campaign.methods.getRequestsCount().call();
      const requests = await Promise.all(
        Array(parseInt(requestsCount))
          .fill()
          .map((element, index) => {
            return campaign.methods.getRequest(index).call();
          })
      );

      setRequests(requests);
    };

    getRequests();
  }, [address]);

  const approveRequest = async (index) => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const campaign = new web3.eth.Contract(
        Campaign.abi,
        address
      );
      await campaign.methods.approveRequest(index).send({
        from: accounts[0]
      });
      const updatedRequest = await campaign.methods.getRequest(index).call();
      setRequests((prevRequests) => {
        const updatedRequests = [...prevRequests];
        updatedRequests[index] = updatedRequest;
        return updatedRequests;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const finalizeRequest = async (index) => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const campaign = new web3.eth.Contract(
        Campaign.abi,
        address
      );
      await campaign.methods.finalizeRequest(index).send({
        from: accounts[0]
      });
      const updatedRequest = await campaign.methods.getRequest(index).call();
      setRequests((prevRequests) => {
        const updatedRequests = [...prevRequests];
        updatedRequests[index] = updatedRequest;
        return updatedRequests;
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
          <Table.HeaderCell>Amount</Table.HeaderCell>
          <Table.HeaderCell>Recipient</Table.HeaderCell>
          <Table.HeaderCell>Approval Count</Table.HeaderCell>
          <Table.HeaderCell>Complete</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell> {/* new column */}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {requests.map((request, index) => {
          return (
            <Table.Row key={index}>
              <Table.Cell>{index}</Table.Cell>
              <Table.Cell>{request.description}</Table.Cell>
              <Table.Cell>{request.value} wei</Table.Cell>
              <Table.Cell>{request.recipient}</Table.Cell>
              <Table.Cell>{request.approvalCount}</Table.Cell>
              <Table.Cell>{request.complete ? "Yes" :"No"}</Table.Cell>
              <Table.Cell>
             {request.complete ? null : ( // show the buttons only if request is not completed
            <>
            <Button
                color="green"
                onClick={() => approveRequest(index)}
                style={{ marginRight: "10px" }}
            >
                Approve
            </Button>
            <Button
                color="teal"
                onClick={() => finalizeRequest(index)}
            >
                Finalize
            </Button>
            </>
            )}
            </Table.Cell>
            </Table.Row>
            );
            })}
            </Table.Body>
        </Table>
);
}
export default RequestList;