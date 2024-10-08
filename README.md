# Voting Contract

## Overview

The Voting contract is a simple Ethereum smart contract that allows for the management of candidates and voting in a decentralized manner. This contract includes functionalities to add candidates, vote for them, retrieve candidate information, and reset votes. 

## Features

- **Add Candidate:** The owner can add new candidates to the voting system.
- **Vote:** Users can vote for their preferred candidates.
- **Get All Candidates:** Get the complete list of all candidates.
- **Reset Votes:** The owner can reset the vote counts for all candidates.

## Changes

- changes candidate mapping to candidate ID to candidate name
    - no need for candidate ID as candidate details are fetched from candidate ID 
    - move voteCount to new mapping
- create a new mapping to store candidate vote count for a particular session
- Create a session, reset all candidate vote counts to zero, which is gas-intensive, and introduce a session mechanism. Starting a new session will automatically initialize the vote count for all candidates to zero, optimizing gas usage.

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
