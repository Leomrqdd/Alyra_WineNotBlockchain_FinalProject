import React from 'react';
import { FormControl,Input, Button,Flex,Text,Box,Image,Grid } from "@chakra-ui/react";
import useEth from "../contexts/EthContext/useEth";
import { useState, useEffect} from 'react';
import { EditIcon } from '@chakra-ui/icons'
import { InfoOutlineIcon } from '@chakra-ui/icons';






function ViewerComponent() {

  const { state: { contract, accounts,web3, txhash} } = useEth();
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

  const [totalSupply, setTotalSupply] = useState(null);
  const [ownedIds, setOwnedIds] = useState([]);
  const [currentSells, setCurrentSells] = useState([]);
  const [currentSellBool, setCurrentSellBool] = useState(false);






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


  const handleGetTotalSupply = async () => {
    const info = await contract.methods
    .getTotalSupply()
    .call({ from: accounts[0] }); 

    setTotalSupply(info);
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
      const deployTx = await web3.eth.getTransaction(txhash)
      const events = await contract.getPastEvents("CollateralAdded", {
        fromBlock: deployTx.blockNumber,
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
      const deployTx = await web3.eth.getTransaction(txhash)
      const events = await contract.getPastEvents("ConfirmedDelivery", {
        fromBlock: deployTx.blockNumber,
        toBlock: "latest"
      });
      setconfirmDeliveryOldEvent(events);
    };
    getPastConfirmEvents();
  }, [contract]);


  
  useEffect(() => {
    const fetchData = async () => {
      setOwnedIds([]); // réinitialisation du tableau
      const maxId = await contract.methods 
      .getTotalSupply()
      .call({ from: accounts[0] }); 

      for (let i = 1; i <= maxId; i++) {
        const owner = await contract.methods.getBottleOwner(i).call({ from: accounts[0]} ); 
  
        // Vérifie si l'utilisateur actuel est propriétaire de l'élément
        if (owner === accounts[0]) {
          // Ajoute l'élément à une liste pour l'affichage ultérieur
          setOwnedIds(prevIds => [...prevIds, i]);
        }
      }
    };
  
    fetchData();
  }, [contract, accounts]);


  useEffect(() => {
    const fetchData = async () => {
      const currentSells =[]; // réinitialisation du tableau

      const maxId = await contract.methods 
      .getTotalSupply()
      .call({ from: accounts[0] }); 

      for (let i = 1; i <= maxId; i++) {
        const structSale = await contract.methods.getBottleSaleInfo(i).call({ from: accounts[0]}) ; 
        const boolOnSale = structSale.onSale
        const price = structSale.price
  
        // Vérifie si la bouteille est en vente
        if (boolOnSale == true) {
          // Ajoute l'élément à une liste pour l'affichage ultérieur
          currentSells.push({id : i, price : price})

          setCurrentSells(currentSells);
        
        }
      }
    };
  
    fetchData();
  }, [contract, accounts]);









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
            type="number"
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
              <p style={{fontSize: "14px", fontStyle: "italic", color: "green"}} > You have bought the bottle with the id {bottleTransfer[2]}, 
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
              <p style={{fontSize: "14px", fontStyle: "italic", color: "green"}} >the bottle with the id {saleEvent[0]} is now for sale for {saleEvent[1]} Ether </p>
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
            <Text style={{fontSize: "14px", fontStyle: "italic", color: "green"}} >
            The Bottle with the id {bottleShippingEvent[0]} will be shipped soon by the producer. Wait for him to put some collateral to guarantee the delivery.
            <br />
            Please wait to receive it and confirm the reception ASAP.
            <br />
            You can check the status of your Bottle on the right.
            </Text>
          )}
          
          <Text mb="3" mt="1" style={{fontSize: "14px", fontStyle: "italic", color: "green"}}>
            <div>
              <ul >
                {bottleCollateralOldEvent.map((event) => (
                  <li key={event.id} >
                    The producer with the address {event.returnValues.from} has added a collateral of {web3.utils.fromWei(event.returnValues.value.toString(), "ether")} Ether for the Bottle with the id {event.returnValues.id}.
                    <br />
                    The Bottle is now shipped ! 
                    <br />
                    Please confirm the delivery if you receive your Bottle within 2 weeks. If not, contest.
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

        <Text mb="3" mt="1" style={{fontSize: "14px", fontStyle: "italic", color: "green"}}>
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

        <Text mb="3" mt="1" style={{fontSize: "14px", fontStyle: "italic", color: "red"}}>
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
          h="calc(100vh - 100px)"
          bg="gray.50"
          direction="column"
          align="center"
          overflowY="auto"
      >
          <Box mt="4" mb="2" display="flex" justifyContent="center">
           <InfoOutlineIcon w={20} h={20} color="gray.500" />
          </Box>

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
            <Text>
              <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Owner : {bottleOwner}</p>
            </Text>
          )}
          <Button mt="4" onClick={handleGetBottleBalance}>Get Bottle Balance</Button>
          {bottleBalance != undefined && (
            <Text>
              <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Balance of your address : {bottleBalance}</p>
              
            </Text>
          )}
          <Button mt="4" onClick={handleGetTotalSupply}>Get Total Supply</Button>
         {totalSupply != undefined && (
            <Text>
              <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}> Total Supply : {totalSupply}</p>
            </Text>
          )}
          <FormControl>
              <Input
              type="number"
              value={id2}
              onChange={(e) => setId2(e.target.value)}
              placeholder="Enter bottle ID"
            />
          </FormControl>

          <Button mt="4" onClick={handleGetBottleInfo}>Get Bottle Information</Button>
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
              value={id3}
              onChange={(e) => setId3(e.target.value)}
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
              value={id4}
              onChange={(e) => setId4(e.target.value)}
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
              value={id5}
              onChange={(e) => setId5(e.target.value)}
              placeholder="Enter bottle ID"
            />
          </FormControl>

            <Button mt="4" onClick={handleGetBottleStatus}>Get Bottle Status</Button>
            {bottleStatus != undefined && (
            <>
              {bottleStatus == 0 && <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Status : Mint</p>}
              {bottleStatus == 1 && <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Status : Asked for Shipping</p>}
              {bottleStatus == 2 && <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Status : Shipped</p>}
              {bottleStatus == 3 && <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Status : Received</p>}
              {bottleStatus == 4 && <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Status : Contested</p>}
              {bottleStatus == 5 && <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Status : lost</p>}
              {bottleStatus > 5 &&  <p style={{fontSize: "14px", fontStyle: "italic", color: "#555"}}>Bottle Status : Unknown</p>}
            </>
            )}

            <Box>
                <Text fontSize="2xl" fontWeight="bold" mb={4}>
                  My Virtual Cave
                </Text>
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                {ownedIds.includes(1) && (
                  <Box>
                    <Image src="https://gateway.pinata.cloud/ipfs/Qmexe4NuF289cNvTraX737FpsgpJSwY75hoZYpkb9usH4D/1.png" alt="My Image" w="100%" h="auto" />
                    <Text textAlign="center" style={{fontSize: "18px", fontStyle: "bold", color: "#555"}} >Bottle ID : 1 </Text>

                  </Box>
                )}
                {ownedIds.includes(2) && (
                  <Box >
                    <Image src="https://gateway.pinata.cloud/ipfs/Qmexe4NuF289cNvTraX737FpsgpJSwY75hoZYpkb9usH4D/2.png" alt="My Image" w="100%" h="auto" />
                    <Text textAlign="center" style={{fontSize: "18px", fontStyle: "bold", color: "#555"}}>Bottle ID : 2 </Text>
                  </Box>
                )}
              </Grid>
              {!ownedIds.includes(1) && !ownedIds.includes(2) && (
                <Text textAlign="center" style={{fontSize: "18px", fontStyle: "italic", color: "#555"}} mb="4" >
                  Buy a bottle to see it appear here. Please note that only the first two bottles have their images hosted online in a decentralized way.
                </Text>
              )}
            </Box>


            <Box>
                <Text fontSize="2xl" fontWeight="bold" mb={4}>Current Sells</Text>
                  <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                    {currentSells.map((sell) => {
                     if (sell.id === 1) {
                      return (
                        <Box key={sell.id}>
                          <Image src="https://gateway.pinata.cloud/ipfs/Qmexe4NuF289cNvTraX737FpsgpJSwY75hoZYpkb9usH4D/1.png" alt="My Image" w="100%" h="auto" />
                          <Text textAlign="center" style={{fontSize: "18px", fontStyle: "bold", color: "#555"}} >Bottle ID : {sell.id}</Text>
                          <Text textAlign="center" style={{fontSize: "18px", fontStyle: "bold", color: "#555"}} mb="4">Price : {web3.utils.fromWei((sell.price).toString(),'ether')} Ether </Text>
                        </Box>
                      );
                    } if (sell.id === 2) {
                      return (
                        <Box key={sell.id}>
                          <Image src="https://gateway.pinata.cloud/ipfs/Qmexe4NuF289cNvTraX737FpsgpJSwY75hoZYpkb9usH4D/2.png" alt="My Image" w="100%" h="auto" />
                          <Text textAlign="center" style={{fontSize: "18px", fontStyle: "bold", color: "#555"}} >Bottle ID :  {sell.id}</Text>
                          <Text textAlign="center" style={{fontSize: "18px", fontStyle: "bold", color: "#555"}} mb="4">Price : {web3.utils.fromWei((sell.price).toString(),'ether')} Ether </Text>
                        </Box>
                      );
                    }
                    else  (
                      <Text fontSize="lg">Error</Text>
                    );
                  })}

                  </Grid>
                  {currentSells.length===0 && (
                    <Text textAlign="center" style={{fontSize: "18px", fontStyle: "italic", color: "#555"}} mb="7">No bottles for sale now. Please note that only the first two bottles have their images hosted online in a decentralized way.</Text>
                    )}
              </Box>


      </Flex>

    </Flex>
    </>
  );
}


  export default ViewerComponent;