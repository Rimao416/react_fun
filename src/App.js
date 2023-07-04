import React, { useContext } from "react";
import Posts from "./components/Posts";
import { useState } from "react";
import { ThemeContext, themes } from "./context/themeContext";

function App() {
  const [theme, setTheme] = useState(themes[0]);
  function handleOnClick() {
    console.log(theme)
    theme===themes[1] ? setTheme(themes[0]) : setTheme(themes[1]);
  }
  return (
    <ThemeContext.Provider value={{ theme, handleOnClick }}>
      <div className="main-container">
        <h1 className="text-center">Light Dark Theme App</h1>
        <Posts />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
