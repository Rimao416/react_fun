import "./App.css";
import StripeContainer from "./components/StripeContainer";
import { useState } from "react";
function App() {
  const [showItem, setShowItem] = useState(false);
  return (
    <div className="App">
      <h1>The Spatula Store</h1>
      {showItem ? (
        <StripeContainer />
      ) : (
        <>
          {" "}
          <h3>$10.00</h3> <button onClick={() => setShowItem(true)}>Purchase Button</button>{" "}
        </>
      )}
    </div>
  );
}

export default App;
