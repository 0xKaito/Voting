import { ethers } from "hardhat";

async function main() {

  const admin = process.env.ADMIN;
  if (!admin) {
    console.log("Provide admin address");
    return;
}

  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(admin);

  console.log(
    `Voting deployed to ${voting.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
