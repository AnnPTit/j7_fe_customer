// Cards.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Cards = ({ room }) => {
  const url = `/preview/${room.roomId}`;
  const [popup, setPopup] = useState(false);
  const [love1, setLove1] = useState(false);
  let love = false;

  const toggleModal = async () => {
    setPopup(!popup);

    try {
      const response = await axios.get(
        "http://localhost:2003/api/home/check-love?idCustom=d911421b-350f-11ee-8f16-489ebddaf682&idRoom=43db6a16-e27a-49e0-9f7e-d8ccdf22affe"
      );

      console.log(response.data);

      if (response.data) {
        love = response.data;
        setLove1(love);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setPopup(false);
  };

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
        <div className="img">
          <img
            src={room.photoList[0]}
            alt="Gallery Image"
            onClick={toggleModal}
            style={{ cursor: "pointer" }}
          />
          <i className="fas fa-image" onClick={toggleModal}></i>
        </div>
        <div className="title">
          <h3>{room.roomName}</h3>
          <p>Giá thành: {formatCurrency(room.pricePerDay)}</p>
        </div>
      </div>

      {popup && (
        <div className="popup">
          <div className="hide" onClick={closeModal}></div>
          <div className="popup-content">
            <img
              src={room.photoList[0]}
              alt="Gallery Image"
              style={{ width: "500px", height: "300px" }}
            />
            <div className="detail">
              <div className="item-text-item">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h1>{room.roomName}</h1>
                  {/* {love || love1 ? (
                    <img
                      onClick={() => changeLove(room.id)}
                      src="https://webstockreview.net/images/hearts-vector-png-7.png"
                      style={{
                        width: 30,
                        height: 30,
                      }}
                    ></img>
                  ) : (
                    <img
                      onClick={() => changeLove(room.id)}
                      src="https://clipground.com/images/clipart-heart-icon-2.png"
                      style={{
                        width: 30,
                        height: 30,
                      }}
                    ></img>
                  )} */}
                </div>
              </div>
              <hr />
              <div className="item-text-item">
                {/* <span>{room.not}</span> */}
              </div>
              <div className="item-text-item">
                <span>
                  {room.typeRoom}-{room.floor}{" "}
                </span>
              </div>
              <div className="item-text-item">
                <span>Sức chứa: {room.capacity} Người</span>
              </div>
              <div className="item-text-item">
                <span>Giá thành: {formatCurrency(room.pricePerDay)}</span>
              </div>
              <hr />
              <div className="item-text-item">
                <span>
                  Mô tả : <br />
                </span>{" "}
                <span>{room.typeRoomNote}</span>
              </div>
              <Link
                to={url}
                className="btn btn-primary"
                style={{
                  marginTop: 50,
                }}
              >
                Đặt Ngay
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cards;
