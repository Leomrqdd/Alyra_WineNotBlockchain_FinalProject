import React from 'react';
import { FormControl, FormLabel, Input, Button,Flex,Text } from "@chakra-ui/react";
import useEth from "../contexts/EthContext/useEth";
import { useState, useEffect} from 'react';



function ProducerComponent() {

    const { state: { contract, accounts,web3 } } = useEth();
    const [producerName, setProducerName] = useState("");
    const [designationOfOrigin, setDesignationOfOrigin] = useState("");
    const [vintage, setVintage] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [tokenURI, setTokenURI] = useState("");
    const [mintEvent, setMintEvent] = useState([]);
    const [id, setId] = useState('');
    const [price, setPrice] = useState('');
    const [saleEvent, setSaleEvent] = useState([]);
    const [Collateral, setCollateral] = useState('');
    const [bottleInfo, setBottleInfo] = useState({});
    const [bottleInfoSale, setBottleInfoSale] = useState({});




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
      const result = await contract.methods
        .addCollateral(id)
        .send({ from: accounts[0] }); 
  
      console.log(result);
    };

    const handleGetBottleInfo = async () => {
      const info = await contract.methods
      .getBottleInfo(id)
      .call({ from: accounts[0] }); 

      setBottleInfo(info);
    };
    
    const handleGetBottleInfoSale = async () => {
      const info = await contract.methods
      .getBottleSaleInfo(id)
      .call({ from: accounts[0] }); 

      setBottleInfoSale(info);


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

  




    return (
      <>
      <Flex w="100%" h="calc(100vh - 64px)" marginTop="200px">
      <Flex
        w="50%"
        h="100%"
        bg="gray.100"
        direction="column"
        align="center"
        justify="center"
        overflowY="auto"
      >
          <FormControl>
            <FormLabel>Producer Name</FormLabel>
            <Input
              type="text"
              value={producerName}
              onChange={(e) => setProducerName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Designation of Origin</FormLabel>
            <Input
              type="text"
              value={designationOfOrigin}
              onChange={(e) => setDesignationOfOrigin(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Vintage</FormLabel>
            <Input
              type="number"
              value={vintage}
              onChange={(e) => setVintage(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Serial Number</FormLabel>
            <Input
              type="number"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Token URI</FormLabel>
            <Input
              type="text"
              value={tokenURI}
              onChange={(e) => setTokenURI(e.target.value)}
            />
          </FormControl>
          <Button mt="4" onClick={handleMint}>
            Mint Bottle
          </Button>

          <Text mt="4">
            {mintEvent.length > 0  && (
              <p>A bottle has been mint by {mintEvent[0]} at the id {mintEvent[1]}</p>
          )}
          </Text>

          <FormControl>
            <FormLabel>WineBottle ID</FormLabel>
            <Input
              type="number"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Price in Ether</FormLabel>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
            <FormLabel>WineBottle ID</FormLabel>
            <Input
              type="number"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </FormControl>
          <Button mt="4" onClick={handleCollateral}>
            Add Collateral 
          </Button>
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
          <FormLabel>WineBottle ID</FormLabel>
            <Input
            type="number"
            value={id}
            onChange={(e) => setId(e.target.value)}
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
          <FormLabel>WineBottle ID</FormLabel>
            <Input
            type="number"
            value={id}
            onChange={(e) => setId(e.target.value)}
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
          
          
        </Flex>

      </Flex>
      </>
    );
  }

  export default ProducerComponent;