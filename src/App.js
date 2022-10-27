import "./App.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllPosts } from "./actions/UsersActions";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllPosts());
  }, []);
  const { users } = useSelector((state) => state.userReducer);
  return (
    <div className="container">
      {users.map((d) => (
        <div className="card" key={d.id}>
          <div className="card-text">
            <h2>{d.id}</h2>
            <hr />
            <p>
              name:{d.name}
              
            </p>
            <p>
              email:{d.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
