const WineNotBlockchain = artifacts.require("WineNotBlockchain");
const {BN, expectRevert, expectEvent,balance} = require('@openzeppelin/test-helpers');
const {expect} = require('chai');




contract("WineNotBlockchain", accounts => {

    const _owner = accounts[0];
    console.log("the owner is " + _owner);
    const _producer = accounts[1];
    console.log("the producer is " + _producer);
    const _buyer = accounts[2];
    console.log("the buyer is " + _buyer);
    const _seller = accounts[3];
    console.log("the seller is " + _seller);
    const _producerName = "testName";
    const _designationOfOrigin = "testOrigin";
    const _vintage = 1990;
    const _serialNumber = 1;
    const _tokenURI = "testURI";
    const testId = 1;
    const testPrice = 2;

    
    let MyContractInstance;


    describe("Testing the WhitelistProducer function", () => {
        
        beforeEach(async function() {
            MyContractInstance = await WineNotBlockchain.new({from: _owner});
        });

        it("Should whitelist a Producer", async() => {
            await MyContractInstance.whitelistProducer(_producer);
            const storedData = await MyContractInstance.isWhitelistedProducer(_producer, {from: _owner});
            expect(storedData).to.equal(true);
        });

        it("Only the Owner should add a Producer", async() => {
            await expectRevert(MyContractInstance.whitelistProducer(_producer,{from: _producer}),"Ownable: caller is not the owner");
            await expectRevert(MyContractInstance.whitelistProducer(_producer,{from: _buyer}),"Ownable: caller is not the owner");
            await expectRevert(MyContractInstance.whitelistProducer(_producer,{from: _seller}),"Ownable: caller is not the owner");

        });

        it("A WhitelistProducer Event should be emitted", async() => {
            const storedData = await MyContractInstance.whitelistProducer(_producer);
            await expectEvent(storedData, 'WhitelistedProducer',this._producer,true);
        });


    });

    describe("Testing the revokeProducer function", () => {
        
        beforeEach(async function() {
            MyContractInstance = await WineNotBlockchain.new({from: _owner});
            await MyContractInstance.whitelistProducer(_producer);


        });

        it("Should revoke a Producer", async() => {
            await MyContractInstance.revokeProducer(_producer);
            const storedData = await MyContractInstance.isWhitelistedProducer(_producer, {from: _owner});
            expect(storedData).to.equal(false);
        });

        it("Only the Owner should revoke a Producer", async() => {
            await expectRevert(MyContractInstance.revokeProducer(_producer,{from: _producer}),"Ownable: caller is not the owner");
            await expectRevert(MyContractInstance.revokeProducer(_producer,{from: _buyer}),"Ownable: caller is not the owner");
            await expectRevert(MyContractInstance.revokeProducer(_producer,{from: _seller}),"Ownable: caller is not the owner");

        });

        it("A WhitelistProducer Event should be emitted", async() => {
            const storedData = await MyContractInstance.revokeProducer(_producer);
            await expectEvent(storedData, 'WhitelistedProducer',this._producer,false);
        });
        
    });

    describe("Testing the isWhitelisted function", () => {
        
        beforeEach(async function() {
            MyContractInstance = await WineNotBlockchain.new({from: _owner});
            await MyContractInstance.whitelistProducer(_producer);


        });

        it("Should return true", async() => {
            const storedData = await MyContractInstance.isWhitelistedProducer(_producer, {from: _owner});
            expect(storedData).to.equal(true);
        });

        it("should return false", async() => {
            await MyContractInstance.revokeProducer(_producer);
            const storedData = await MyContractInstance.isWhitelistedProducer(_producer, {from: _owner});
            expect(storedData).to.equal(false);
        });


    
    });

    describe("Testing the Mint function", () => {
            
        beforeEach(async function() {
            MyContractInstance = await WineNotBlockchain.new({from: _owner});
            await MyContractInstance.whitelistProducer(_producer);
            await MyContractInstance.mintWineBottle(_producerName,_designationOfOrigin,_vintage,_serialNumber,_tokenURI, {from: _producer});
        });

        it("Only the whitelisted producer should mint a NFT  ", async() => {
            await expectRevert(MyContractInstance.mintWineBottle(_producerName,_designationOfOrigin,_vintage,_serialNumber,_tokenURI, {from: _owner}),"Not WL");
            await expectRevert(MyContractInstance.mintWineBottle(_producerName,_designationOfOrigin,_vintage,_serialNumber,_tokenURI, {from: _buyer}),"Not WL");
            await expectRevert(MyContractInstance.mintWineBottle(_producerName,_designationOfOrigin,_vintage,_serialNumber,_tokenURI, {from: _seller}),"Not WL");

        });

        it("Should mint a NFT with the _Id 1 ", async() => {
            const storedData = await MyContractInstance.getTotalSupply({from : _owner});
            expect(storedData).to.be.bignumber.equal(new BN(1));
        });

        it("Should create a Bottle with all the elements ", async() => {
            const storedData = await MyContractInstance.getBottleInfo(1);
            expect(storedData.producer).to.equal(_producer);
            expect(storedData.producerName).to.equal(_producerName);
            expect(storedData.designationOfOrigin).to.equal(_designationOfOrigin);
            expect(Number(storedData.vintage)).to.equal(_vintage);
            expect(Number(storedData.serialNumber)).to.equal(_serialNumber);
        });

        it("Should create a Bottle with the correct URI ", async() => {
            const storedData = await MyContractInstance.getBottleURI(1);
            expect(storedData).to.equal(_tokenURI);
        });

        it("The Bottle should be owned by the producer", async() => {
            const storedData = await MyContractInstance.getBottleOwner(1);
            expect(storedData).to.be.equal(_producer);
        });

        it("Should put the Bottle created at a state not for sale and a price of 0 Ether", async() => {
            const storedData = await MyContractInstance.getBottleSaleInfo(1);
            expect(storedData.price).to.be.bignumber.equal(new BN(0));
            expect(storedData.onSale).to.equal(false);

        });

        it("Should put the Bottle created at a state minted", async() => {
            const storedData = await MyContractInstance.getBottleStatus(1);
            expect(storedData).to.be.bignumber.equal(new BN(0));
        });

        it("Two Bottles should be different and can't have the same serial Number for the same producer ", async() => {
            await expectRevert.unspecified(MyContractInstance.mintWineBottle(_producerName,_designationOfOrigin,_vintage,_serialNumber,_tokenURI, {from: _producer}));

        });

        it("A BottleCreation Event should be emitted", async() => {
            const storedData = await MyContractInstance.mintWineBottle(_producerName,_designationOfOrigin,_vintage,2,_tokenURI, {from: _producer});
            await expectEvent(storedData, 'BottleCreation',this._producer,2);
        });
        

    });

    describe("Testing the SellBottle function", () => {
        
        beforeEach(async function() {
            MyContractInstance = await WineNotBlockchain.new({from: _owner});
            await MyContractInstance.whitelistProducer(_producer);
            await MyContractInstance.mintWineBottle(_producerName,_designationOfOrigin,_vintage,_serialNumber,_tokenURI, {from: _producer});
            await MyContractInstance.sellBottle(testId,testPrice, {from:_producer})


        });

        it("Only the Owner of the Bottle can sell it", async() => {
            await expectRevert(MyContractInstance.sellBottle(testId,testPrice,{from: _owner}),"You are not the owner of this WineBottle");
            await expectRevert(MyContractInstance.sellBottle(testId,testPrice,{from: _buyer}),"You are not the owner of this WineBottle");
            await expectRevert(MyContractInstance.sellBottle(testId,testPrice,{from: _seller}),"You are not the owner of this WineBottle");
        });

        it("The Bottle should be on sale and with a price of TestPrice", async() => {
            const storedData = await MyContractInstance.getBottleSaleInfo(testId);
            expect(storedData.price).to.be.bignumber.equal(new BN(2000000000000000000n));
            expect(storedData.onSale).to.equal(true);
        });

        it("The producer should be able to change the price of the Bottle", async() => {
            await MyContractInstance.sellBottle(testId,testPrice*2, {from:_producer})
            const storedData = await MyContractInstance.getBottleSaleInfo(testId);
            expect(storedData.price).to.be.bignumber.equal(new BN(4000000000000000000n));


        });

    });


    describe("Testing the BuyBottle function", () => {
        
        beforeEach(async function() {
            MyContractInstance = await WineNotBlockchain.new({from: _owner});
            await MyContractInstance.whitelistProducer(_producer);
            await MyContractInstance.mintWineBottle(_producerName,_designationOfOrigin,_vintage,_serialNumber,_tokenURI, {from: _producer});
            await MyContractInstance.sellBottle(testId,testPrice, {from:_producer})


        });

        it("The Bottle should change of owner when it is brought", async() => {
            await MyContractInstance.buyBottle(testId,{from: _buyer,value:new BN(2000000000000000000n)});
            const storedData = await MyContractInstance.getBottleOwner(1);
            expect(storedData).to.be.equal(_buyer);
        });

        it("a Sale should be recorded when it is brought", async() => {
            await MyContractInstance.buyBottle(testId,{from: _buyer,value:new BN(2000000000000000000n)});
            const storedData = await MyContractInstance.getSalesHistory(1);
            expect(storedData[0].seller).to.be.equal(_producer);
            expect(storedData[0].buyer).to.be.equal(_buyer);
        });



        it("The price to buy the Bottle should not inferior to the real price ", async() => {
            await expectRevert(MyContractInstance.buyBottle(testId,{from: _owner,value:new BN(1000000000000000000n)}),"The sent amount does not match the bottle price");
        });

        it("The price to buy the Bottle should not superior to the real price ", async() => {
            await expectRevert(MyContractInstance.buyBottle(testId,{from: _owner,value:new BN(5000000000000000000n)}),"The sent amount does not match the bottle price");
        });

        it("The Bottle is not for sale after the sale", async() => {
            await MyContractInstance.buyBottle(testId,{from: _buyer,value:new BN(2000000000000000000n)});
            const storedData = await MyContractInstance.getBottleSaleInfo(1);
            expect(storedData.price).to.be.bignumber.equal(new BN(0));
            expect(storedData.onSale).to.equal(false);
        });

        it("The Bottle can no be brought 2 times", async() => {
            await MyContractInstance.buyBottle(testId,{from: _buyer,value:new BN(2000000000000000000n)});
            await expectRevert(MyContractInstance.buyBottle(testId,{from: _buyer,value:new BN(2000000000000000000n)}),"This bottle is not for sale");

        });

        
        it("A BottleTransfer Event should be emitted", async() => {
            const storedData = await MyContractInstance.buyBottle(testId,{from: _buyer,value:new BN(2000000000000000000n)});
            await expectEvent(storedData, 'BottleTransfer',this._producer,this.buyer,1,new BN(2000000000000000000n));
        });
        

        it("The seller should receive the money", async () => {
            const sellerBalanceBefore = await balance.current(_producer);
          
            // Acheter la bouteille de vin
            await MyContractInstance.buyBottle(testId,{from: _buyer,value:new BN(2000000000000000000n)});
            const sellerBalanceAfter = await balance.current(_producer);
          
            // Vérifier que le solde du vendeur a augmenté de la bonne quantité
            expect(sellerBalanceAfter).to.be.bignumber.equal(sellerBalanceBefore.add(new BN(2000000000000000000n)));
          });


    });


    describe("Testing the IndicateShipmentToProducer", () => {
        
        beforeEach(async function() {
            MyContractInstance = await WineNotBlockchain.new({from: _owner});
            await MyContractInstance.whitelistProducer(_producer);
            await MyContractInstance.mintWineBottle(_producerName,_designationOfOrigin,_vintage,_serialNumber,_tokenURI, {from: _producer});
            await MyContractInstance.sellBottle(testId,testPrice, {from:_producer})
            await MyContractInstance.buyBottle(testId,{from: _buyer,value:new BN(2000000000000000000n)});

        });

        it("Should Change the status of the Bottle to askedforShipping", async() => {
            await MyContractInstance.indicateShipmentToProducer(1, {from: _buyer});
            const storedData = await MyContractInstance.getBottleStatus(1);
            expect(storedData).to.be.bignumber.equal(new BN(1));
        });

        it("Only the owner of a Bottle can ask for the shipping", async() => {
            await expectRevert(MyContractInstance.indicateShipmentToProducer(1, {from: _owner}),"You are not the owner of this WineBottle");
            await expectRevert(MyContractInstance.indicateShipmentToProducer(1, {from: _producer}),"You are not the owner of this WineBottle");
            await expectRevert(MyContractInstance.indicateShipmentToProducer(1, {from: _seller}),"You are not the owner of this WineBottle");

        });

        it("The owner can only ask one time for shpping", async() => {
            await MyContractInstance.indicateShipmentToProducer(1, {from: _buyer});
            await expectRevert(MyContractInstance.indicateShipmentToProducer(1, {from: _buyer}),"This bottle has already been asked for shipping or is in a different state");

        });

        it("A BottleAskedForShipping Event should be emitted", async() => {
            storedData = await MyContractInstance.indicateShipmentToProducer(1, {from: _buyer});
            await expectEvent(storedData, 'BottleAskedForShipping',1,this.buyer);
        });


    
    });


    describe("Testing the Colateral", () => {
        
        beforeEach(async function() {
            MyContractInstance = await WineNotBlockchain.new({from: _owner});
            await MyContractInstance.whitelistProducer(_producer);
            await MyContractInstance.mintWineBottle(_producerName,_designationOfOrigin,_vintage,_serialNumber,_tokenURI, {from: _producer});
            await MyContractInstance.sellBottle(testId,testPrice, {from:_producer})
            await MyContractInstance.buyBottle(testId,{from: _buyer,value:new BN(2000000000000000000n)});
            await MyContractInstance.indicateShipmentToProducer(1, {from: _buyer});


        });

        it("Should Change the status of the Bottle to Shipped", async() => {
            await MyContractInstance.addCollateral(1, {from: _producer,value:new BN(2000000000000000000n/3n)});
            const storedData = await MyContractInstance.getBottleStatus(1);
            expect(storedData).to.be.bignumber.equal(new BN(2));
        });

        it("Should Add a Collateral Amount which is one third of the price put by the producer", async() => {
            await MyContractInstance.addCollateral(1, {from: _producer,value:new BN(2000000000000000000n/3n)});
            const storedData = await MyContractInstance.getCollateralInfo(1);
            expect(storedData).to.be.bignumber.equal(new BN(2000000000000000000n/3n));
            const sellerBalanceBefore = await balance.current(_producer);

        });

        it("Should increase the balance of the contract by the amount of the collateral", async() => {
            await MyContractInstance.addCollateral(1, {from: _producer,value:new BN(2000000000000000000n/3n)});
            const storedData = await balance.current(MyContractInstance.address);
            expect(storedData).to.be.bignumber.equal(new BN(2000000000000000000n/3n));
        });


        it("Only the Producer can add a collateral", async() => {
            await expectRevert(MyContractInstance.addCollateral(1, {from: _owner,value:new BN(2000000000000000000n/3n)}),"You are not the producer of this WineBottle");
            await expectRevert(MyContractInstance.addCollateral(1, {from: _buyer,value:new BN(2000000000000000000n/3n)}),"You are not the producer of this WineBottle");
            await expectRevert(MyContractInstance.addCollateral(1, {from: _seller,value:new BN(2000000000000000000n/3n)}),"You are not the producer of this WineBottle");

        });

        it("The producer can add the collateral one time", async() => {
            await MyContractInstance.addCollateral(1, {from: _producer,value:new BN(2000000000000000000n/3n)});
            await expectRevert(MyContractInstance.addCollateral(1, {from: _producer,value:new BN(2000000000000000000n/3n)}),"This bottle has already been shipped or is in a different state");

        });

        it("A CollateralAdded Event should be emitted", async() => {
            storedData = await MyContractInstance.addCollateral(1, {from: _producer,value:new BN(2000000000000000000n/3n)});
            await expectEvent(storedData, 'CollateralAdded',1,this.buyer,new BN(2000000000000000000n/3n));
        });


    
    });


    describe("Testing the ConfirmDeliveryFunction", () => {

        beforeEach(async function() {
            MyContractInstance = await WineNotBlockchain.new({from: _owner});
            await MyContractInstance.whitelistProducer(_producer);
            await MyContractInstance.mintWineBottle(_producerName,_designationOfOrigin,_vintage,_serialNumber,_tokenURI, {from: _producer});
            await MyContractInstance.sellBottle(testId,testPrice, {from:_producer})
            await MyContractInstance.buyBottle(testId,{from: _buyer,value:new BN(2000000000000000000n)});
            await MyContractInstance.indicateShipmentToProducer(1, {from: _buyer});
            await MyContractInstance.addCollateral(1, {from: _producer,value:new BN(2000000000000000000n/3n)});



        });

        it("Should Change the status of the Bottle to received", async() => {
            await MyContractInstance.confirmDelivery(1, {from: _buyer});
            const storedData = await MyContractInstance.getBottleStatus(1);
            expect(storedData).to.be.bignumber.equal(new BN(3));
        });

        it("Only the owner of a Bottle can confirm the delivery", async() => {
            await expectRevert(MyContractInstance.confirmDelivery(1, {from: _producer}),"You are not the owner of this WineBottle");
            await expectRevert(MyContractInstance.confirmDelivery(1, {from: _seller}),"You are not the owner of this WineBottle");
            await expectRevert(MyContractInstance.confirmDelivery(1, {from: _owner}),"You are not the owner of this WineBottle");

        });

        it("The owner can only confirm one time", async() => {
            await MyContractInstance.confirmDelivery(1, {from: _buyer});
            await expectRevert(MyContractInstance.confirmDelivery(1, {from: _buyer}),"Collateral has not been added by the producer");

        });

        it("The producer should receive his money back", async () => {
            const sellerBalanceBefore = await balance.current(_producer);
          
            // Confirmer la transaction
            await MyContractInstance.confirmDelivery(1, {from: _buyer});
            const sellerBalanceAfter = await balance.current(_producer);
          
            // Vérifier que le solde du producteur a augmenté de la bonne quantité
            expect(sellerBalanceAfter).to.be.bignumber.equal(sellerBalanceBefore.add(new BN(2000000000000000000n/3n)));
          });

        it("A ConfirmedDelivery Event should be emitted", async() => {
            storedData = await MyContractInstance.confirmDelivery(1, {from: _buyer});
            await expectEvent(storedData, 'ConfirmedDelivery',1,this.buyer,new BN(2000000000000000000n/3n));
        });

    
    });


    describe("Testing the ContestShipment Function", () => {

        beforeEach(async function() {
            MyContractInstance = await WineNotBlockchain.new({from: _owner});
            await MyContractInstance.whitelistProducer(_producer);
            await MyContractInstance.mintWineBottle(_producerName,_designationOfOrigin,_vintage,_serialNumber,_tokenURI, {from: _producer});
            await MyContractInstance.sellBottle(testId,testPrice, {from:_producer})
            await MyContractInstance.buyBottle(testId,{from: _buyer,value:new BN(2000000000000000000n)});
            await MyContractInstance.indicateShipmentToProducer(1, {from: _buyer});
            await MyContractInstance.addCollateral(1, {from: _producer,value:new BN(2000000000000000000n/3n)});



        });

        it("Should Change the status of the Bottle to contested", async() => {
            await MyContractInstance.contestShipment(1, {from: _buyer});
            const storedData = await MyContractInstance.getBottleStatus(1);
            expect(storedData).to.be.bignumber.equal(new BN(4));
        });

        it("Only the owner of a Bottle can contest the shipping", async() => {
            await expectRevert(MyContractInstance.contestShipment(1, {from: _producer}),"You are not the owner of this WineBottle");
            await expectRevert(MyContractInstance.contestShipment(1, {from: _seller}),"You are not the owner of this WineBottle");
            await expectRevert(MyContractInstance.contestShipment(1, {from: _owner}),"You are not the owner of this WineBottle");

        });

        it("The owner can only contest one time", async() => {
            await MyContractInstance.contestShipment(1, {from: _buyer});
            await expectRevert(MyContractInstance.contestShipment(1, {from: _buyer}),"This bottle has already been contested");

        });

        it("The owner can not contest when he has already confirmed the reception", async() => {
            await MyContractInstance.confirmDelivery(1, {from: _buyer});
            await expectRevert(MyContractInstance.contestShipment(1, {from: _buyer}),"This bottle has already been received");

        });
        

        it("The producer can olny get his collateral once the issue is solved by WineNotBlockhain Team", async () => {
            await MyContractInstance.contestShipment(1, {from: _buyer});
            //issue solved
            await MyContractInstance.confirmDelivery(1, {from: _buyer});


          });

        it("A ContestedDelivery Event should be emitted", async() => {
            storedData = await MyContractInstance.contestShipment(1, {from: _buyer});
            await expectEvent(storedData, 'ContestedDelivery',1,this.buyer);
        });



    
    });


    describe("Test the getTotalSupply", () => {

        beforeEach(async function() {
            MyContractInstance = await WineNotBlockchain.new({from: _owner});
            await MyContractInstance.whitelistProducer(_producer);
            await MyContractInstance.mintWineBottle(_producerName,_designationOfOrigin,_vintage,_serialNumber,_tokenURI, {from: _producer})
        });

        it("Should return 1", async() => {
            const storedData = await MyContractInstance.getTotalSupply({from :_owner});
            expect(storedData).to.be.bignumber.equal(new BN(1));
        });
    });

    describe("Test the getBottlesBalance", () => {

        beforeEach(async function() {
            MyContractInstance = await WineNotBlockchain.new({from: _owner});
            await MyContractInstance.whitelistProducer(_producer);
            await MyContractInstance.mintWineBottle(_producerName,_designationOfOrigin,_vintage,_serialNumber,_tokenURI, {from: _producer})
        });

        it("Should return 1", async() => {
            const storedData = await MyContractInstance.getBottlesBalance({from :_producer});
            expect(storedData).to.be.bignumber.equal(new BN(1));
        });

    });






});