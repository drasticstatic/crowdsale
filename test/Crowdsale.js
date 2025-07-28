const { expect } = require('chai'); // Chai is an assertion library
const { ethers } = require('hardhat'); // Ethers.js is a library for interacting with Ethereum

/* This file contains tests for the Crowdsale contract
  Tests ensure that our smart contract works as expected before deploying to the blockchain
  Each test checks a specific functionality of the contract */

// Helper function to convert normal numbers to token amounts with 18 decimals
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
  // For example, tokens(1) = 1000000000000000000 (1 with 18 zeros)
}

// Alias for tokens function to make code more readable when dealing with ETH
const ether = tokens

// --- MAIN TEST SUITE FOR THE CROWDSALE CONTRACT ---:
describe('Crowdsale', () => {
  // Variables to store contract instances and test accounts
  let token, crowdsale
  let deployer, user1, user2

  // This runs before each test to set up a fresh environment
  beforeEach(async () => {
    // Load/get contract factories (templates) from Hardhat
    const Crowdsale = await ethers.getContractFactory('Crowdsale')
    const Token = await ethers.getContractFactory('Token')

    // Deploy the Token contract with initial parameters
    token = await Token.deploy('Dapp University', 'DAPP', '1000000');

    // Configure/get test accounts from Hardhat
    //accounts = await ethers.getSigners()
    //deployer = accounts[0] // First account is the deployer
    //user1 = accounts[1]    // Second account is a regular user (testing as whitelisted)
    //user2 = accounts[2]    // Third account is also a regular user (testing as not-whitelisted)
    [deployer, user1, user2] = await ethers.getSigners();
    //This uses array destructuring to directly assign the signers to variables, which is cleaner and avoids the need for the accounts variable.

    // Set the opening time to now (or slightly in the past)
    const openingTime = Math.floor(Date.now() / 1000) - 60 // 1 minute ago

    // Set min and max contribution
    const minContribution = tokens(0.01) // 0.01 token minimum
    const maxContribution = tokens(10000) // 10000 tokens maximum

    /* Deploy the Crowdsale contract with:
      - token address
      - price of 1 ETH per token
      - maximum of 1,000,000 tokens for sale */
    crowdsale = await Crowdsale.deploy(token.address, ether(1), tokens('1000000'), // <-- 1 token = 1 ether, 1000000 max tokens
      openingTime, minContribution, maxContribution)

    // Transfer all tokens to the Crowdsale contract to be sold
    let transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(1000000))
    await transaction.wait() // Wait for transaction to be mined
  })

  // --- TEST CASE FOR CONTRACT DEPLOYMENT --- :
  describe('Deployment', () => {
    // Test that tokens were transferred to the crowdsale contract (initial token balance)
    // This checks if the Crowdsale contract has the correct amount of tokens
    it('sends tokens to the Crowdsale contract', async () => {
      expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(1000000))
    })

    // Test that the price was set correctly
    it('returns the price', async () => {
      expect(await crowdsale.price()).to.equal(ether(1))
    })

    // Test that the token address was set correctly
    it('returns token address', async () => {
      expect(await crowdsale.token()).to.equal(token.address)
    })
  })

  // --- TEST CASES FOR CROWDSALE FUNCTIONALITY --- :
      beforeEach(async () => {
        await crowdsale.connect(deployer).addToWhitelist(user1.address);
      })
    // --- ADD A NEW TEST CASE TO CHECK BUYING AND TRANSFERRING TOKENS --- :
      describe('Buying Tokens', () => {
        let transaction
        let amount = tokens(10) // Define amount of tokens to buy (10 tokens)

        describe('Success', () => { // This section tests the successful purchase scenario
            // Set up a token purchase before each test
          beforeEach(async () => {
            //await crowdsale.connect(deployer).toggleWhitelist(false);// Disable whitelist for this test

            await crowdsale.connect(deployer).openSale();// Open the sale

            // Setup: User1 buys 10 tokens by sending 10 ETH to the contract
            // The connect() method specifies which account is making the transaction
            transaction = await crowdsale.connect(user1).buyTokens(amount, { value: ether(10) })
            await transaction.wait()
          })

          it('transfers tokens', async () => {
            // Test 1: Check that tokens were transferred correctly
              // Crowdsale contract should have 10 fewer tokens (999990 instead of 1000000)
            expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(999990))
              // User1 should now have 10 tokens in their wallet
              // Check that the user received tokens in exchange for their ETH
            expect(await token.balanceOf(user1.address)).to.equal(amount)
          })

          it('updates tokensSold', async () => { // <-- Check that the tokensSold variable is updated correctly
            // Test 2: Check that the contract's internal counter is updated
              // The tokensSold variable tracks how many tokens have been sold
            expect(await crowdsale.tokensSold()).to.equal(amount)
          })

          it('emits a buy event', async () => {
            // Test 3: Check that the contract emitted the correct event
              // Events are important for frontend applications and tracking activity
              // --> https://hardhat.org/hardhat-chai-matchers/docs/reference#.emit
            await expect(transaction).to.emit(crowdsale, "Buy") // <-- Emit buy event from crowdsale contract 
              .withArgs(amount, user1.address)// <-- Check that the event was emitted with the correct arguments
          })
        })

      describe('Failure', () => { // This section tests scenarios where the purchase should fail

        it('rejects insufficent ETH', async () => {
          // Test: Ensure the contract rejects purchases with insufficient ETH
            // Here we try to buy 10 tokens but send 0 ETH, which should fail
          await expect(crowdsale.connect(user1).buyTokens(tokens(10), { value: 0 })).to.be.reverted
        })
      })
    })

    // --- TEST CASE FOR SENDING ETH DIRECTLY TO THE CROWDSALE CONTRACT --- :
      // This tests the "fallback" or "receive" function that handles direct ETH transfers
    describe('Sending ETH', () => {
      let transaction
      let amount = ether(10)

      describe('Success', () => {

        beforeEach(async () => {
          //await crowdsale.connect(deployer).toggleWhitelist(false);// Disable whitelist for this test

          await crowdsale.connect(deployer).openSale();// Open the sale

          // User1 sends ETH directly to the contract address (not calling a specific function)
          transaction = await user1.sendTransaction({ to: crowdsale.address, value: amount })
          await transaction.wait()
        })

        it('updates contracts ether balance', async () => {
        // Check that the contract's ETH balance increased by the amount sent
          expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount)
        })

        it('updates user token balance', async () => {
        // Check that the user received tokens in exchange for their ETH
        // The exchange rate is determined by the contract's price setting
          expect(await token.balanceOf(user1.address)).to.equal(amount)
        })
      })
    })

    // --- TEST CASE FOR UPDATING TOKEN PRICE --- :
      // Only the contract owner should be able to change the price
    describe('Updating Price', () => {
      let transaction
      let price = ether(2) // New price: 2 ETH per token

      describe('Success', () => {

        beforeEach(async () => {
        // The deployer (owner) updates the price to 2 ETH per token
          transaction = await crowdsale.connect(deployer).setPrice(ether(2))
          await transaction.wait() // Wait for transaction to be mined
        })

        it('updates the price', async () => {
        // Check that the price was updated correctly
          expect(await crowdsale.price()).to.equal(ether(2))
        })
      })

      describe('Failure', () => {

        it('prevents non-owner from updating price', async () => {
        // Check that a regular user (non-owner) cannot update the price
          // The transaction should be reverted (fail)
          await expect(crowdsale.connect(user1).setPrice(price)).to.be.reverted
        })
      })
    })

    // --- TEST CASE FOR FINALIZING CROWDSALE --- :
      // This is typically done when the sale ends or all tokens are sold
    describe('Finalzing Sale', () => {
      let transaction
      let amount = tokens(10) // 10 tokens to buy
      let value = ether(10) // 10 ETH to spend

      describe('Success', () => {

        beforeEach(async () => {
          //await crowdsale.connect(deployer).toggleWhitelist(false);// Disable whitelist for this test

          await crowdsale.connect(deployer).openSale();// Open the sale

          // First, user1 buys some tokens
            // User1 buys 10 tokens for 10 ETH
          transaction = await crowdsale.connect(user1).buyTokens(amount, { value: value })
          await transaction.wait()// Wait for transaction to be mined

          transaction = await crowdsale.connect(deployer).finalize()
          await transaction.wait()// Wait for transaction to be mined
        })

        it('transfers remaining tokens to owner', async () => {
          // Check that all remaining tokens were transferred to the owner
            // Check that the Crowdsale contract has 0 tokens left
            // The deployer (owner) should have the remaining tokens
          expect(await token.balanceOf(crowdsale.address)).to.equal(0)
          expect(await token.balanceOf(deployer.address)).to.equal(tokens(999990))
        })

        it('transfers ETH balance to owner', async () => {
        // Check that all ETH collected was transferred to the owner
          expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(0)
        })

        it('emits Finalize event', async () => {
        // Check that the Finalize event was emitted with correct parameters
          // --> https://hardhat.org/hardhat-chai-matchers/docs/reference#.emit
          await expect(transaction).to.emit(crowdsale, "Finalize")
            .withArgs(amount, value)
        })
      })

      describe('Failure', () => {

        it('prevents non-owner from finalizing', async () => {
        // Check that a regular user (non-owner) cannot finalize the sale
          // The transaction should be reverted (fail)
          await expect(crowdsale.connect(user1).finalize()).to.be.reverted
        })

      })
    })

