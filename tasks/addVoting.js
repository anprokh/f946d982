const contractAddress = "0xB809ACC2962570327E7b40B34814B5a593544B27";

task("addvoting", "Add a vote to Contract").setAction(async () => {

    const Votings = await ethers.getContractFactory("Votings");
    const votings = await Votings.attach(contractAddress);

    let data = "";
    const fs = require('fs');
    try {
        data = fs.readFileSync('./tasks/arguments.json', 'utf8');
    } catch (err) {
        console.error(err);
        return;
    }
    let args = JSON.parse(data);

    let value = await votings.addVoting(args.name, args.lifetime, args.address);
    console.log(value);
});