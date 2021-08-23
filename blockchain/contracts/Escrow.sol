// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/// @title A contract which acts as a middleman for payments (Escrow)
/// @author Nima Ghazanfari
/// @notice This contract saves the fees for requested demands coming from the web interface
/// @dev Each address has a separate payment for the fees of a requested task
contract Escrow {
    using SafeMath for uint256;

    address _owner; //the owner of the contract
    mapping(uint256 => uint256) _deposits; // project number => amount
    uint256 _commission; //the perecent in which the owner will receive benefit
    uint256 _totalStake; //the total amount of ethers the owner has

    event Deposit(address from, uint256 value);
    event Withdraw(address payee, uint256 project, uint256 value);

    constructor(uint256 commission) {
        _owner = msg.sender;
        _commission = commission;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "!owner");
        _;
    }

    function deposit(uint256 projectNumber) external payable {
        require(msg.value > 0, "!value");
        require(projectNumber > 0, "!project");

        emit Deposit(msg.sender, msg.value);
        _deposits[projectNumber] = _deposits[projectNumber].add(msg.value);
    }

    function withdraw(uint256 projectNumber, address payee) external onlyOwner {
        require(projectNumber > 0, "!project");
        require(payee != address(0), "!address");
        require(_deposits[projectNumber] > 0, "!value");

        uint256 value = (100 - _commission).mul(_deposits[projectNumber]).div(100);
        _totalStake += _deposits[projectNumber].sub(value);
        _deposits[projectNumber] = 0;
        emit Withdraw(payee, projectNumber, value);
        (bool success, ) = payable(payee).call{value: value}("");
        require(success);
    }

    function claimOwnerStake() external onlyOwner{
        require(_totalStake > 0, "!value");
        uint256 value = _totalStake;
        _totalStake = 0;
        emit Withdraw(_owner, 0, value);
        (bool success, ) = payable(_owner).call{value: value}("");
        require(success);
    }
}