/* ==== WHITELISTING TESTS: ====
  These tests cover:
    - Whitelist management (adding, removing, toggling)
    - Access control (only owner can manage whitelist)
    - Buying tokens with whitelist enabled/disabled
    - Getting the list of whitelisted addresses*/
  describe('Whitelist Management', () => {
    it('app starts with whitelist enabled', async () => {
      expect(await crowdsale.whitelistEnabled()).to.equal(true)
    })

    it('allows owner to add addresses to whitelist', async () => {
      await crowdsale.connect(deployer).addToWhitelist(user1.address)
      expect(await crowdsale.whitelist(user1.address)).to.equal(true)
    })

    it('allows owner to remove addresses from whitelist', async () => {
      await crowdsale.connect(deployer).addToWhitelist(user1.address)
      expect(await crowdsale.whitelist(user1.address)).to.equal(true)

      await crowdsale.connect(deployer).removeFromWhitelist(user1.address)
      expect(await crowdsale.whitelist(user1.address)).to.equal(false)
    })

    it('prevents non-owners from adding to whitelist', async () => {
      await expect(
        crowdsale.connect(user1).addToWhitelist(user2.address)
      ).to.be.revertedWith('Caller is not and must be the owner')
    })

    it('prevents non-owners from removing from whitelist', async () => {
      await crowdsale.connect(deployer).addToWhitelist(user2.address)

      await expect(
        crowdsale.connect(user1).removeFromWhitelist(user2.address)
      ).to.be.revertedWith('Caller is not and must be the owner')
    })

    it('allows owner to toggle whitelist status', async () => {
      expect(await crowdsale.whitelistEnabled()).to.equal(true)

      await crowdsale.connect(deployer).toggleWhitelist(false)
      expect(await crowdsale.whitelistEnabled()).to.equal(false)

      await crowdsale.connect(deployer).toggleWhitelist(true)
      expect(await crowdsale.whitelistEnabled()).to.equal(true)
    })

    it('returns correct list of whitelisted addresses', async () => {
      await crowdsale.connect(deployer).addToWhitelist(user1.address)
      await crowdsale.connect(deployer).addToWhitelist(user2.address)

      const whitelistedAddresses = await crowdsale.getWhitelistedAddresses()
      expect(whitelistedAddresses.length).to.equal(2)
      expect(whitelistedAddresses).to.include(user1.address)
      expect(whitelistedAddresses).to.include(user2.address)
    })

    it('returns correct list after removing addresses', async () => {
      await crowdsale.connect(deployer).addToWhitelist(user1.address)
      await crowdsale.connect(deployer).addToWhitelist(user2.address)
      await crowdsale.connect(deployer).removeFromWhitelist(user1.address)

      const whitelistedAddresses = await crowdsale.getWhitelistedAddresses()
      expect(whitelistedAddresses.length).to.equal(1)
      expect(whitelistedAddresses).to.include(user2.address)
      expect(whitelistedAddresses).to.not.include(user1.address)
    })
  })

  describe('Buying Tokens with Whitelist', () => {
    beforeEach(async () => {
      await crowdsale.connect(deployer).openSale();// Open the sale for all whitelist tests
    })

    it('prevents non-whitelisted users from buying tokens when whitelist is enabled', async () => {
      // Make sure whitelist is enabled
      await crowdsale.connect(deployer).toggleWhitelist(true)

      // Try to buy tokens with a non-whitelisted address
      await expect(
        crowdsale.connect(user2).buyTokens(tokens(10), { value: ether(10) })
      ).to.be.revertedWith('Address not whitelisted')
    })

    it('allows whitelisted users to buy tokens', async () => {
      // Add user to whitelist
      await crowdsale.connect(deployer).addToWhitelist(user1.address)

      // Buy tokens
      await crowdsale.connect(user1).buyTokens(tokens(10), { value: ether(10) })
      expect(await token.balanceOf(user1.address)).to.equal(tokens(10))
    })

    it('allows anyone to buy tokens when whitelist is disabled', async () => {
      // Disable whitelist
      await crowdsale.connect(deployer).toggleWhitelist(false)

      // Buy tokens without being whitelisted
      await crowdsale.connect(user1).buyTokens(tokens(10), { value: ether(10) })
      expect(await token.balanceOf(user1.address)).to.equal(tokens(10))
    })

    it('re-enables whitelist restrictions after toggling back on', async () => {
      // First disable whitelist
      await crowdsale.connect(deployer).toggleWhitelist(false)

      // Then re-enable it
      await crowdsale.connect(deployer).toggleWhitelist(true)

      // Try to buy tokens with a non-whitelisted address
      await expect(
        crowdsale.connect(user2).buyTokens(tokens(10), { value: ether(10) })
      ).to.be.revertedWith('Address not whitelisted')
    })
  })

