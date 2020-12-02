import React from 'react';
import { Network } from './nn';
import * as Data from './nn/data'

import axios from 'axios';
import "./App.css"


function App() {

 
  React.useEffect(() => {

    let canvas = document.getElementById("graph");
    let ctx = canvas.getContext('2d');

    
  }, [])


  return (
    <div className="root" id="root" onClick={clearPop}>
      <div id="pop" className="pop">

      </div>
      <span role="img" className="btn-download" onClick={download} > ⏬ </span>
      <div className="dropdown" id="dropdown">
        <div className="option selected" onClick={dropDown} >
          {input.selected}
          <span role="img" id="btn-drop" className="btn-drop" >
            🔽
          </span>
        </div>
        <div id="items" className="items">

        </div>
      </div>
      
      <canvas id="graph" style={{ background: "white", overflow: "scroll" }} >
      </canvas>

    </div>
  );
}

export default App;
