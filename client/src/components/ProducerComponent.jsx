import React from 'react';
import { Button } from '@chakra-ui/react';
import useEth from "../contexts/EthContext/useEth";


function ProducerComponent() {

    const { state: { contract, accounts } } = useEth();


    return (
      <Button>testProducer</Button>
    );
  }


  export default ProducerComponent;