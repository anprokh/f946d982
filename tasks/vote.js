const contractAddress = "0xB809ACC2962570327E7b40B34814B5a593544B27";

task("vote", "Vote")
    .addParam("id", "The voting ID")
    .addParam("proposal", "The proposal ID")
    .setAction(async (taskArgs) => {

    var id = parseInt(taskArgs.id, 10);
    if (isNaN(id)) {
        console.log("A id parameter error has occurred");
        return
    }

    var proposal = parseInt(taskArgs.proposal, 10);
    if (isNaN(proposal)) {
        console.log("A proposal parameter error has occurred");
        return
    }

    const Votings = await ethers.getContractFactory("Votings");
    const votings = await Votings.attach(contractAddress);

    let value = await votings.vote(id, proposal, {value: ethers.utils.parseEther("0.01")});
    console.log(value);

});