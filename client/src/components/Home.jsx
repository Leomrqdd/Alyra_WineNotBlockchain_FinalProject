import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import useEth from "../contexts/EthContext/useEth";
import AdminComponent from './AdminComponent';
import ProducerComponent from './ProducerComponent';
import ViewerComponent from './ViewerComponent';
import {Box, Flex, Text } from "@chakra-ui/react";




function Home() {

    const { state: { contract, accounts, web3 } } = useEth();
    const [userType, setUserType] = useState("viewer");
    const [metamask, setMetamask] = useState(false);



    useEffect(() => {
      if (window.ethereum) {
        setMetamask(true);
      }
    }, []);


  
    useEffect(() => {
      const checkUserType = async () => {
        if (contract && accounts) {
          const isOwner = await contract.methods
            .isCallerOwner()
            .call({ from: accounts[0] });
          if (isOwner) {
            setUserType("owner");
          } else {
            const isProducer = await contract.methods
              .isWhitelistedProducer(accounts[0])
              .call({ from: accounts[0] });
            if (isProducer) {
              setUserType("producer");
            } else {
              setUserType("viewer");
            }
          }
          console.log("userType:", userType);     
          console.log("IsOwner", isOwner);          
     
        }
      };
      checkUserType();
    }, [contract, accounts, userType]);







    return (
      <>

          <Box className="navbar" h="80px">
            <Navbar userType={userType} />
          </Box>

          {metamask ? (
          <>
            
            {accounts ? (
          <>
          
          <Flex
            w="100%"
            h="calc(100vh - 30px)"
            alignItems="center"
            justifyContent="center"
            overflowY="auto"
          >
              {userType === "owner" ? (
                <AdminComponent />
              ) : userType === "producer" ? (
                <ProducerComponent />
              ) : (
                <ViewerComponent />
              )}
          </Flex>
          </>
        ) : (

          <Flex
          w="100%"
          h="calc(100vh - 80px)"
          alignItems="center"
          justifyContent="center"
          >
            <Text fontWeight="bold" textAlign="center" fontSize="2xl" color="#211b59" >
            Please connect your wallet to use WineNotBlockchain
            </Text>

          </Flex>
          )}
        </>
      ) : (

        <Flex
          w="100%"
          h="calc(100vh - 80px)"
          alignItems="center"
          justifyContent="center"
        >

          <Text fontWeight="bold" textAlign="center" fontSize="2xl" color="#211b59" >
          Please install Metamask to use this application
          </Text>

        </Flex>

        
      )}

      <Box className="footer" h="30px" bg="gray.50" display="flex" justifyContent="center" alignItems="center">
        <Text fontSize="12px" fontWeight="bold" color="#211b59">Copyright © 2023 WineNotBlockchain - Alyra - Promo SATOSHI - Léo, Pauline, Loic, Bertrand</Text>
      </Box>

    </>
    );
  }


export default Home;





