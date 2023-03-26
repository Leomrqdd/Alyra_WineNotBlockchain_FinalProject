import { EthProvider } from "./contexts/EthContext";
import Home from "./components/Home.jsx"
import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'



function App() {
  return (
    <ChakraProvider>
      <EthProvider>
            <Home/>
      </EthProvider>
    </ChakraProvider>
  );
}

export default App;
