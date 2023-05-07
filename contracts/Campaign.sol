// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(string memory name, string memory description, string memory url, uint target, uint minimum) public {
        address newCampaign = address(new Campaign(name, description, url, target, minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    uint numRequests;
    mapping (uint => Request) requests;
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;
    string public name;
    string public description;
    string public url;
    uint public target;

    modifier restricted() {
        require(msg.sender == manager, "Only the manager can call this function.");
        _;
    }

    modifier onlyContributor() {
        require(approvers[msg.sender], "Only contributors can call this function.");
        _;
    }

    constructor(string memory _name, string memory _description, string memory _url, uint _target, uint256 minimum, address creator) {
        name = _name;
        description = _description;
        url = _url;
        target = _target;
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "Amount sent is below the minimum contribution required.");

        approvers[msg.sender] = true;
    }

    function createRequest(string memory _description, uint _value, address _recipient) public restricted {
    require(!approvers[_recipient], "Recipient cannot be a contributor to the campaign.");
    Request storage r = requests[numRequests++];
    r.description = _description;
    r.value = _value;
    r.recipient = payable(_recipient);
    r.complete = false;
    r.approvalCount = 0;
}


    function getRequest(uint index) public view returns (string memory description, uint256 value, address payable recipient, bool complete, uint256 approvalCount) {
        require(index < numRequests, "Index out of range.");
        Request storage r = requests[index];
        return (r.description, r.value, r.recipient, r.complete, r.approvalCount);
    }

    function approveRequest(uint index) public onlyContributor {
        Request storage request = requests[index];
        require(!request.approvals[msg.sender], "Contributor has already approved this request.");

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2), "Not enough approvals to finalize request.");
        require(!request.complete, "Request has already been completed.");

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
        string memory, string memory, string memory, uint, uint256, uint256, uint256, uint256, address
    ) {
        return (
            name,
            description,
            url,
            target,
            minimumContribution,
            address(this).balance,
            numRequests,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
    return numRequests;
}}

