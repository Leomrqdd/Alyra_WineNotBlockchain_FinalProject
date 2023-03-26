import React from 'react';
import { Button } from '@chakra-ui/react';
import useEth from "../contexts/EthContext/useEth";


function ViewerComponent() {

    const { state: { contract, accounts } } = useEth();


    return (
      <Button>testViewer</Button>
    );
  }


  export default ViewerComponent;