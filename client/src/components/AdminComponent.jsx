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
          setMessage('Le producteur est whitelisté.');
        } else {
          setMessage('Le producteur n\'est pas whitelisté.');
        }
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

    



      return (
        <Box p="4">
          <Flex direction="column" alignItems="center">
            <FormControl id="producerAddress">
              <FormLabel>Adresse du producteur</FormLabel>
              <Input
                type="text"
                value={producerAddress}
                onChange={handleAddressChange}
                placeholder="0x..."
              />
            </FormControl>
            <Button mt="4" onClick={addProducer}>
              Ajouter le producteur à la liste blanche
            </Button>
            <FormControl id="producerAddress">
              <FormLabel>Adresse du producteur</FormLabel>
              <Input
                type="text"
                value={producerAddress2}
                onChange={handleAddressChange2}
                placeholder="0x..."
              />
            </FormControl>
            <Button mt="4" onClick={deleteProducer}>
              Supprimer le producteur de la liste blanche
            </Button>
            <FormControl id="producerAddress">
              <FormLabel>Adresse du producteur</FormLabel>
              <Input
                type="text"
                value={producerAddress3}
                onChange={handleAddressChange3}
                placeholder="0x..."
              />
            </FormControl>
            <Button mt="4" onClick={checkProducer}>
              Checker l'adresse du producteur
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
        </Box>
      );
    }

  export default AdminComponent;