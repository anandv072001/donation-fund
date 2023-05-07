const CampaignFactory = artifacts.require("CampaignFactory");

module.exports = function(deployer) {
    deployer.deploy(CampaignFactory);

};

// ganache contract address -->  0x2F4DfD81c3901BB56CE71bB255825802Ac4dd0B6