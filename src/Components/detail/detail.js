import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import classNames from "classnames/bind";
import style from "./detail.module.scss";
import Carousel from "react-material-ui-carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import { Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";
const cx = classNames.bind(style);
function Detail() {
  const { id } = useParams();
  const [room, setRoom] = useState({});
  const url = `/preview/${id}`;
  //Hàm detail
  useEffect(() => {
    // Định nghĩa hàm fetchData bên trong useEffect
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/room/detail/${id}`
        );
        // console.log("Room", response.data);
        if (response.data) {
          setRoom(response.data);
          console.log("Room", response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  var items = room.photoList;

  function Item(props) {
    return (
      <Paper>
        <img src={props.item.url} className={cx("img-item")} />
      </Paper>
    );
  }
  return (
    <div className={cx("wrapper")}>
      <div className={cx("preview-img")}>
        {room.photoList && room.photoList.length > 0 && (
          <Carousel>
            {items.map((item, i) => (
              <Item
                key={i}
                item={item}
                style={{
                  width: "100%",
                }}
              />
            ))}
          </Carousel>
        )}
      </div>
      <div className={cx("item-infor")}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1 className={cx("item-name")}>{room.roomName}</h1>
          <span className={cx("item-text")}>
            {room.status === 1 ? (
              <button className="btn btn-success">Còn trống</button>
            ) : (
              "Đã đặt"
            )}
          </span>
        </div>
        <p>{room.note}</p>

        <div className="item-text-item">
          <span className={cx("item-text")}>
            {room.typeRoom && room.typeRoom.typeRoomName}
          </span>
        </div>
        <br />
        <div className="item-text-item">
          <span className={cx("item-text")}>
            {room.floor && room.floor.floorName}
          </span>
        </div>
        <br />
        <div className="item-text-item">
          <span>Sức chứa : </span>
          <span className={cx("item-text")}>
            {room.typeRoom && room.typeRoom.capacity} N
          </span>
        </div>
        <br />
        <div className="item-text-item">
          <span>Đơn giá theo ngày : </span>{" "}
          <span
            className={cx("item-text")}
            style={{
              color: "red",
            }}
          >
            {room.typeRoom && room.typeRoom.pricePerDay && (
              <span>
                {room.typeRoom.pricePerDay.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}{" "}
              </span>
            )}
          </span>
        </div>
        <br />
        <div className="item-text-item">
          <span>Đơn giá theo giờ : </span>{" "}
          <span
            className={cx("item-text")}
            style={{
              color: "red",
            }}
          >
            {room.typeRoom && room.typeRoom.pricePerHours && (
              <span>
                {room.typeRoom.pricePerHours.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}{" "}
              </span>
            )}
          </span>
        </div>
        <br />
        <hr />
        <div className="item-text-item">
          <span>
            Mô tả : <br />
          </span>{" "}
          <span className={cx("")}>{room.typeRoom && room.typeRoom.note}</span>
        </div>
        {room.status === 1 ? (
          <Link
            to={url}
            className="btn btn-primary"
            style={{
              marginTop: 50,
            }}
          >
            Đặt Ngay
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default Detail;
