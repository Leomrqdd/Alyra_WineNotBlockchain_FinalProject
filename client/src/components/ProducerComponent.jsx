import React from 'react';
import { FormControl,Input, Button,Flex,Text, Image, Grid, Box, Select} from "@chakra-ui/react";
import useEth from "../contexts/EthContext/useEth";
import { useState, useEffect} from 'react';
import { EditIcon } from '@chakra-ui/icons'
import { InfoOutlineIcon } from '@chakra-ui/icons';




function ProducerComponent() {

    const { state: { contract, accounts,web3, txhash } } = useEth();
    const [producerName, setProducerName] = useState("");
    const [designationOfOrigin, setDesignationOfOrigin] = useState("");
    const [vintage, setVintage] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [tokenURI, setTokenURI] = useState("");
    const [selectedImage, setSelectedImage] = useState("No Image");
    const [mintEvent, setMintEvent] = useState([]);
    const [price, setPrice] = useState('');
    const [price2, setPrice2] = useState('');
    const [saleEvent, setSaleEvent] = useState([]);
    const [CollateralEvent, setCollateralEvent] = useState([]);
    const [bottleInfo, setBottleInfo] = useState({});
    const [bottleInfoSale, setBottleInfoSale] = useState({});
    const [bottleSales, setBottleSales] = useState({});
    const [bottleStatus, setBottleStatus] = useState(null);
    const [bottleShippingOldEvent, setBottleShippingOldEvent] = useState([]);
    const [confirmedDeliveryOldEvent, setConfirmedDeliveryOldEvent] = useState([]);
    const [contestedDeliveryOldEvent, setContestedDeliveryOldEvent] = useState([]);
    const [oldMintEvent, setOldMintEvent] = useState([]);
    const [hasProduction, setHasProduction] = useState(null);


    const [id, setId] = useState('');
    const [id2, setId2] = useState('');
    const [id3, setId3] = useState('');
    const [id4, setId4] = useState('');
    const [id5, setId5] = useState('');
    const [id6, setId6] = useState('');


    const handleChange = (event) => {
      setSelectedImage(event.target.value);
      if (event.target.value === "Image Bottle 1") {
        setTokenURI("https://gateway.pinata.cloud/ipfs/QmNUmQTgJ23n2jojDFx1jhWFtk6j93zHfUnTRYMG47ttki?filename=1.png");
      } else if (event.target.value === "Image Bottle 2") {
        setTokenURI("https://gateway.pinata.cloud/ipfs/QmQba8Sye7UgY8V61kKoTqXzonKmVQxRzQo6PS2vNnm3Cc?filename=2.png");
      } else if (event.target.value === "No Image") {
        setTokenURI("No Image")
      }

    };


    const handleMint = async () => {
      try {

      const result = await contract.methods
        .mintWineBottle(
          producerName,
          designationOfOrigin,
          parseInt(vintage),
          parseInt(serialNumber),
          tokenURI
        )
        .send({ from: accounts[0] });
  
      console.log(result);
        }
        catch (error) {
          console.log(error)
        }
    };

    const handleSell = async () => {
      const result = await contract.methods
        .sellBottle(id, price)
        .send({ from: accounts[0] });
  
      console.log(result);
    };

    const handleCollateral = async () => {
      const weiValue = web3.utils.toWei(price2.toString(), "ether")
      const result = await contract.methods
        .addCollateral(id2)
        .send({ from: accounts[0], value : weiValue }); 
  
      console.log(result);
    };

    const handleGetBottleInfo = async () => {
      const info = await contract.methods
      .getBottleInfo(id3)
      .call({ from: accounts[0] }); 

      setBottleInfo(info);
    };
    
    const handleGetBottleInfoSale = async () => {
      const info = await contract.methods
      .getBottleSaleInfo(id4)
      .call({ from: accounts[0] }); 

      setBottleInfoSale(info);
    };

    const handleGetBottleStatus = async () => {
      const info = await contract.methods
      .getBottleStatus(id6)
      .call({ from: accounts[0] }); 

      setBottleStatus(info);
    };
    
    const handleGetBottleSales = async () => {
      const info = await contract.methods
      .getSalesHistory(id5)
      .call({ from: accounts[0] }); 

      setBottleSales(info);
    };

    

 
    useEffect(() => {
    
      const printMintEvent = async () => {
        await contract.events.BottleCreation({ fromBlock: "earliest" })
          .on("data", (event) => {
            setMintEvent([event.returnValues._owner, event.returnValues.id])
       })
          .on("error", (err) => console.log(err));
      };
      printMintEvent();
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
    
      const printCollateralEvent = async () => {
        await contract.events.CollateralAdded({ fromBlock: "earliest" })
          .on("data", (event) => {
            setCollateralEvent([event.returnValues.id, event.returnValues.from,event.returnValues.value])
       })
          .on("error", (err) => console.log(err));
      };
      printCollateralEvent();
    }, [accounts, contract]);

    useEffect(() => {
      const getPastShippingEvents = async () => {
        const deployTx = await web3.eth.getTransaction(txhash)
        const events = await contract.getPastEvents("BottleAskedForShipping", {
          fromBlock: deployTx.blockNumber,
          toBlock: "latest"
        });
        setBottleShippingOldEvent(events);
      };
      getPastShippingEvents();
    }, [contract]);

    useEffect(() => {
      const getPastConfirmEvents = async () => {
        const deployTx = await web3.eth.getTransaction(txhash)
        const events = await contract.getPastEvents("ConfirmedDelivery", {
          fromBlock: deployTx.blockNumber,
          toBlock: "latest"
        });
        setConfirmedDeliveryOldEvent(events);
      };
      getPastConfirmEvents();
    }, [contract]);

    useEffect(() => {
      const getPastContestEvents = async () => {
        const deployTx = await web3.eth.getTransaction(txhash)
        const events = await contract.getPastEvents("ContestedDelivery", {
          fromBlock: deployTx.blockNumber,
          toBlock: "latest"
        });
        setContestedDeliveryOldEvent(events);
      };
      getPastContestEvents();
    }, [contract]);

    useEffect(() => {
      const getPastMintEvents = async () => {
        const deployTx = await web3.eth.getTransaction(txhash)
        const events = await contract.getPastEvents("BottleCreation", {
          fromBlock: deployTx.blockNumber,
          toBlock: "latest"
        });
        setOldMintEvent(events);
        const bool = oldMintEvent.some(event => event.returnValues._owner == accounts[0]);
        setHasProduction(bool);
      };
      getPastMintEvents();
    },);
  
  



    return (
      <>
      <Flex w="100%" h="calc(100vh - 100px)" marginTop="100px" overflowY="auto">
        <Flex
            w="50%"
            h="calc(100vh - 100px)"
            bg="#f2f2f2"
            direction="column"
            align="center"
            overflowY="auto"
        >
          <Box mt="4" mb="4" display="flex" justifyContent="center" alignItems="flex-start" >
              <EditIcon w={20} h={20} color="gray.500" />
          </Box>
          <FormControl>
            <Input
              type="text"
              value={producerName}
              onChange={(e) => setProducerName(e.target.value)}
              placeholder="Enter producer Name"

            />
          </FormControl>
          <FormControl>
            <Input
              type="text"
              value={designationOfOrigin}
              onChange={(e) => setDesignationOfOrigin(e.target.value)}
              placeholder="Enter wine origin"

            />
          </FormControl>
          <FormControl>
            <Input
              type="number"
              value={vintage}
              onChange={(e) => setVintage(e.target.value)}
              placeholder="Enter vintage"

            />
          </FormControl>
          <FormControl>
            <Input
              type="number"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="Enter serial number of the bottle"

            />
          </FormControl>
          <FormControl>
            <Select value={selectedImage} onChange={handleChange}>
              <option value="Image Bottle 1">Image Bottle 1</option>
              <option value="Image Bottle 2">Image Bottle 2</option>
              <option value="No Image">No Image</option>

            </Select>
          </FormControl>
          <Button mt="4" onClick={handleMint}>
            Mint Bottle
          </Button>

          <Text mt="4">
            {mintEvent.length > 0  && (
              <p style={{color: 'green', fontStyle: 'italic', fontSize: '16px'}}>A bottle has been mint by {mintEvent[0]} at the id {mintEvent[1]}</p>
          )}
          </Text>

          <FormControl>
            <Input
              type="number"
              value={id}
              onChange={(e) => setId(e.target.value)}
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
              <p style={{color: 'green', fontStyle: 'italic', fontSize: '16px'}}>the bottle with the id {saleEvent[0]} is now for sale for {saleEvent[1]} Ether </p>
          )}
          </Text>


          <FormControl>
            <Input
              type="number"
              value={id2}
              onChange={(e) => setId2(e.target.value)}
              placeholder="Enter bottle ID"

            />
          </FormControl>
          <FormControl>
            <Input
              type="number"
              value={price2}
              onChange={(e) => setPrice2(e.target.value)}
              placeholder="Enter collateral amount in ether"

            />
          </FormControl>
          <Button mt="4" onClick={handleCollateral}>
            Add Collateral 
          </Button>

          <Text mt="4">
            {CollateralEvent.length > 0  && (
              <p style={{color: 'green', fontStyle: 'italic', fontSize: '16px'}}>You have added a collateral amount of {web3.utils.fromWei(CollateralEvent[2].toString(), "ether")} Ether for the Bottle with the id number {CollateralEvent[0]} </p>
          )}
          </Text>
          <Text>
          <div>
              <ul>
                {bottleShippingOldEvent.map((event) => (
                  <li key={event.id} style={{color: 'orange', fontStyle: 'italic', fontSize: '16px'}}>
                    The Bottle with the id {event.returnValues.id} was asked for Shipping by {event.returnValues.from}. 
                    Please add a minimum collateral of 1/3 of your initial price to guarantee the shipment.
                    Then, communicate through the dedicated message app to gather all the shipment information from the owner.
                  </li>
                ))}
              </ul>
            </div>     
          </Text>


          <Text>
          <div>
              <ul>
                {contestedDeliveryOldEvent.map((event) => (
                  <li key={event.id} style={{color: 'red', fontStyle: 'italic', fontSize: '16px'}}>
                    The delivery of the Bottle with the id {event.returnValues.id} was contested by the owner with the address {event.returnValues.from}. 
                    WineNotBlockchain or a arbitrator will soon contact you to solve the issue ASAP.
                  </li>
                ))}
              </ul>
            </div>     
          </Text>

          <Text>
          <div>
              <ul>
                {confirmedDeliveryOldEvent.map((event) => (
                  <li key={event.id} style={{color: 'green', fontStyle: 'italic', fontSize: '16px'}}>
                    The delivery of the Bottle with the id {event.returnValues.id} was confirmed by the owner with the address {event.returnValues.from}. 
                    Please check if you got back your collateral amount of {web3.utils.fromWei(event.returnValues.value.toString(),"ether")} Ether.
                  </li>
                ))}
              </ul>
            </div>     
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

          <Box mt="4" mb="2" display="flex" justifyContent="center">
            <InfoOutlineIcon w={20} h={20} color="gray.500" />
          </Box>
          <FormControl>
              <Input
              type="number"
              value={id3}
              onChange={(e) => setId3(e.target.value)}
              placeholder="Enter bottle ID"
            />
          </FormControl>

          <Button mt="4" onClick={handleGetBottleInfo}>Get Bottle Info</Button>
          {bottleInfo.producer && (
            <Text>
            <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>
              Producer Address : {bottleInfo.producer}
            </p>
            <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>
              <span style={{display: "inline-block", marginRight: "10px"}}>
                Producer Name : {bottleInfo.producerName}
              </span>
              <span style={{display: "inline-block", marginRight: "10px"}}>
                Designation of Origin : {bottleInfo.designationOfOrigin}
              </span>
              <span style={{display: "inline-block", marginRight: "10px"}}>
                Vintage : {bottleInfo.vintage}
              </span>
              <span style={{display: "inline-block"}}>
                Serial Number : {bottleInfo.serialNumber}
              </span>
            </p>
          </Text>
          )}


          <FormControl>
              <Input
              type="number"
              value={id4}
              onChange={(e) => setId4(e.target.value)}
              placeholder="Enter bottle ID"
            />
          </FormControl>

          <Button mt="4" onClick={handleGetBottleInfoSale}>Get Bottle Info Sale</Button>
          {bottleInfoSale.price && (
            <Text>
            <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>
              <span style={{display: "inline-block", marginRight: "10px"}}>
                Bottle Sale : {(bottleInfoSale.onSale).toString()}
              </span>
              {bottleInfoSale.onSale == true && ( 
              <span style={{display: "inline-block", marginRight: "10px"}}>
                Bottle Price : {web3.utils.fromWei(bottleInfoSale.price.toString(), 'ether')} Ether
              </span>
              )}
            </p>
          </Text>
          )}

          <FormControl>
              <Input
              type="number"
              value={id5}
              onChange={(e) => setId5(e.target.value)}
              placeholder="Enter bottle ID"
            />
          </FormControl>

          <Button mt="4" onClick={handleGetBottleSales}>Get Bottle Sales History </Button>
          {bottleSales.length > 0 && (
          <Text>
          {bottleSales.map((Sale, index) => (
            <div key={index}>
              <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}> Seller: {Sale.seller}</p>
              <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}> Buyer: {Sale.buyer}</p>
              <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>
                <span style={{display: "inline-block", marginRight: "10px"}}>
                  Price: {web3.utils.fromWei(Sale.price.toString(), 'ether')} Ether 
                </span>
                <span style={{display: "inline-block", marginRight: "10px"}}>
                  Timestamp: {Sale.timestamp}
                </span>
              </p>
          </div>
          ))}
        </Text>
          )}

          <FormControl>
              <Input
              type="number"
              value={id6}
              onChange={(e) => setId6(e.target.value)}
              placeholder="Enter bottle ID"
            />
          </FormControl>

            <Button mt="4" onClick={handleGetBottleStatus}>Get Bottle Status</Button>
            {bottleStatus != undefined && (
            <>
              {bottleStatus == 0 && <p  style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Status : Mint</p>}
              {bottleStatus == 1 && <p  style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Status : Asked for Shipping</p>}
              {bottleStatus == 2 && <p  style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Status : Shipped</p>}
              {bottleStatus == 3 && <p  style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Status : Received</p>}
              {bottleStatus == 4 && <p  style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Status : Contested</p>}
              {bottleStatus == 5 && <p  style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Status : lost</p>}
              {bottleStatus > 5 &&  <p  style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Status : Unknown</p>}
            </>
            )}

            <Box>
              {hasProduction && <Text fontSize="2xl" fontWeight="bold" mb={4}>My Production</Text>}
              <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                {oldMintEvent.map((event) => {
                  if (event.returnValues._owner == accounts[0]) {
                    if (event.returnValues.URI == "https://gateway.pinata.cloud/ipfs/QmNUmQTgJ23n2jojDFx1jhWFtk6j93zHfUnTRYMG47ttki?filename=1.png") {
                      return (
                        <Box key={event.id}>
                          <Image src="https://gateway.pinata.cloud/ipfs/QmNUmQTgJ23n2jojDFx1jhWFtk6j93zHfUnTRYMG47ttki?filename=1.png" alt="My Image" w="100%" h="auto" />
                          <Text textAlign="center" style={{fontSize: "18px", fontStyle: "italic", color: "#555"}} mb="4">Bottle ID : {event.returnValues.id}</Text>
                        </Box>
                      );
                    } else if (event.returnValues.URI == "https://gateway.pinata.cloud/ipfs/QmQba8Sye7UgY8V61kKoTqXzonKmVQxRzQo6PS2vNnm3Cc?filename=2.png") {
                      return (
                        <Box key={event.id}>
                          <Image src="https://gateway.pinata.cloud/ipfs/QmQba8Sye7UgY8V61kKoTqXzonKmVQxRzQo6PS2vNnm3Cc?filename=2.png" alt="My Image" w="100%" h="auto" />
                          <Text textAlign="center" style={{fontSize: "18px", fontStyle: "italic", color: "#555"}} mb="4"  >Bottle ID :  {event.returnValues.id}</Text>
                        </Box>
                      );
                    }
                  }
                  return null;
                })}
              </Grid>
              {!hasProduction && <Text textAlign="center" style={{fontSize: "18px", fontStyle: "italic", color: "#555"}} mb="4" mt="8" >You need to mint a Bottle to see your production Here</Text>}
            </Box>

          
        </Flex>
        

      </Flex>
      </>
    );
  }

  export default ProducerComponent;