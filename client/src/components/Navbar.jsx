import { Box, Flex, Spacer, Text, Button, Image } from '@chakra-ui/react';
import useEth from "../contexts/EthContext/useEth";
import { useEffect, useState } from 'react';


function Navbar(userType, userAddress) {
    const { state:{accounts}, tryInit } = useEth();
    const [address, setAddress] = useState('');


  useEffect(() => {
    if (accounts) {
      setAddress(accounts[0].slice(0, 6) + '...' + accounts[0].slice(-4));
    }
  }, [accounts]);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isConnected()) {
      tryInit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);






  return (
    <Box bg="gray.50" p="4" w="100%" position="relative" zIndex="999" height="80px" >
      <Flex alignItems="center">
        <Text fontSize="2xl" fontWeight="bold" color="#211b59" >
        {userType.userType === "owner" && accounts ?(   
            "Admin" 
           ): userType.userType === "producer" ? (
            "Producer" 
            ): accounts ? (
              "Buyer/Seller"
            ) : (
              "Unknown"
            )} 
        </Text>
        <Spacer />
        <Box display="flex" alignItems="center" justifyContent="flex-start">
          <img src="/logo2.png" alt="logo2" width="60px" />
          <Text fontSize="2xl" fontWeight="bold" color="#211b59">WineNotBlockchain</Text>
        </Box>
        <Spacer />
        {address ? (
          <Box>
            <Text>{address}</Text>
          </Box>
        ) : window.ethereum && (
          <Box>
            <Button onClick={tryInit} > Connect your Wallet</Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
}


export default Navbar;