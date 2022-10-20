import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import "./App.css";
function App() {
  const [users, setUsers] = useState([]);
  async function getUsers() {
    const reponse = await axios
      .get("http://localhost:5000/user")
      .then((response) => response.data);
    setUsers(reponse);
  }
  useEffect(() => {
    getUsers();
  }, []);
  const [data, setData] = useState({
    name: "",
    mail: "",
    password: "",
  });
  const handleChange = (event) => {
    const { name, value } = event.currentTarget;
    setData({ ...data, [name]: value });
    console.log(data);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const { password } = data;
    const data_filter = users.filter((u) => u.password === password);
    console.log(data_filter);
    if (data_filter.length > 0) {
      document.getElementById("error-password").innerText =
        "This password belongs to " +
        data_filter[0].email +
        ".  Please, enter another";
    }
  };
  return (
    <div className="App">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <div className="input">
            <label htmlFor="">Name</label>
            <input type="text" onChange={handleChange} name="name" id="" />
            <p className="error-name"></p>
          </div>
          <div className="input">
            <label htmlFor="">Email</label>
            <input type="mail" onChange={handleChange} name="mail" id="" />
            <p className="error-mail"></p>
          </div>
          <div className="input">
            <label htmlFor="">Password</label>
            <input
              type="password"
              onChange={handleChange}
              name="password"
              id=""
            />
            <p id="error-password"></p>
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default App;
