//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Keyboards {
  enum KeyboardKind {
    SixtyPercent,
    SeventyPercent,
    EightyPercent,
    Iso105
  }

  struct Keyboard {
    KeyboardKind kind;
    bool isPBT;
    string filter;
    address owner;
  }

  Keyboard[] public createdKeybaords;

  function getKeyboards() public view returns (Keyboard[] memory) {
    return createdKeybaords;
  }

  function create(KeyboardKind _kind, bool _isPBT, string calldata _filter) public {
    Keyboard memory newKind = Keyboard({
      kind: _kind,
      isPBT: _isPBT,
      filter: _filter,
      owner: msg.sender
    });

    createdKeybaords.push(newKind);
  }

  function tip(uint _index) public payable {
    address payable owner = payable(createdKeybaords[_index].owner);
    owner.transfer(msg.value);
  }
}