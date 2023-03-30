import React, { useEffect, useState } from "react";
import "./App.css";
import Images from "./components/images";

function App() {
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts/1/photos").then(
      (response) => response.json().then((data) => setImages(data))
    );
  }, []);
  return (
    <div>
      <Images data={images} />
    </div>
  );
}

export default App;
