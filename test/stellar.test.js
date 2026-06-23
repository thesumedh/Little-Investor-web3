const chai = require('chai');
const expect = chai.expect;
const axios = require('axios');
const StellarSdk = require('@stellar/stellar-sdk');
const stellarController = require('../src/controller/stellarController');

describe('Stellar Integration Test Suite', function() {
  this.timeout(120000); // Deploying and invoking contracts on testnet can take up to 2 minutes

  it('1. Should generate a random Stellar keypair and query its balance as unfunded (0)', async () => {
    const pair = StellarSdk.Keypair.random();
    const pubkey = pair.publicKey();
    
    // Simulate req/res for getBalance
    const req = { params: { address: pubkey } };
    let jsonResult = null;
    const res = {
      json: (data) => { jsonResult = data; },
      status: function(code) { return this; }
    };

    await stellarController.getBalance(req, res);

    expect(jsonResult).to.not.be.null;
    expect(jsonResult.success).to.be.true;
    expect(jsonResult.balance).to.equal(0);
    expect(jsonResult.status).to.equal('unfunded');
  });

  it('2. Should generate and fund a child account via createChildProfile', async () => {
    const req = {};
    let jsonResult = null;
    const res = {
      json: (data) => { jsonResult = data; },
      status: function(code) { return this; }
    };

    await stellarController.createChildProfile(req, res);

    expect(jsonResult).to.not.be.null;
    expect(jsonResult.success).to.be.true;
    expect(jsonResult.publicKey).to.be.a('string');
    expect(jsonResult.secret).to.be.a('string');

    // Verify keypair validity
    const pair = StellarSdk.Keypair.fromSecret(jsonResult.secret);
    expect(pair.publicKey()).to.equal(jsonResult.publicKey);
  });

  it('3. Should fund an unfunded account using the fundFaucet route', async () => {
    const pair = StellarSdk.Keypair.random();
    const req = { body: { address: pair.publicKey() } };
    let jsonResult = null;
    const res = {
      json: (data) => { jsonResult = data; },
      status: function(code) { return this; }
    };

    await stellarController.fundFaucet(req, res);

    expect(jsonResult).to.not.be.null;
    expect(jsonResult.success).to.be.true;
    expect(jsonResult.message).to.contain('funded');
  });

  it('4. Should distribute a reward payment from the master treasury to a child account', async () => {
    // Generate a child account first
    const childPair = StellarSdk.Keypair.random();
    // Fund child account first so it exists
    await axios.get(`https://friendbot.stellar.org/?addr=${childPair.publicKey()}`);

    const req = {
      body: {
        childAddress: childPair.publicKey(),
        amount: 2.5
      }
    };
    let jsonResult = null;
    const res = {
      json: (data) => { jsonResult = data; },
      status: function(code) { return this; }
    };

    await stellarController.sendReward(req, res);

    expect(jsonResult).to.not.be.null;
    expect(jsonResult.success).to.be.true;
    expect(jsonResult.hash).to.be.a('string');
    expect(jsonResult.ledger).to.be.a('number');
  });

  it('5. Should deploy, initialize and interact with AllowanceVault contract', async () => {
    // Generate parent & child
    const parentPair = StellarSdk.Keypair.random();
    const childPair = StellarSdk.Keypair.random();
    
    // Fund parent & child so they exist on-chain
    await axios.get(`https://friendbot.stellar.org/?addr=${parentPair.publicKey()}`);
    await axios.get(`https://friendbot.stellar.org/?addr=${childPair.publicKey()}`);
    
    // Deploy contract
    let jsonResult = null;
    const resDeploy = {
      json: (data) => { jsonResult = data; },
      status: function(code) { return this; }
    };
    
    await stellarController.deployVault({}, resDeploy);
    expect(jsonResult).to.not.be.null;
    expect(jsonResult.success).to.be.true;
    expect(jsonResult.contractId).to.be.a('string');
    
    const contractId = jsonResult.contractId;
    
    // Initialize contract
    let initResult = null;
    const resInit = {
      json: (data) => { initResult = data; },
      status: function(code) { return this; }
    };
    
    await stellarController.initializeVault({
      body: {
        contractId,
        parent: parentPair.publicKey(),
        child: childPair.publicKey(),
        limit: 50
      }
    }, resInit);
    expect(initResult.success).to.be.true;
    
    // Get Details
    let detailsResult = null;
    const resDetails = {
      json: (data) => { detailsResult = data; },
      status: function(code) { return this; }
    };
    
    await stellarController.getVaultDetails({
      params: { contractId }
    }, resDetails);
    
    expect(detailsResult.success).to.be.true;
    expect(detailsResult.details).to.contain(parentPair.publicKey());
    expect(detailsResult.details).to.contain(childPair.publicKey());
    
    // Update Limit
    let limitResult = null;
    const resLimit = {
      json: (data) => { limitResult = data; },
      status: function(code) { return this; }
    };
    
    await stellarController.setVaultLimit({
      body: {
        contractId,
        limit: 75,
        parentSecret: parentPair.secret()
      }
    }, resLimit);
    console.log("LIMIT RESULT:", limitResult);
    expect(limitResult.success).to.be.true;
    
    // Child Spend XLM
    let spendResult = null;
    const resSpend = {
      json: (data) => { spendResult = data; },
      status: function(code) { return this; }
    };
    
    await stellarController.vaultSpend({
      body: {
        contractId,
        amount: 20,
        childSecret: childPair.secret()
      }
    }, resSpend);
    expect(spendResult.success).to.be.true;

    // Get Details again to verify limit & spent
    let detailsResult2 = null;
    const resDetails2 = {
      json: (data) => { detailsResult2 = data; },
      status: function(code) { return this; }
    };
    
    await stellarController.getVaultDetails({
      params: { contractId }
    }, resDetails2);
    
    expect(detailsResult2.success).to.be.true;
    expect(detailsResult2.details).to.contain('75'); // limit
    expect(detailsResult2.details).to.contain('20'); // spent
  });
});
