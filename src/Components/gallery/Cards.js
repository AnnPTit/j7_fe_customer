// Cards.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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
    setLove1(!love1);
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
            <img src={room.url ?? ""} alt="" />
          </div>
        </Link>
        <div className="title">
          <h3 style={{ color: "black", textDecoration: "none" }}>
            {room.name}
          </h3>
          <p style={{ color: "black", textDecoration: "none" }}>
            {room.typeRoom}
          </p>
          <p style={{ color: "black", textDecoration: "none" }}>
            Giá thành: {formatCurrency(room.price)}
          </p>

          <img
            style={{
              width: 15,
              marginBottom: 5,
            }}
            src="https://th.bing.com/th/id/R.ef70c5e8446f6243af173f916a7e8f5d?rik=xHb7T2zzMH4cfg&pid=ImgRaw&r=0"
          />
          <span>{room.capacity}</span>
          <img
            style={{
              width: 15,
              marginBottom: 5,
              marginLeft: 10,
              marginRight: 5,
            }}
            src="https://th.bing.com/th/id/OIP.p3oYM562LCiw-KSMEeDIdAAAAA?rs=1&pid=ImgDetMain"
          />
          <span>{room.children}</span>
          <br />  
          <span>Số lượt đặt : {room.bookingCount}</span>
        </div>
      </div>
    </>
  );
};

export default Cards;
