import React, { createContext } from 'react';
import { Network } from './nn';

import axios from 'axios';
import "./App.css"


function App() {

  async function getInputs() {
    await axios({
      url: "http://localhost:8081/inputs",
      method: "GET"
    }).then(response => {
      inputState({
        ...input,
        examples: response.data.inputs
      })
    })
  } // End getInputs

  async function renderGraph(example) {
    await axios({
      method: "GET",
      url: `http://localhost:8081/predict/${example}`,
      data: {
        example: example
      }
    }).then(response => {
      let canvas = document.getElementById("graph");
      let ctx = canvas.getContext('2d');
      console.log(`Rendering started at : ${Date().toString()}`)
      let net = new Network(response.data, ctx, canvas)
      net.setupCanvas();
      net.render();
      net.addHandler();
      window.network = net;
      console.log(`Rendering ended at : ${Date().toString()}`)
    })
  } // End renderGraph

  React.useEffect(() => {
    getInputs();
    window.popped = false;
    window.drop = false;
  }, [])

  function clearPop() {
    if (window.popped) {
      document.getElementById('pop').innerHTML = '';
      window.popped = false;
    }
  }

  let [input, inputState] = React.useState({
    examples: [],
    selected: "Select"
  })

  function selectOption(e) {
    dropDown();
    let [i, ..._] = e.target.id.split("_");
    i = Number(i);
    inputState({
      ...input,
      selected: input.examples[i]
    })
    renderGraph(i);
  }

  function dropDown(e) {
    let dropdown = document.getElementById("items")
    let l = input.examples.length - 1;
    if (!window.drop) {
      document.getElementById("btn-drop").className = "btn-drop btn-rotated";
      dropdown.style.height = "85vh";
      input.examples.map((ex, i) => {
        setTimeout(function () {
          let opt = document.createElement("div")
          opt.className = "option animate select";
          opt.id = `${i}_opt_${ex}`
          opt.innerText = ex;
          opt.onclick = selectOption;
          dropdown.appendChild(opt);
        }, i * 15)
      })
    } else {
      dropdown.style.height = "1vh";
      document.getElementById("btn-drop").className = "btn-drop";
      [...input.examples].reverse().map((ex, i) => {
        setTimeout(function () {
          let node = document.getElementById(`${(l - i)}_opt_${ex}`);
          dropdown.removeChild(node);
        }, i)
      })
    }
    window.drop = ~window.drop;
  }

  function download() {
    let canv = document.getElementById("graph");
    let a = document.createElement("a");
    a.href = canv.toDataURL();
    a.download = "nnviz - " + Date().toString() + '.png';
    a.click();
  }

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
