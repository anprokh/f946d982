const contractAddress = "0xB809ACC2962570327E7b40B34814B5a593544B27";

task("proposals", "Prints list of proposals")
    .addParam("id", "The voting ID")
    .setAction(async (taskArgs) => {

    var id = parseInt(taskArgs.id, 10);
    if (isNaN(id)) {
        console.log("A parameter error has occurred");
        return
    }

    const Votings = await ethers.getContractFactory("Votings");
    const votings = await Votings.attach(contractAddress);

    const value = await votings.proposalList(id);
    console.log(value.toString());
    
});