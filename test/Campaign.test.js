const CampaignFactory = artifacts.require("CampaignFactory");
const Campaign = artifacts.require("Campaign");

contract("CampaignFactory", (accounts) => {
  let campaignFactory;
  let campaign;

  beforeEach(async () => {
    campaignFactory = await CampaignFactory.new();
    await campaignFactory.createCampaign(
      "Campaign Name",
      "Campaign Description",
      "https://example.com",
      web3.utils.toWei("100", "ether"), // target
      web3.utils.toWei("0.1", "ether"), // minimum contribution
      { from: accounts[0] }
    );
    const [campaignAddress] = await campaignFactory.getDeployedCampaigns();
    campaign = await Campaign.at(campaignAddress);
  });

  it("deploys a factory and a campaign", async () => {
    assert.ok(campaignFactory.address);
    assert.ok(campaign.address);
  });

  it("allows contributors to contribute and become approvers", async () => {
    const contributor = accounts[1];
    await campaign.contribute({ from: contributor, value: web3.utils.toWei("1", "ether") });
    const isContributor = await campaign.approvers(contributor);
    assert(isContributor);
  });

  it("requires a minimum contribution amount", async () => {
    const contributor = accounts[1];
    try {
      await campaign.contribute({ from: contributor, value: web3.utils.toWei("0.01", "ether") });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows the manager to create a spending request", async () => {
    await campaign.createRequest("Spending Request Description", web3.utils.toWei("50", "ether"), accounts[2], { from: accounts[0] });
    const request = await campaign.getRequest(0);
    assert.equal(request.description, "Spending Request Description");
    assert.equal(request.value, web3.utils.toWei("50", "ether"));
    assert.equal(request.recipient, accounts[2]);
    assert.equal(request.complete, false);
    assert.equal(request.approvalCount, 0);
  });

  it("does not allow a contributor to create a spending request", async () => {
    try {
      await campaign.createRequest("Spending Request Description", web3.utils.toWei("50", "ether"), accounts[2], { from: accounts[1] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows contributors to approve a spending request", async () => {
    const contributor = accounts[1];
    await campaign.contribute({ from: contributor, value: web3.utils.toWei("1", "ether") });
    await campaign.createRequest("Spending Request Description", web3.utils.toWei("50", "ether"), accounts[2], { from: accounts[0] });
    await campaign.approveRequest(0, { from: contributor });
    const request = await campaign.getRequest(0);
    assert.equal(request.approvalCount, 1);
  });

  it("does not allow a contributor to approve a spending request twice", async () => {
    const contributor = accounts[1];
    await campaign.contribute({ from: contributor, value: web3.utils.toWei("1", "ether") });
    await campaign.createRequest("Spending Request Description", web3.utils.toWei("50", "ether"), accounts[2], { from: accounts[0] });
    await campaign.approveRequest(0, { from: contributor });
    try {
      await campaign.approveRequest(0, { from: contributor });
      assert.fail("Expected revert not received");
      } catch (err) {
      assert(err.message.includes("Contributor has already approved this request."), "Error message does not contain expected string");
      }
      });
    } );
