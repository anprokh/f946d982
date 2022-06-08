// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";

contract Votings {

    struct Proposal {
        address addr;
        uint voteCount;
    }

    struct Voting {
        string name;
        uint numProposals;
        uint balance;
        mapping (uint => Proposal) proposals;
        mapping (address => bool) voters;
        uint votingEndTime;
        bool finished;
    }

    address private owner;
    Voting[] private votings;

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }


    function addVoting(string calldata _name, uint _lifetime, address[] calldata _proposals) external isOwner {
        Voting storage v = votings.push();
        v.name = _name;
        v.numProposals = _proposals.length;
        for (uint i = 0; i < _proposals.length; i++) {
            v.proposals[i] = Proposal({addr: _proposals[i], voteCount: 0});
        }
        v.votingEndTime = block.timestamp + _lifetime;  // 259200 = 3 days
    }


    function vote(uint votingID, uint proposalID) external payable {
        require(votingID < votings.length, "Incorrect voting ID");
        require(proposalID < votings[votingID].numProposals, "Incorrect proposal ID");
        require(votings[votingID].voters[msg.sender] == false, "Already voted");
        require(!votings[votingID].finished, "Voting is over");
        require(msg.value == 0.01 ether, "Incorrect value (need 0.01 ETH)");

        votings[votingID].proposals[proposalID].voteCount += 1;
        votings[votingID].voters[msg.sender] = true;
        votings[votingID].balance += msg.value;
    }


    function finish(uint votingID) external  {
        require(votingID < votings.length, "Incorrect voting ID");
        require(!votings[votingID].finished, "Voting is over");
        require(block.timestamp > votings[votingID].votingEndTime, "Lifetime not expired");

        uint winningVoteCount = 0;
        address winner;

        for (uint i = 0; i < votings[votingID].numProposals; i++) {
            if (votings[votingID].proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = votings[votingID].proposals[i].voteCount;
                winner = votings[votingID].proposals[i].addr;
            }
        }

        // не дадим завершить голосование пока не определен победитель )
        uint numWinners = 0;
        for (uint i = 0; i < votings[votingID].numProposals; i++) {
            if (votings[votingID].proposals[i].voteCount == winningVoteCount) {
                numWinners++;
            }
        }
        require(numWinners == 1, "No winner");

        uint amount = votings[votingID].balance;
        amount = amount - (amount / 10);
        payable(winner).transfer(amount);
        votings[votingID].finished = true;
        votings[votingID].balance -= amount;
    }


    function withdraw(uint votingID) external isOwner payable {
        require(votingID < votings.length, "Incorrect voting ID");
        require(votings[votingID].finished, "Voting is not over");
        payable(owner).transfer(votings[votingID].balance);
    }


    // для вывода списка голосований
    struct VotingName {
        uint id;
        string name;
    }

    function votingList() external view returns (VotingName[] memory) {
        VotingName[] memory res = new VotingName[](votings.length);
        for (uint i = 0; i < votings.length; i++) {
            res[i] = VotingName({id: i, name: votings[i].name});
            //console.log("voting:", i, votings[i].name);
        }
        return res;
    }


    // для вывода списка участников голосования
    struct ProposalInfo {
        uint id;
        address addr;
    }

    function proposalList(uint votingID) external view returns (ProposalInfo[] memory) {
        require(votingID < votings.length, "Incorrect voting ID");
        ProposalInfo[] memory res = new ProposalInfo[](votings[votingID].numProposals);
        for (uint i = 0; i < votings[votingID].numProposals; i++) {
            Proposal memory p = votings[votingID].proposals[i];
            //console.log("proposal:", i, p.addr, p.voteCount);
            res[i] = ProposalInfo({id: i, addr: p.addr});
        }
        return res;
    }

}