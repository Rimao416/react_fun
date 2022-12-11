import React from "react";
import "./slider.css";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
function Slider({ items, item_key }) {
  function convertInHundred(table) {
    return table.length * 100 - 100;
  }

  let value = 0;
  let compteur = 0;
  const handleRightSlide = (i) => {
    const slide = document.querySelector(`#slide${i}`);
    const ItemSlide = slide.querySelectorAll(".slide_img .images");
    value = value - 100;
    compteur++;
    ItemSlide.forEach((item, i) => {
      if (compteur < ItemSlide.length) {
        item.style.transform = `translateX(${value}%)`;
      } else {
        compteur = 0;
        value = 0;
        item.style.transform = `translateX(${0}%)`;
      }
    });
  };
  const handleLeftSlide = (i) => {
    const slide = document.querySelector(`#slide${i}`);
    const ItemSlide = slide.querySelectorAll(".slide_img .images");
    if (compteur !== 0) {
      compteur--;
      value = value + 100;
      ItemSlide.forEach((item, i) => {
        item.style.transform = `translateX(${value}%)`;
      });
    } else {
      compteur = ItemSlide.length-1;
      value = convertInHundred(ItemSlide) * -1;
      ItemSlide.forEach((item, i) => {
        item.style.transform = `translateX(${value}%)`;
      });
    }
    console.log(compteur);
    console.log(value)
  };

  return (
    <div className="slide" id={`slide${item_key}`}>
      <div className="bar_left">
        <span className="icons" onClick={() => handleLeftSlide(item_key)}>
          <FaAngleLeft />
        </span>
      </div>
      <div className="bar_right">
        <span className="icons" onClick={() => handleRightSlide(item_key)}>
          <FaAngleRight />
        </span>
      </div>
      <div className="slide_img">
        {items.photo.map((p) => (
          <img src={p} alt="" className="images" />
        ))}
        {/* <img src={items.photo[0]} alt="" /> */}
      </div>
      <div className="slide_text">{items.description}</div>
    </div>
  );
}

export default Slider;
