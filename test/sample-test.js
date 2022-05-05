const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Votings contract", function () {

    let votings;
    let owner, addr1, addr2, addr3;

    describe("Deployment and some transactions", function() {

        it("Deployment", async function() {

            const Votings = await ethers.getContractFactory("Votings");
            [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

            votings = await Votings.deploy();

            const provider = waffle.provider;
            const votingsBalance = await provider.getBalance(votings.address);

            expect(votingsBalance).to.equal("0");
        });

        it("Transactions", async function() {

            await votings.addVoting("vote0", [addr1.address, addr2.address, addr3.address]);

            const vlist = await votings.votingList();
            expect(vlist.toString()).to.equal("0,vote0");

            await votings.connect(addr1).vote(0, 1, { value: ethers.utils.parseEther("0.01") });
            await votings.connect(addr2).vote(0, 1, { value: ethers.utils.parseEther("0.01") });
            await votings.connect(addr3).vote(0, 2, { value: ethers.utils.parseEther("0.01") });
            //await votings.proposalList(0);

            const bal = await waffle.provider.getBalance(votings.address);
            expect(ethers.utils.formatEther(bal)).to.equal("0.03");
        });

    });

});