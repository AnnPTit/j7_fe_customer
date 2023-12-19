// Cards.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Cards = ({ room }) => {
  const url = `/preview/${room.roomId}`;
  const [popup, setPopup] = useState(false);
  const [love, setLove] = useState(false);
  const idCustom = localStorage.getItem("idCustom");
  const idCustomObject = JSON.parse(idCustom);
  const userId = idCustom ? idCustomObject.id : null;

  const toggleModal = async () => {
    setPopup(!popup);

  };


  useEffect(() => {
    // Định nghĩa hàm fetchData bên trong useEffect
    async function fetchData() {
      try {
        const storedData = localStorage.getItem("idCustom");
        // Nếu dữ liệu tồn tại trong localStorage
        const customer = JSON.parse(storedData);
        const response = await axios.get(
          `http://localhost:2003/api/home/check-love?idCustom=${userId}&idRoom=${room.roomId}`
        );
        console.log(response);
        setLove(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const changeLove = () => {
    const storedData = localStorage.getItem("idCustom");
    if (!storedData) {
      // toast.error("vui lòng đăng nhập !");
      return;
    }
    // Định nghĩa hàm fetchData bên trong useEffect
    async function fetchData() {
      try {
        const storedData = localStorage.getItem("idCustom");
        // Nếu dữ liệu tồn tại trong localStorage
        const customer = JSON.parse(storedData);
        const response = await axios.get(
          `http://localhost:2003/api/home/set-love?idCustom=${userId}&idRoom=${room.roomId}`
        );
        console.log(response);
        setLove(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    setLove(!love);
  };

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return formatter.format(amount);
  };
  const closeModal = () => {
    setPopup(false);
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
                  {love === true ? (
                    <img
                      onClick={changeLove}
                      src="https://clipground.com/images/clipart-heart-icon-2.png"
                      style={{
                        width: 30,
                        height: 30,
                      }}
                    ></img>
                  ) : (
                    <img
                      onClick={changeLove}
                      src="https://webstockreview.net/images/hearts-vector-png-7.png"
                      style={{
                        width: 30,
                        height: 30,
                      }}
                    ></img>
                  )}
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
                  width: "150px",
                  height: "45px"
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
