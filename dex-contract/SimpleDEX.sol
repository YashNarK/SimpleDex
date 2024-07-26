// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Simple Decentralized Exchange (DEX) contract
contract SimpleDEX is Ownable, ERC20 {
    // ERC20 token interface to interact with the specified token
    IERC20 public token;

    // Event to log swap transactions
    event Swap(
        address indexed user,
        address indexed fromToken,
        address indexed toToken,
        uint256 amount
    );

    // Constructor to initialize the contract with the token, name, symbol, and owner
    constructor(
        address _token, // address of the token contract
        string memory _name, // name of the liquidity pool token, not your actual Token name that you intend to deposit
        string memory _symbol, // symbol of the liquidity pool token, not your actual Token name that you intend to deposit
        address initialOwner
    ) ERC20(_name, _symbol) Ownable(initialOwner) {
        token = IERC20(_token); // Set the token
    }

    // Function to get the number of tokens held by the contract
    function getTokensInContract() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    // Function to get the number of ETH held by the contract
    function getETHsInContract() public view returns (uint256) {
        return address(this).balance;
    }

    // Function to add liquidity to the contract
    // _amount: amount of tokens to add
    function addLiquidity(uint256 _amount) public payable returns (uint256) {
        uint256 _liquidity;
        uint256 balanceInEth = getETHsInContract() - msg.value; // Current ETH balance of the contract excluding current deposit
        uint256 tokenReserve = getTokensInContract(); // Current token balance of the contract

        // If there's no token reserve, initialize the liquidity pool
        if (tokenReserve == 0) {
            require(msg.value > 0, "Must send ETH to add liquidity");
            require(_amount > 0, "Must send tokens to add liquidity");
            token.transferFrom(msg.sender, address(this), _amount); // Transfer tokens from user to contract
            _liquidity = msg.value; // Set initial liquidity to the ETH balance
            _mint(msg.sender, _liquidity); // Mint liquidity tokens to the user
        } else {
            uint256 reservedEth = balanceInEth; // ETH reserve excluding the current deposit
            uint256 reservedTokens = tokenReserve;

            // Check if reservedEth is zero before performing the division
            if (reservedEth == 0) {
                require(
                    _amount > 0,
                    "Amount of tokens sent is less than the minimum tokens required"
                );
            } else {
                // Calculates how many tokens can be bought for provided ETH value.
                // The number of tokens being sent must be greater than or equal to that many number of tokens.
                require(
                    _amount >= (msg.value * reservedTokens) / reservedEth,
                    "Amount of tokens sent is less than the minimum tokens required"
                );
            }

            token.transferFrom(msg.sender, address(this), _amount); // Transfer tokens from user to contract
            unchecked {
                // totalSupply() refers to the total number of liquidity tokens that have been minted and are currently in circulation.
                _liquidity = (totalSupply() * msg.value) / reservedEth; // Calculate liquidity to be minted
            }
            _mint(msg.sender, _liquidity); // Mint liquidity tokens to the user
        }
        return _liquidity;
    }

    // Function to remove liquidity from the contract
    // _amount: amount of liquidity tokens to burn
    function removeLiquidity(
        uint256 _amount
    ) public returns (uint256, uint256) {
        require(_amount > 0, "Amount should be greater than zero");
        uint256 _reservedEth = getETHsInContract(); // Current ETH reserve
        uint256 _totalSupply = totalSupply(); // Total supply of liquidity tokens

        // Calculate the amounts of ETH and tokens to be returned to the user
        uint256 _ethAmount = (_reservedEth * _amount) / _totalSupply;
        uint256 _tokenAmount = (getTokensInContract() * _amount) / _totalSupply;
        _burn(msg.sender, _amount); // Burn liquidity tokens from the user
        payable(msg.sender).transfer(_ethAmount); // Transfer ETH to the user
        token.transfer(msg.sender, _tokenAmount); // Transfer tokens to the user
        return (_ethAmount, _tokenAmount);
    }

    // Swap Logic
    // before swap: K = x * y
    // during swap: K' = (x + x') * y'
    // But K must always be a constant so K = K', x*y = (x+x') * y'
    // y' = (x*y)/(x+x')
    // z = y - y'
    // K - constant product
    // x - ETH amount in contract before swap
    // y - token amount before swap
    // x' - new deposit of ETH
    // y' - new amount of token after swap, y' < y always as we release some tokens on swap
    // z - the amount of token release during the swap, which is y - y'

    // Function to calculate the amount of output tokens for a given input amount
    // inputAmount: amount of input tokens
    // inputReserve: reserve of input tokens in the contract
    // outputReserve: reserve of output tokens in the contract
    function getAmountOfTokens(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) public pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "Invalid Reserves");
        uint256 inputAmountWithFee = (inputAmount * 99) / 100; // Apply a 1% fee
        uint256 numerator = (inputReserve * outputReserve);
        uint256 denominator = (inputAmountWithFee + inputReserve);
        unchecked {
            return outputReserve - (numerator / denominator); // Return the calculated output amount, z = y - y', where y' = (x*y)/(x+x')
        }
    }

    // Function to swap ETH for tokens
    function swapEthToToken() public payable {
        uint256 _tokensBought = getAmountOfTokens(
            msg.value, // x' - New deposit
            getETHsInContract(), // x - ETH reserve before swap
            getTokensInContract() // y - Token reserve before swap
        );
        token.transfer(msg.sender, _tokensBought); // Transfer the bought tokens to the user
        emit Swap(msg.sender, address(0), address(token), _tokensBought);
    }

    // Function to swap tokens for ETH
    // _tokensSold: amount of tokens to sell
    function swapTokenToEth(uint256 _tokensSold) public {
        uint256 ethBought = getAmountOfTokens(
            _tokensSold, // x' - New deposit
            getTokensInContract(), // x - Token reserve before swap
            getETHsInContract() // y - ETH reserve before swap
        );
        token.transferFrom(msg.sender, address(this), _tokensSold); // Transfer tokens from user to contract
        payable(msg.sender).transfer(ethBought); // Transfer the bought ETH to the user
        emit Swap(msg.sender, address(token), address(0), _tokensSold);
    }
}