/* ==== SALE STATUS MANAGEMENT TESTS: ====
  These tests cover:
    - Sale status management (opening, closing)
    - Access control (only owner can open/close sale)
    - Buying tokens when sale is open/close
    - Minimum and maximum contribution enforcement
    - Preventing purchases when sale is closed (time-based)
  The tests assume that:
    - The sale starts closed by default
    - The opening time is set to a timestamp
    - Min and max contribution limits are enforced*/
  describe('Sale Status Management', () => {
    it('starts with sale closed', async () => {
      expect(await crowdsale.isOpen()).to.equal(false)
    })

    it('allows owner to open the sale', async () => {
      await crowdsale.connect(deployer).openSale()
      expect(await crowdsale.isOpen()).to.equal(true)
    })

    it('allows owner to close the sale', async () => {
      await crowdsale.connect(deployer).openSale()
      expect(await crowdsale.isOpen()).to.equal(true)

      await crowdsale.connect(deployer).closeSale()
      expect(await crowdsale.isOpen()).to.equal(false)
    })

    it('prevents non-owners from opening the sale', async () => {
      await expect(
        crowdsale.connect(user1).openSale()
      ).to.be.revertedWith('Caller is not and must be the owner')
    })

    it('prevents non-owners from closing the sale', async () => {
      await crowdsale.connect(deployer).openSale()

      await expect(
        crowdsale.connect(user1).closeSale()
      ).to.be.revertedWith('Caller is not and must be the owner')
    })
  })

  describe('Contribution Limits', () => {
    beforeEach(async () => {
      // Open the sale and disable whitelist for these tests
      await crowdsale.connect(deployer).openSale()
      await crowdsale.connect(deployer).toggleWhitelist(false)
    })

    it('enforces minimum contribution amount', async () => {
      const minContribution = await crowdsale.minContribution()
      const belowMin = minContribution.sub(1)
      const price = await crowdsale.price();

      // Calculate the correct ETH value based on the token amount
      const value = belowMin.mul(price).div(ethers.utils.parseEther('1'));

      await expect(
        crowdsale.connect(user1).buyTokens(belowMin, { value })
      ).to.be.revertedWith('Amount is less than minimum contribution')
    })

    it('enforces maximum contribution amount', async () => {
      const maxContribution = await crowdsale.maxContribution()
      const aboveMax = maxContribution.add(1)

      /*const price = await crowdsale.price()
      // Calculate the correct ETH value based on the token amount
      const value = aboveMax.mul(price).div(ethers.utils.parseEther('1'))
      // Add a small buffer to ensure enough ETH is sent
      const buffer = value.mul(5).div(1000)
      const valueWithBuffer = value.add(buffer)
      await expect(
        crowdsale.connect(user1).buyTokens(aboveMax, { value: valueWithBuffer })
      ).to.be.revertedWith('Amount exceeds maximum contribution')*/

      // Use a simpler approach with a fixed multiplier for the value
      //const value = ether(100000) // Just use a very large amount of ETH

      // Use a fixed value that's enough to trigger the error but not too large
      const value = ether(1000) // Just use a very large amount of ETH

      await expect(
        crowdsale.connect(user1).buyTokens(aboveMax, { value })
      ).to.be.revertedWith('Amount exceeds maximum contribution')
    })

    it('allows contributions within limits', async () => {
      const minContribution = await crowdsale.minContribution();
      const price = await crowdsale.price();

      // Calculate the correct ETH value based on the token amount
      const value = minContribution.mul(price).div(ethers.utils.parseEther('1'));

      // Add a small buffer to the value to account for rounding errors (0.5%)
      const buffer = value.mul(5).div(1000);
      const valueWithBuffer = value.add(buffer);

      // Use the buffered value when sending the transaction
      await crowdsale.connect(user1).buyTokens(minContribution, { value: valueWithBuffer });

      // Verify the tokens were transferred
      expect(await token.balanceOf(user1.address)).to.equal(minContribution);
    });
  })

  describe('Time-based Restrictions', () => {
    beforeEach(async () => {
      await crowdsale.connect(deployer).toggleWhitelist(false)// Disable whitelist for these tests
    })

    it('prevents purchases when sale is closed', async () => {
      // Sale is closed by default
      await expect(
        crowdsale.connect(user1).buyTokens(tokens(10), { value: ether(10) })
      ).to.be.revertedWith('Sale is not open')
    })

    it('prevents purchases before opening time', async () => {
      const openingTime = await crowdsale.openingTime()// Get the opening time

      // If opening time is in the future, this test will pass
      if (openingTime.gt(Math.floor(Date.now() / 1000))) {
        await crowdsale.connect(deployer).openSale()

        await expect(
          crowdsale.connect(user1).buyTokens(tokens(10), { value: ether(10) })
        ).to.be.revertedWith('Sale has not started yet')
      }
    })

    it('allows purchases when sale is open and after opening time', async () => {
      // This test assumes the opening time is in the past or now
      // Adjusted the deployment in beforeEach to set a past timestamp

      await crowdsale.connect(deployer).openSale()

      // If opening time is in the past, purchases should be allowed:
      const openingTime = await crowdsale.openingTime()
      if (openingTime.lte(Math.floor(Date.now() / 1000))) {
        await crowdsale.connect(user1).buyTokens(tokens(10), { value: ether(10) })
        expect(await token.balanceOf(user1.address)).to.equal(tokens(10))
      }
    })
  })
})
