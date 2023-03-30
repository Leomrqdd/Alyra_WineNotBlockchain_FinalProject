import React from 'react';
import { FormControl, FormLabel, Input, Button,Flex,Text } from "@chakra-ui/react";
import useEth from "../contexts/EthContext/useEth";
import { useState, useEffect} from 'react';
const BigNumber = require('bignumber.js');





function ViewerComponent() {

  const { state: { contract, accounts,web3 } } = useEth();
  const [bottleTransfer, setBottleTransfer] = useState([]);
  const [price, setPrice] = useState('');
  const [saleEvent, setSaleEvent] = useState([]);
  const [bottleInfo, setBottleInfo] = useState({});
  const [bottleInfoSale, setBottleInfoSale] = useState({});
  const [bottleSales, setBottleSales] = useState({});
  const [bottleStatus, setBottleStatus] = useState(null);
  const [bottleOwner, setBottleOwner] = useState(null);
  const [bottleBalance, setBottleBalance] = useState(null);
  const [bottleShipping, setBottleShipping] = useState(null);
  const [bottleShippingEvent, setBottleShippingEvent] = useState([]);
  const [bottleCollateralOldEvent, setBottleCollateralOldEvent] = useState([]);
  const [confirmShipment, setconfirmShipment] = useState(null);
  const [contestDelivery, setcontestDelivery] = useState([]);
  const [confirmDeliverylOldEvent, setconfirmDeliveryOldEvent] = useState([]);













  const [id, setId] = useState('');
  const [id2, setId2] = useState('');
  const [id3, setId3] = useState('');
  const [id4, setId4] = useState('');
  const [id5, setId5] = useState('');
  const [id6, setId6] = useState('');
  const [id7, setId7] = useState('');
  const [id8, setId8] = useState('');
  const [id9, setId9] = useState('');
  const [id10, setId10] = useState('');








  const handleBuy = async () => {
    const priceinWei = (await contract.methods.getBottleSaleInfo(id).call({ from: accounts[0]})).price;
    const result = await contract.methods
      .buyBottle(id)
      .send({ from: accounts[0], value : priceinWei.toString()})

    console.log(result);  
  };

  const handleSell = async () => {
    const result = await contract.methods
      .sellBottle(id6, price)
      .send({ from: accounts[0] });

    console.log(result);
  };

  const handleGetBottleInfo = async () => {
    const info = await contract.methods
    .getBottleInfo(id2)
    .call({ from: accounts[0] }); 

    setBottleInfo(info);
  };

  const handleGetBottleInfoSale = async () => {
    const info = await contract.methods
    .getBottleSaleInfo(id3)
    .call({ from: accounts[0] }); 

    setBottleInfoSale(info);
  };

  const handleGetBottleSales = async () => {
    const info = await contract.methods
    .getSalesHistory(id4)
    .call({ from: accounts[0] }); 

    setBottleSales(info);

  };

  
  const handleGetBottleStatus = async () => {
    const info = await contract.methods
    .getBottleStatus(id5)
    .call({ from: accounts[0] }); 

    setBottleStatus(info);


  };


  const handleGetBottleOwner = async () => {
    const info = await contract.methods
    .getBottleOwner(id7)
    .call({ from: accounts[0] }); 

    setBottleOwner(info);


  };


  const handleGetBottleBalance = async () => {
    const info = await contract.methods
    .getBottlesBalance()
    .call({ from: accounts[0] }); 

    setBottleBalance(info);


  };

  const handleGetBottleShipping = async () => {
    const info = await contract.methods
    .indicateShipmentToProducer(id8)
    .send({ from: accounts[0] }); 

    setBottleShipping(info);


  };

  const handleGetConfirmShipment = async () => {
    const info = await contract.methods
    .confirmDelivery(id9)
    .send({ from: accounts[0] }); 

    setconfirmShipment(info);
    console.log(info)

  };

  const handleGetContestDelivery = async () => {
    const info = await contract.methods
    .contestShipment(id10)
    .send({ from: accounts[0] }); 

    setcontestDelivery(info);
    console.log(info)

  };




  
  useEffect(() => {
    
    const printTransferEvent = async () => {
      await contract.events.BottleTransfer({ fromBlock: "earliest" })
        .on("data", (event) => {
          setBottleTransfer([event.returnValues.from, event.returnValues.to,event.returnValues.id,event.returnValues.price])
     })
        .on("error", (err) => console.log(err));
    };
    printTransferEvent();
  }, [accounts, contract]);


  useEffect(() => {
    
    const printSaleEvent = async () => {
      await contract.events.BottleForSale({ fromBlock: "earliest" })
        .on("data", (event) => {
          const priceInEther = web3.utils.fromWei(event.returnValues.price, 'ether');
          setSaleEvent([event.returnValues.id, priceInEther])
     })
        .on("error", (err) => console.log(err));
    };
    printSaleEvent();
  }, [accounts, contract]);


  useEffect(() => {
    
    const printBottleAskedForShipping = async () => {
      await contract.events.BottleAskedForShipping({ fromBlock: "earliest" })
        .on("data", (event) => {
          setBottleShippingEvent([event.returnValues.id, event.returnValues.from])
     })
        .on("error", (err) => console.log(err));
    };
    printBottleAskedForShipping();
  }, [accounts, contract]);


  useEffect(() => {
    const getPastCollateralEvents = async () => {
      const events = await contract.getPastEvents("CollateralAdded", {
        fromBlock: 0,
        toBlock: "latest"
      });
      setBottleCollateralOldEvent(events);
    };
    getPastCollateralEvents();
  }, [contract]);


  useEffect(() => {
    
    const printContestDelivery = async () => {
      await contract.events.ContestedDelivery({ fromBlock: "earliest" })
        .on("data", (event) => {
          setcontestDelivery([event.returnValues.id, event.returnValues.from])
     })
        .on("error", (err) => console.log(err));
    };
    printContestDelivery();
  }, [accounts, contract]);


  useEffect(() => {
    const getPastConfirmEvents = async () => {
      const events = await contract.getPastEvents("ConfirmedDelivery", {
        fromBlock: 0,
        toBlock: "latest"
      });
      setconfirmDeliveryOldEvent(events);
    };
    getPastConfirmEvents();
  }, [contract]);









  return (
    <>
    <Flex w="100%" h="calc(100vh - 64px)" marginTop="200px">
      <Flex
        w="50%"
        h="100%"
        bg="#f2f2f2"
        direction="column"
        align="center"
        justify="center"
        overflowY="auto"
      >
        <FormControl>
          <Input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter bottle ID"

          />
        </FormControl>

        <Button mt="4" onClick={handleBuy}>
          BuyBottle
        </Button>

        <Text mt="4">
            {bottleTransfer.length > 0  && (
              <p> You have bought the bottle with the id {bottleTransfer[2]}, 
              at a price of {web3.utils.fromWei(bottleTransfer[3].toString(), 'ether')} Ether
              </p>
              
            )}
          </Text>
          <FormControl>
            <Input
              type="number"
              value={id6}
              onChange={(e) => setId6(e.target.value)}
              placeholder="Enter bottle ID"

            />
         </FormControl>

          <FormControl>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price in ether"

            />
          </FormControl>
          <Button mt="4" onClick={handleSell}>
            Sell Bottle
          </Button>

          <Text mt="4">
            {saleEvent.length > 0  && (
              <p>the bottle with the id {saleEvent[0]} is now for sale for {saleEvent[1]} Ether </p>
          )}
          </Text>

          <FormControl>
              <Input
              type="number"
              value={id8}
              onChange={(e) => setId8(e.target.value)}
              placeholder="Enter bottle ID"
            />
          </FormControl>

          <Button mt="4" onClick={handleGetBottleShipping}> Ask for Shipment </Button>
          {bottleShippingEvent.length > 0 && (
          <div>
            <p>The Bottle with the id {bottleShippingEvent[0]} will be shipped soon by the producer. Wait for him to put some collateral to guarantee the delivery.</p>
            <p>Please wait to receive it and confirm the reception ASAP.</p>
            <p>You can check the status of your Bottle on the right.</p> 
          </div>
          )}
          
          <Text mt="4">
            <div>
              <ul >
                {bottleCollateralOldEvent.map((event) => (
                  <li key={event.id}>
                    The producer with the address {event.returnValues.from} has added a collateral of {web3.utils.fromWei(event.returnValues.value.toString(), "ether")} Ether for the the Bottle with the id {event.returnValues.id}.
                    The Bottle is now shipped !
                    Please confirm the delivery if you receive your Bottle within 2 weeks. If not, please contest.
                  </li>
                ))}
              </ul>
          </div>
          </Text>
          <FormControl>
          <Input
            type="number"
            value={id9}
            onChange={(e) => setId9(e.target.value)}
            placeholder="Enter bottle ID"

          />
        </FormControl>

        <Button mt="4" onClick={handleGetConfirmShipment}>
          Confirm Delivery
        </Button>

        <Text mt="4">
            <div>
              <ul>
                {confirmDeliverylOldEvent.map((event) => (
                  <li key={event.id}>
                    You confirmed the Delivery of the Bottle with the id {event.returnValues.id}
                  </li>
                ))}
              </ul>
          </div>
          </Text>



        <FormControl>
          <Input
            type="number"
            value={id10}
            onChange={(e) => setId10(e.target.value)}
            placeholder="Enter bottle ID"

          />
        </FormControl>

        <Button mt="4" onClick={handleGetContestDelivery}>
          Contest Delivery
        </Button>

        <Text mt="4">
            {contestDelivery.length > 0  && (
              <p>
                the shipment of the bottle with the id {contestDelivery[0]} is now contested. Please wait for WineNotBlockchain or an arbitrator to solve the issue.
                The issue should be solved soon and you will receive your bottle asap.
                Please confirm when you got it.
              </p>
          )}
          </Text>


        



      </Flex>


      <Flex 
      w="50%" 
      h="100%" 
      bg="gray.50"
      direction="column"
      align="center"
      justify="center"
      overflowY="auto"
      >
          <FormControl>
              <Input
              type="number"
              value={id7}
              onChange={(e) => setId7(e.target.value)}
              placeholder="Enter bottle ID"
            />
          </FormControl>
          <Button mt="4" onClick={handleGetBottleOwner}>Get Bottle Owner</Button>
          {bottleOwner != undefined && (
            <div>
              <p>Bottle Owner : {bottleOwner}</p>
            </div>
          )}
          <Button mt="4" onClick={handleGetBottleBalance}>Get Bottle Balance</Button>
          {bottleBalance != undefined && (
            <div>
              <p>Bottle Balance of your address : {bottleBalance}</p>
              
            </div>
          )}
          <FormControl>
              <Input
              type="number"
              value={id2}
              onChange={(e) => setId2(e.target.value)}
              placeholder="Enter bottle ID"
            />
          </FormControl>

          <Button mt="4" onClick={handleGetBottleInfo}>Get Bottle Info</Button>
          {bottleInfo.producer && (
            <div>
              <p>Producer Address : {bottleInfo.producer}</p>
              <p>Producer Name : {bottleInfo.producerName}</p>
              <p>Designation of Origin: {bottleInfo.designationOfOrigin}</p>
              <p>Vintage: {bottleInfo.vintage}</p>
              <p>Serial Number: {bottleInfo.serialNumber}</p>
            </div>
          )}

          <FormControl>
              <Input
              type="number"
              value={id3}
              onChange={(e) => setId3(e.target.value)}
              placeholder="Enter bottle ID"
            />
          </FormControl>

          <Button mt="4" onClick={handleGetBottleInfoSale}>Get Bottle Info Sale</Button>
          {bottleInfoSale.price && (
            <div>
              <p>Bottle Sale : {(bottleInfoSale.onSale).toString()}</p>
              <p>Bottle Price : {web3.utils.fromWei(bottleInfoSale.price.toString(), 'ether')} Ether</p>
            </div>
          )}

          <FormControl>
              <Input
              type="number"
              value={id4}
              onChange={(e) => setId4(e.target.value)}
              placeholder="Enter bottle ID"
            />
          </FormControl>

          <Button mt="4" onClick={handleGetBottleSales}>Get Bottle Sales History </Button>
          {bottleSales.length > 0 && (
          <div>
            {bottleSales.map((Sale, index) => (
              <div key={index}>
                <p>Seller: {Sale.seller}</p>
                <p>Buyer: {Sale.buyer}</p>
                <p>Price : {web3.utils.fromWei(Sale.price.toString(), 'ether')} Ether </p>
                <p>Timestamp: {Sale.timestamp}</p>
            </div>
            ))}
          </div>
          )}

          <FormControl>
              <Input
              type="number"
              value={id5}
              onChange={(e) => setId5(e.target.value)}
              placeholder="Enter bottle ID"
            />
          </FormControl>

            <Button mt="4" onClick={handleGetBottleStatus}>Get Bottle Status</Button>
            {bottleStatus != undefined && (
            <>
              {bottleStatus == 0 && <p>Bottle Status : Mint</p>}
              {bottleStatus == 1 && <p>Bottle Status : Asked for Shipping</p>}
              {bottleStatus == 2 && <p>Bottle Status : Shipped</p>}
              {bottleStatus == 3 && <p>Bottle Status : Received</p>}
              {bottleStatus == 4 && <p>Bottle Status : Contested</p>}
              {bottleStatus == 5 && <p>Bottle Status : lost</p>}
              {bottleStatus > 5 && <p>Bottle Status : Unknown</p>}
            </>
            )}


      </Flex>

    </Flex>
    </>
  );
}


  export default ViewerComponent;