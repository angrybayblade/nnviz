import React from 'react';


function App() {
  
  React.useEffect(()=>{
    let ctx = document.getElementById("graph");
    console.log(ctx);
  },[])

  return (
    <div>
      <canvas id="graph" />      
    </div>
  );
}

export default App;
