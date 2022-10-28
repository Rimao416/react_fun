import React from "react";
import { Link, Outlet } from "react-router-dom";
function BookLayout() {
  return (
    <>
      <Link to="/books/1">Book 1</Link>
      <br />
      <hr />
      <Link to="/books/2">Book 2</Link>
      <hr />
      <br />
      <Link to="/books/nez">New Book</Link>
      <hr />
      <br />
      <Outlet context={{hello:"World"}}/>
    </>
  );
}

export default BookLayout;
