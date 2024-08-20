// SPDX-License-Identifier: MIT
pragma solidity =0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Voting Contract
/// @notice This contract allows for adding candidates, voting, and resetting votes.
contract Voting is Ownable {
    struct Candidate {
        string name;
        uint256 id;
        uint256 voteCount;
    }

    /// @notice The total number of candidates.
    uint256 public candidatesCount;

    /// @notice The identifier for the current voting session.
    /// @dev This can be incremented to start a new voting session
    uint256 public currentSession = 1;

    /// @notice A mapping of candidate IDs to their names.
    mapping (uint256 => string) public candidates;

    /// @notice A mapping that tracks the vote count for each candidate in each session.
    mapping (uint256 => mapping (uint256 => uint256)) public voteCount;

    /// @notice Emitted when a new candidate is added to the current session.
    /// @param candidateId The ID of the candidate.
    /// @param name The name of the candidate.
    event CandidateAdded(uint256 indexed candidateId, string name);

    /// @notice Emitted when a vote is cast for a candidate.
    /// @param candidateId The ID of the candidate that received the vote.
    /// @param voteCount The new vote count for the candidate.
    event VoteReceived(uint256 indexed candidateId, uint256 voteCount);

    /// @notice Emitted when all votes are reset for the current session.
    /// @param newSession New session id.
    event VotesReset(uint256 indexed newSession);

    /// @notice Constructor to set the owner and initialize with two candidates.
    /// @param _owner The address of the contract owner.
    constructor(address _owner) Ownable(_owner) {
        // Initialize with two candidates
        _addCandidate("Alice");
        _addCandidate("Bob");
    }

    /// @notice Get list of all candidates.
    /// @return _candidateInfo An array of all candidates in the voting system.
    function getCandidates() external view returns(Candidate[] memory _candidateInfo) {
        uint256 len = candidatesCount;
        _candidateInfo = new Candidate[](len);

        for (uint256 index = 1; index <= len; ++index ) {
            _candidateInfo[index - 1] = Candidate(candidates[index], index, voteCount[currentSession][index]);
        }

        return _candidateInfo;
    }

    /// @notice Adds a new candidate to the voting system.
    /// @dev Only the contract owner can add a new candidate.
    /// @param _name The name of the candidate to be added.
    function addCandidate(string memory _name) public onlyOwner {
        _addCandidate(_name);
    }

    /// @notice Casts a vote for a candidate.
    /// @dev Validates that the candidate ID exists.
    /// @param _candidateId The ID of the candidate to vote for.
    function vote(uint _candidateId) external {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Voting: Invalid candidate ID");
        voteCount[currentSession][_candidateId]++;
        emit VoteReceived(_candidateId, voteCount[currentSession][_candidateId]);
    }

    /// @notice Resets the vote count for all candidates.
    /// @dev Only the contract owner can reset votes.
    function resetVotes() external onlyOwner {
        currentSession++;
        emit VotesReset(currentSession);
    }

    function _addCandidate(string memory _name) internal {
        candidatesCount++;
        candidates[candidatesCount] = _name;
        emit CandidateAdded(candidatesCount, _name);
    }
}