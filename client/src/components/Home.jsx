import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import useEth from "../contexts/EthContext/useEth";
import AdminComponent from './AdminComponent';
import ProducerComponent from './ProducerComponent';
import ViewerComponent from './ViewerComponent';
import { Flex } from '@chakra-ui/react';




function Home() {

    const { state: { contract, accounts } } = useEth();
    const [userType, setUserType] = useState("viewer");
    const [web3Enabled, setWeb3Enabled] = useState(false);
    const [input, setInput] = useState(0);


  
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


  
    useEffect(() => {
      const checkWeb3 = async () => {
        if (window.ethereum) {
          try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            setWeb3Enabled(true);
          } catch (error) {
            console.log(error);
          }
        }
      };
      checkWeb3();
    }, [contract,accounts,web3Enabled]);

    return (
      <>
        <Navbar userType={userType} web3Enabled={web3Enabled} />
        <Flex
          w="100%"
          h="calc(100vh - 64px)"
          alignItems="center"
          justifyContent="center"
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
    );
  }


export default Home;





