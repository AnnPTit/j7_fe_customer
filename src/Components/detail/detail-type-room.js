import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import classNames from "classnames/bind";
import style from "./detail.module.scss";
import Carousel from "react-material-ui-carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import { Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const cx = classNames.bind(style);
function Detail() {
  const { id } = useParams();
  const [room, setRoom] = useState({});
  const [love, setLove] = useState(false);
  const [typeRoomImages, setTypeRoomImages] = useState([]);

  const url = `/book/11-01-2024/12-01-2024/4/1/2/1/${room.typeRoomName}`;
  //Hàm detail
  useEffect(() => {
    // Định nghĩa hàm fetchData bên trong useEffect
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/type-room/detail/${id}`
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

  useEffect(() => {
    async function fetchBlogImages() {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/photo/${id}`
        );
        console.log("Response data:", response.data);
        const photos = response.data; // Assuming the API response returns a list of photo URLs directly

        setTypeRoomImages(photos); // Set the roomImages state with the array of photo URLs
      } catch (error) {
        console.log("Error fetching room images:", error);
      }
    }
    fetchBlogImages();
  }, [id]);

  function Item(props) {
    return (
      <Paper>
        <img src={props.item.url} className={cx("img-item")} />
      </Paper>
    );
  }
  return (
    <div className={cx("wrapper")}>
      <ToastContainer></ToastContainer>
      <div className={cx("preview-img")}>
        {typeRoomImages && typeRoomImages.length > 0 && (
          <Carousel>
            {typeRoomImages.map((item, i) => (
              <Item
                // key={i}
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
          <h1 className={cx("item-name")}>{room.typeRoomName}</h1>
        </div>
        <br />
        <div className="item-text-item">
          <span>Sức chứa : </span>
          <span>{room && room.capacity}</span>
          <i
            style={{
              marginRight: 10,
              marginLeft: 5,
            }}
            class="fa fa-user"
          ></i>
          {/* </span> */}-{/* <span className={cx("item-capacity-wrapper")}> */}
          <span
            style={{
              marginLeft: 10,
            }}
          >
            {room && room.children}
          </span>
          <i
            style={{
              marginLeft: 5,
            }}
            class="fa fa-child"
          ></i>
        </div>
        <br />
        <div className="item-text-item">
          <span>Đơn giá : </span>{" "}
          <span className={cx("item-capacity-wrapper")}>
            {room && room.pricePerDay && (
              <span>
                {room.pricePerDay.toLocaleString("vi-VN", {
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
          <span className={cx("")}>{room && room.note}</span>
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
  );
}

export default Detail;
