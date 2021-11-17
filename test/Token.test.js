import { tokens, EVM_REVERT, INVALID_ADDRESS } from "../src/utils/helpers";
const Token = artifacts.require("./Token");

require("chai").use(require("chai-as-promised")).should();

contract("Token", ([deployer, reciever, exchange]) => {
  let token;
  const name = "DApp Token";
  const symbol = "DAPP";
  const decimals = "18";
  const totalSupply = tokens(1000000);

  beforeEach(async () => {
    // Fetch token from blockchain
    token = await Token.new();
  });

  describe("deployment", () => {
    it("tracks the name", async () => {
      // Read token name
      // check Token name is My Name
      const result = await token.name();

      result.should.equal(name);
    });

    it("tracks the symbol", async () => {
      const result = await token.symbol();
      result.should.equal(symbol);
    });

    it("tracks the decimal", async () => {
      const result = await token.decimals();
      result.toString().should.equal(decimals);
    });

    it("tracks the total supply", async () => {
      const result = await token.totalSupply();
      result.toString().should.equal(totalSupply.toString());
    });

    it("assigns the total supply to the deployer", async () => {
      const result = await token.balanceOf(deployer);
      result.toString().should.equal(totalSupply.toString());
    });
  });

  describe("sending tokens", () => {
    let result;
    let amount;
    describe("success", () => {
      beforeEach(async () => {
        amount = tokens(100);
        result = await token.transfer(reciever, amount, { from: deployer });
      });
      it("transfers token balances", async () => {
        let balanceOf;

        // before transfer
        //   balanceOf = await token.balanceOf(deployer);
        //   console.log("deployer balance before transfer", balanceOf.toString());
        //   balanceOf = await token.balanceOf(reciever);
        //   console.log("reciever balance before transfer", balanceOf.toString());

        // transfer
        //   await token.transfer(reciever, tokens(100), {
        //     from: deployer,
        //   });

        // after transfer
        balanceOf = await token.balanceOf(deployer);
        balanceOf.toString().should.equal(tokens(999900).toString());
        //   console.log("deployer balance after transfer", balanceOf.toString());

        balanceOf = await token.balanceOf(reciever);
        balanceOf.toString().should.equal(tokens(100).toString());
        //   console.log("reciever balance after transfer", balanceOf.toString());
      });

      it("emits a Transfer event", () => {
        const log = result.logs[0];
        log.event.should.equal("Transfer");
        const event = log.args;
        event.from.toString().should.equal(deployer, "from is deployer");
        event.to.toString().should.equal(reciever, "to is correct");
        event.value
          .toString()
          .should.equal(amount.toString(), "value is correct");
      });
    });

    describe("failure", () => {
      it("rejects insufficient balances", async () => {
        let invalidAmount;
        invalidAmount = tokens(100000000); // 100 million is greater than total supply
        await token
          .transfer(reciever, invalidAmount, { from: deployer })
          .should.be.rejectedWith(EVM_REVERT);

        invalidAmount = tokens(10); // recipient has no tokens
        await token
          .transfer(deployer, invalidAmount, { from: reciever })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("rejects invalid recipients", async () => {
        await token
          .transfer(0x0, amount, { from: deployer })
          .should.be.rejectedWith(INVALID_ADDRESS);
      });
    });
  });

  describe("approving tokens", () => {
    let result;
    let amount;

    beforeEach(async () => {
      amount = tokens(100);
      result = await token.approve(exchange, amount, { from: deployer });
    });

    describe("success", () => {
      it("allocates an allowance for delegated token spending", async () => {
        const allowance = await token.allowance(deployer, exchange);
        allowance.toString().should.be.equal(amount.toString());
      });

      it("emits an Approval event", async () => {
        const log = result.logs[0];
        log.event.should.equal("Approval");
        const event = log.args;
        event.owner.toString().should.equal(deployer, "owner is correct");
        event.spender.toString().should.equal(exchange, "spender is correct");
        event.value
          .toString()
          .should.equal(amount.toString(), "value is correct");
      });
    });

    describe("failure", () => {
      it("");
    });
  });
});
