// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// deposit and withdraw funds
// manage orders - make or cancel
// handle trades - charge fees

// TO DO
// []set the fee account
// []Deposit ether
// []withdraw ether
// []deposit tokens
// []withdraw tokens
// []chceck balances
// []make order
// []cancel order
// []fill order
// []set fee account
// []charge fees

contract Exchange {
    address public feeAccount; // the account that recieves exchange fees
    uint256 public feePercent; // fee percentage

    constructor (address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

}
