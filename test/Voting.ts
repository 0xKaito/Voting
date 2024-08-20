import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Voting", function () {
  async function deployOneYearLockFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy(owner);

    return { voting, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      const { voting, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await voting.owner()).to.equal(owner.address);
      expect(await voting.candidatesCount()).to.equal(2);

      expect((await voting.candidates(1)).name).to.equal("Alice");
      expect((await voting.candidates(2)).name).to.equal("Bob");
    });
  });

  describe("Funtions", function () {
    describe("Add candiate", function () {
      it("Should add candidate", async function () {
        const { voting, otherAccount } = await loadFixture(deployOneYearLockFixture);

        await voting.addCandidate("Alice");
        const candidateInfo = await voting.candidates(1);
    
        expect(candidateInfo.name).to.equal("Alice")
        expect(candidateInfo.voteCount).to.equal(0)
        expect(candidateInfo.id).to.equal(1)
      });

      it("Should emit an event on adding candidate", async function () {
        const { voting } = await loadFixture(
          deployOneYearLockFixture
        );

        await expect(voting.addCandidate("Alice"))
          .to.emit(voting, "CandidateAdded")
          .withArgs(3, "Alice");
      });

      it("Should revert if caller is not owner", async function () {
        const { voting, otherAccount } = await loadFixture(deployOneYearLockFixture);
        await expect(voting.connect(otherAccount).addCandidate("Alice")).to.be.revertedWith("Voting: Invalid owner");
      });
    });

    describe("Vote", function () {
      it("Should vote on candidate id", async function () {
        const { voting, otherAccount } = await loadFixture(deployOneYearLockFixture);
        await voting.addCandidate("Alice");
        await voting.connect(otherAccount).vote(1);

        expect((await voting.candidates(1)).voteCount).to.equal(1);
      });

      it("Should emit an event on vote", async function () {
        const { voting, otherAccount } = await loadFixture(deployOneYearLockFixture);
        await voting.addCandidate("Alice");
        await expect(voting.connect(otherAccount).vote(1))
          .to.emit(voting, "VoteReceived")
          .withArgs(1, 1);
      });

      it("Should revert if candidate id is not valid", async function () {
        const { voting, otherAccount } = await loadFixture(deployOneYearLockFixture);
        await expect(voting.vote(5)).to.be.revertedWith("Voting: Invalid candidate ID");
      });
    });

    describe("Reset vote", function () {
      it("Should reset vote of candidates", async function () {
        const { voting, otherAccount } = await loadFixture(deployOneYearLockFixture);

        await voting.connect(otherAccount).vote(1);
        await voting.vote(2);

        expect((await voting.candidates(1)).voteCount).to.equal(1);
        expect((await voting.candidates(2)).voteCount).to.equal(1);

        await voting.resetVotes();

        expect((await voting.candidates(1)).voteCount).to.equal(0);
        expect((await voting.candidates(2)).voteCount).to.equal(0);
      });

      it("Should emit an event on reset", async function () {
        const { voting, owner } = await loadFixture(deployOneYearLockFixture);
  
        await voting.vote(1);

        await expect(voting.resetVotes())
          .to.emit(voting, "VoteReset")
          .withArgs(owner.address, 2);
      });

      it("Should revert if caller is not owner", async function () {
        const { voting, otherAccount } = await loadFixture(deployOneYearLockFixture);
        await expect(voting.connect(otherAccount).resetVotes()).to.be.revertedWith("Voting: Invalid owner");
      });
    });
  });
});
