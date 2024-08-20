# Voting Contract

## Overview

The Voting contract is a simple Ethereum smart contract that allows for the management of candidates and voting in a decentralized manner. This contract includes functionalities to add candidates, vote for them, retrieve candidate information, and reset votes. 

## Features

- **Add Candidate:** The owner can add new candidates to the voting system.
- **Vote:** Users can vote for their preferred candidates.
- **Get Candidate Data:** Retrieve information about a specific candidate.
- **Get All Candidates:** Get the complete list of all candidates.
- **Reset Votes:** The owner can reset the vote counts for all candidates.

## Scripts

### Compile
```shell
npx hardhat compile
```

### Test
```shell
npx hardhat test
```

### Deploy
```shell
npx hardhat run --network localhost scripts/deploy.ts
```

### Start node
```shell
npx hardhat node
```
