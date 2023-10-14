// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Migrations {
    address public deployer;
    uint public last_completed_migration;


    constructor() {
      deployer = msg.sender;
    }

    modifier onlyDeployer() {
      require(msg.sender == deployer, "Only the deployer can perform this action");
      _;
    }

    function isAdminFunction() public view onlyDeployer returns (bool) {
      return true;
    }

    function setCompleted(uint completed) public onlyDeployer() {
      last_completed_migration = completed;
    }
}