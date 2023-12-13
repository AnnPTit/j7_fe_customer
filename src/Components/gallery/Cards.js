// Cards.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Cards = ({ room }) => {
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
        setLove1(love)
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
        <div className="img">
          <img
            src={room.photoList[0].url}
            alt="Gallery Image"
            onClick={toggleModal}
            style={{ cursor: "pointer" }}
          />
          <i className="fas fa-image" onClick={toggleModal}></i>
        </div>
        <div className="title">
          <h3>{room.roomName}</h3>
          <p>Giá thành: {formatCurrency(room.typeRoom.pricePerDay)}</p>
        </div>
      </div>

      {popup && (
        <div className="popup">
          <div className="hide" onClick={closeModal}></div>
          <div className="popup-content">
            <img
              src={room.photoList[0].url}
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
                <span>{room.note}</span>
              </div>
              <div className="item-text-item">
                <span>
                  {room.typeRoom.typeRoomName}-{room.floor.floorName}{" "}
                </span>
              </div>
              <div className="item-text-item">
                <span>Sức chứa: {room.typeRoom.capacity} Người</span>
              </div>
              <div className="item-text-item">
                <span>
                  Giá thành: {formatCurrency(room.typeRoom.pricePerDay)}
                </span>
              </div>
              <hr />
              <div className="item-text-item">
                <span>
                  Mô tả : <br />
                </span>{" "}
                <span>{room.typeRoom.note}</span>
              </div>
              {/* <button onClick={()=>{window.location.href=`http://localhost:3001/detail/${id}`}}>Đăt ngay</button> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cards;
