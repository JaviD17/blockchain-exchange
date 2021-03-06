// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
    using SafeMath for uint256;
    string public name = "DApp Token";
    string public symbol = "DAPP";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    // track balances
    mapping(address => uint256) public balanceOf;

    // events
    event Transfer(address indexed from, address indexed to, uint256 value);

    // send token
    constructor() public {
        totalSupply = 1000000 * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(_to != address(0));
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
