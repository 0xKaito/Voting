// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Voting Contract
/// @notice This contract allows for adding candidates, voting, and resetting votes.
contract Voting {
    struct Candidate {
        string name;
        uint id;
        uint voteCount;
    }

    address public owner;
    uint256 public candidatesCount;

    mapping (uint => Candidate) public candidates;

    event CandidateAdded(uint indexed candidateId, string name);
    event VoteReceived(uint indexed candidateId, uint voteCount);
    event VoteReset(address indexed owner, uint totalCandidates);

    /// @notice Constructor to set the owner and initialize with two candidates.
    /// @param _owner The address of the contract owner.
    constructor(address _owner) {
        // Initialize with two candidates
        addCandidate("Alice");
        addCandidate("Bob");

        owner = _owner;
    }

    /// @notice Get list of all candidates.
    /// @return An array of all candidates in the voting system.
    function getCandidates() external view returns(Candidate[] memory) {
        uint256 len = candidatesCount;
        Candidate[] memory _candidateInfo = new Candidate[](len);

        for (uint256 i = 1; i <= len; ++i ) {
            _candidateInfo[i - 1] = candidates[i];
        }

        return _candidateInfo;
    }

    /// @notice Get details of candidate.
    /// @param _candidateId The ID of the candidate.
    /// @return candidate id, name and voting count
    function getCandidateData(uint256 _candidateId) external view returns(string memory, uint, uint) {
        Candidate memory candidateInfo = candidates[_candidateId];
        return (candidateInfo.name, candidateInfo.id, candidateInfo.voteCount);
    }

    /// @notice Adds a new candidate to the voting system.
    /// @dev Only the contract owner can add a new candidate.
    /// @param _name The name of the candidate to be added.
    function addCandidate(string memory _name) public {
        require(msg.sender == owner || owner == address(0), "Voting: Invalid owner");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(_name, candidatesCount, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    /// @notice Casts a vote for a candidate.
    /// @dev Validates that the candidate ID exists.
    /// @param _candidateId The ID of the candidate to vote for.
    function vote(uint _candidateId) external {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Voting: Invalid candidate ID");
        Candidate memory candidateInfo = candidates[_candidateId];
        candidateInfo.voteCount++;
        candidates[_candidateId] = candidateInfo;
        emit VoteReceived(_candidateId, candidateInfo.voteCount);
    }

    /// @notice Resets the vote count for all candidates.
    /// @dev Only the contract owner can reset votes.
    function resetVotes() external {
        require(msg.sender == owner, "Voting: Invalid owner");
        uint256 len = candidatesCount;
        for (uint256 i = 1; i <= len; ++i ) {
            candidates[i].voteCount = 0;
        }

        emit VoteReset(msg.sender, len);
    }
}