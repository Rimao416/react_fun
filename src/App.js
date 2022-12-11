import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Slider from "./components/Slider";
function App() {
  const getUsers = async () => {
    const myUsers = await axios
      .get("http://localhost:5000/user")
      .then((response) => response.data);
    console.log(myUsers);
    setUsers(myUsers);
  };
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getUsers();
  }, []);


  return (
    <div className="App">
      <section className="container">
        {users.map((u, i) => (
          <Slider items={u} item_key={i}/>
        ))}
      </section>

    </div>
  );
}

export default App;
