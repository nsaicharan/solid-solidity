//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Keyboards {
  string[] public createdKeybaords;

  function getKeyboards() public view returns (string[] memory) {
    return createdKeybaords;
  }

  function create(string memory name) public {
    createdKeybaords.push(name);
  }
}