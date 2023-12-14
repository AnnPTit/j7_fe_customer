// Cards.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Cards = ({ room }) => {
  const [popup, setPopup] = useState(false);
  const [love1, setLove1] = useState(false);
  let love = false;
  const detailUrl = `/detail/${room.id}`;


  const changeLove = (id) => {
    console.log("ok");
    console.log(id);
    if (love) {
      love = false;
    } else {
      love = true;
    }
    setLove1(!love1)
  };

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return formatter.format(amount);
  };

  console.log(love);

  return (
    <>
  
  <div className="items">
  <Link to={detailUrl}>
    <div className="img">
      <img src={room.photoList[0].url ?? ""} alt="" />
    </div>

  </Link>
  <div className="title" >
      <h3 style={{color:"black", textDecoration: "none"}}>{room.roomName}</h3>
      <p style={{color:"black", textDecoration: "none"}}>Giá thành: {formatCurrency(room.typeRoom.pricePerDay)}</p>
    </div>
</div>
    </>
  );
};

export default Cards;
