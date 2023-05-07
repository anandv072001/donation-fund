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
