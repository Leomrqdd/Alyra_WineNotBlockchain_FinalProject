import { Box, Flex, Spacer, Text } from '@chakra-ui/react';
import useEth from "../contexts/EthContext/useEth";
import { useEffect, useState } from 'react';

function Navbar(userType, web3Enabled, userAddress) {
    const { state: { contract, accounts } } = useEth();
    const [address, setAddress] = useState('');

  useEffect(() => {
    if (accounts) {
      setAddress(accounts[0].slice(0, 6) + '...' + accounts[0].slice(-4));
    }
  }, [accounts]);

  return (
    <Box bg="gray.50" p="4" w="100%" position="relative" zIndex="999" height="64px" >
      <Flex alignItems="center">
        <Text fontSize="2xl" fontWeight="bold">
        {userType.userType === "owner" && web3Enabled ? "Admin" : userType.userType === "producer" ? "Producer" : "Buyer/Seller"}
        </Text>
        <Spacer />
        <Text fontSize="2xl" fontWeight="bold">
          WineNotBlockchain
          <div></div>
        </Text>
        <Spacer />
        {web3Enabled ? (
          <Box>
            <Text>{address}</Text>
          </Box>
        ) : (
          <Box>
            <Text>Non connecté</Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
}


export default Navbar;