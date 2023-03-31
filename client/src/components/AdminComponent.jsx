import React from 'react';
import useEth from "../contexts/EthContext/useEth";
import { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    Text,
  } from '@chakra-ui/react';


function AdminComponent() {

    const { state: { contract, accounts,web3 } } = useEth();
    const [producerAddress, setProducerAddress] = useState('');
    const [producerAddress2, deleteProducerAddress] = useState('');
    const [producerAddress3,checkProducerAddress]  = useState('')
    const [whitelistedProducers, setWhitelistedProducers] = useState([]);
    const [message, setMessage] = useState('');
    const [eventWhitelist,setEventWhitelist] = useState([])
    const toast = useToast();
    const [totalSupply, getTotalSupply] = useState(null);
    const [bottleOwner, setBottleOwner] = useState(null);
    const [bottleInfo, setBottleInfo] = useState({});
    const [bottleInfoSale, setBottleInfoSale] = useState({});
    const [bottleSales, setBottleSales] = useState({});
    const [bottleStatus, setBottleStatus] = useState({});
    const [contestedDeliveryOldEvent, setContestedDeliveryOldEvent] = useState([]);
    const [confirmedDeliveryOldEvent, setConfirmedDeliveryOldEvent] = useState([]);









    const [id, setId] = useState('');
    const [id2, setId2] = useState('');
    const [id3, setId3] = useState('');
    const [id4, setId4] = useState('');
    const [id5, setId5] = useState('');







    



    const handleAddressChange = (e) => {
        setProducerAddress(e.target.value);
      };

    const addProducer = async () => {
        if (!web3.utils.isAddress(producerAddress)) {
          alert("invalid address");
        }
        await contract.methods.whitelistProducer(producerAddress).send({ from: accounts[0] });

      };


      
      const handleAddressChange2 = (e) => {
        deleteProducerAddress(e.target.value);
      };

      const deleteProducer = async () => {
        if (!web3.utils.isAddress(producerAddress2)) {
          alert("invalid address");
        }
        await contract.methods.revokeProducer(producerAddress2).send({ from: accounts[0] });
      };


      const handleAddressChange3 = (e) => {
        checkProducerAddress(e.target.value);
      };

      const checkProducer = async () => {
        if (!web3.utils.isAddress(producerAddress3)) {
          alert("invalid address");
        }

        const isWhitelisted = await contract.methods.isWhitelistedProducer(producerAddress3).call({ from: accounts[0] });

        if (isWhitelisted) {
          setMessage('The producer is whitelisted.');
        } else {
          setMessage('The producer is now whitelisted.');
        }
      };


      const handleGetTotalSupply = async () => {
        const info = await contract.methods
        .getTotalSupply()
        .call({ from: accounts[0] }); 
  
        getTotalSupply(info);
      };

      const handleGetBottleOwner = async () => {
        const info = await contract.methods
        .getBottleOwner(id)
        .call({ from: accounts[0] }); 
    
        setBottleOwner(info);
    
    
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
      



      useEffect(() => {
        const getWhitelistedProducers = async () => {
          const oldEvents = await contract.getPastEvents('WhitelistedProducer', { 
          
            fromBlock: 0, toBlock: 'latest' 
        });
          setWhitelistedProducers(oldEvents);
        };
        getWhitelistedProducers();
      }, [accounts,contract]);



      useEffect(() => {
        setEventWhitelist([]);
      
        const PrintWhitelistedProducers = async () => {
          await contract.events.WhitelistedProducer({ fromBlock: "earliest" })
            .on("data", (event) => {
              setEventWhitelist([event.returnValues._address, event.returnValues.whitelist])
         })
            .on("error", (err) => console.log(err));
        };
      
        PrintWhitelistedProducers();
      }, [accounts, contract]);


      useEffect(() => {
        const getPastContestEvents = async () => {
          const events = await contract.getPastEvents("ContestedDelivery", {
            fromBlock: 0,
            toBlock: "latest"
          });
          setContestedDeliveryOldEvent(events);
        };
        getPastContestEvents();
      }, [contract]);


      
    useEffect(() => {
      const getPastConfirmEvents = async () => {
        const events = await contract.getPastEvents("ConfirmedDelivery", {
          fromBlock: 0,
          toBlock: "latest"
        });
        setConfirmedDeliveryOldEvent(events);
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
            <FormControl id="producerAddress">
              <Input
                type="text"
                value={producerAddress}
                onChange={handleAddressChange}
                placeholder="Producer wallet address "
              />
            </FormControl>
            <Button mt="4" onClick={addProducer}>
              Add the Producer to the whitelist
            </Button>
            <FormControl id="producerAddress">
              <Input
                type="text"
                value={producerAddress2}
                onChange={handleAddressChange2}
                placeholder="Producer wallet address"
              />
            </FormControl>
            <Button mt="4" onClick={deleteProducer}>
              Delete the Producer from the whitelist
            </Button>
            <FormControl id="producerAddress">
              <Input
                type="text"
                value={producerAddress3}
                onChange={handleAddressChange3}
                placeholder="Producer wallet address"
              />
            </FormControl>
            <Button mt="4" onClick={checkProducer}>
              Check a Producer
            </Button>
            {message && <Text mt="4">{message}</Text>}

            <Text mt="4">
              {eventWhitelist && eventWhitelist[1] !== undefined && (
              <p>
                  Address: {eventWhitelist[0]} | Whitelisted: {eventWhitelist[1].toString()}
              </p>
              )}
            </Text>

            <ul>
              {whitelistedProducers.map((event, index) => (
                <li key={index}>{`${event.returnValues._address} , ${event.returnValues.whitelist}`}</li>
                    ))}
            </ul>
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


         <Button mt="4" onClick={handleGetTotalSupply}>Get Total Supply</Button>
         {totalSupply != undefined && (
            <div>
              <p> TotalSupply : {totalSupply}</p>
            </div>
          )}
          <FormControl>
            <Input
            type="number"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter bottle ID"
          />
          </FormControl>
          <Button mt="4" onClick={handleGetBottleOwner}>Get Bottle Owner</Button>
          {bottleOwner != undefined && (
            <div>
              <p>Bottle Owner : {bottleOwner}</p>
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
              <p>Price: {web3.utils.fromWei(Sale.price.toString(), 'ether')} Ether </p>
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

        <Text>
          <div>
              <ul>
                {contestedDeliveryOldEvent.map((event) => (
                  <li key={event.id}>
                    The delivery of the Bottle with the id {event.returnValues.id} was contested by the owner with the address {event.returnValues.from}.
                  </li>
                ))}
              </ul>
            </div>     
        </Text>

        <Text>
          <div>
              <ul>
                {confirmedDeliveryOldEvent.map((event) => (
                  <li key={event.id}>
                    The delivery of the Bottle with the id {event.returnValues.id} was confirmed by the owner with the address {event.returnValues.from}.
                    The issue is now solved ! 
                  </li>
                ))}
              </ul>
            </div>     
          </Text>
            



          </Flex>

        </Flex>
        </>
      );
    }

  export default AdminComponent;