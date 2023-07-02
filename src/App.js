import "./App.css";
import React, { useState } from "react";

const theme = {
  dark: {
    background: "#000",
    color: "#fff",
  },
  light: {
    background: "#fff",
    color: "#000",
  },
};
// export const ThemeContext=React.createContext()
const ThemeContext = React.createContext(theme.dark);

function SearchForm() {
  return (
    <div>
      <input type="text" />
      <ThemedButton>M'inscrire</ThemedButton>
    </div>
  );
}

function Toolbar() {
  return (
    <div>
      <SearchForm />
      <ThemedButton>M'inscrire</ThemedButton>
    </div>
  );
}

function ThemedButton({ children }) {
  return (
    <ThemeContext.Consumer>
      {(value) => {
        return <button style={value}>{children}</button>;
      }}
    </ThemeContext.Consumer>
  );
}

export default function App() {
  return (
    <ThemeContext.Provider value={theme.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}
