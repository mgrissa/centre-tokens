pragma solidity ^0.4.18;

import './../lib/openzeppelin/contracts/token/ERC20/StandardToken.sol';

/**
 * @title Mintable token
 * @dev Simple ERC20 Token example, with special "minter" role overriding the owner role
 */
contract MintableTokenByRole is StandardToken {
  
  address public minter;
  address public reserver; 


  event Mint(address indexed to, uint256 amount);
  event MintFinished();

  bool public mintingFinished = false;

  /**
   * @dev Throws if minting finished
  */
  modifier canMint() {
    require(!mintingFinished);
    _;
  }

  /**
   * @dev Throws if called by any account other than the minter
  */
  modifier onlyMinter() {
    require(msg.sender == minter);
    _;
  }

  /**
   * @dev Function to mint tokens
   * @param _amount The amount of tokens to mint.
   * @return A boolean that indicates if the operation was successful.
  */
  function mint(uint256 _amount) onlyMinter canMint public returns (bool) {
    totalSupply_ = totalSupply_.add(_amount);
    balances[reserver] = balances[reserver].add(_amount);
    Mint(reserver, _amount);
    return true; 
  }

  /**
   * @dev Function to stop minting new tokens.
   * @return True if the operation was successful.
  */
  function finishMinting() onlyMinter canMint public returns (bool) {
    mintingFinished = true;
    MintFinished();
    return true;
  }

}
