const contractAddress = "0xB809ACC2962570327E7b40B34814B5a593544B27";

task("votings", "Prints list of votes").setAction(async () => {

    const Votings = await ethers.getContractFactory("Votings");
    const votings = await Votings.attach(contractAddress);

    const value = await votings.votingList();
    console.log(value.toString());

});