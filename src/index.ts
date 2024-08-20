import { ethers } from "hardhat";
import VotingArtifacts from "../artifacts/contracts/Voting.sol/Voting.json";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

async function main() {
    const signer = await provider.getSigner();

    const votingAddress = process.env.VOTING_ADDRESS ?? "";
    const votingContract = new ethers.Contract(votingAddress, VotingArtifacts.abi, signer)

    async function displayCandidates() {
        const candidates = await votingContract.getCandidates();
        console.log("Displaying all candidates", candidates);
    }

    async function voteForCandidate(candidateId: number) {
        try {
            const transactionResponses = await votingContract.vote(candidateId);
            await transactionResponses.wait();
            console.log(await votingContract.getCandidateData(candidateId))
            console.log(`Votes successfully for candidate ${1}`)
        } catch (error) {
            console.error("Failed to vore", error);
        }
    }

    async function resetVote() {
        try {
            const transactionResponses = await votingContract.resetVotes();
            await transactionResponses.wait();
            console.log("Votes reset successfully")
        } catch (error) {
            console.error("Failed to vore", error);
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
