async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // We get the contract to deploy
    const Votings = await ethers.getContractFactory("Votings");
    const votings = await Votings.deploy();

    await votings.deployed();

    console.log("Votings deployed to:", votings.address);

    const provider = waffle.provider;
    const balance0ETH = await provider.getBalance(votings.address);
    console.log("Votings balance:", balance0ETH.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });