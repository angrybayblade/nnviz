import React from 'react';
// import * as Data from './nn/data'
import axios from 'axios';

import "./App.css"

class Network{
  constructor(
    name="NetWork"
  ){
    console.log(`Network : ${name}`)
  }
}

function App() {

  React.useEffect(() => {
    let net = new Network();
  }, [])

  return (
    <div className="root" id="root" >

    </div>
  );
}

export default App;
