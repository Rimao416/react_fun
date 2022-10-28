import React from "react";
import { useParams, useOutletContext } from "react-router-dom";
function Book() {
  const { id } = useParams();
  const obj = useOutletContext();
  return (
    <div>
      Book {id}, {obj.hello}
    </div>
  );
}

export default Book;
