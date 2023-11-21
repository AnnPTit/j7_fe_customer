// Cards.js
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Cards = ({ room }) => {
  const [popup, setPopup] = useState(false);

  const toggleModal = () => {
    setPopup(!popup);
  };

  const closeModal = () => {
    setPopup(false);
  };

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return formatter.format(amount);
  };

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
                <h1>{room.roomName}</h1>
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cards;
