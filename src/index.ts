import { ethers } from "hardhat";
import VotingArtifacts from "../artifacts/contracts/Voting.sol/Voting.json";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

async function main() {
    const signer = await provider.getSigner();

    const votingAddress = process.env.VOTING_ADDRESS;
    if (!votingAddress) {
        console.log("Provide voting contract address");
        return;
    }

    const votingContract = new ethers.Contract(votingAddress, VotingArtifacts.abi, signer)

    async function displayCandidates() {
        const candidates = await votingContract.getCandidates();
        console.log("Displaying all candidates", candidates);
    }

    async function voteForCandidate(candidateId: number) {
        try {
            await (await votingContract.vote(candidateId)).wait();
            console.log(`Votes successfully for candidate ${1}`)
        } catch (error) {
            console.error("Failed to vore", error);
        }
    }

    async function resetVote() {
        try {
            await (await votingContract.resetVotes()).wait();
            console.log("Votes reset successfully")
        } catch (error) {
            console.error("Failed to vote", error);
        }
    }

    await displayCandidates();
    await voteForCandidate(1);
    await resetVote();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
