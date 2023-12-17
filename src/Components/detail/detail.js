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

  useEffect(() => {
    // Định nghĩa hàm fetchData bên trong useEffect
    async function fetchData() {
      try {
        const storedData = localStorage.getItem("idCustom");
        // Nếu dữ liệu tồn tại trong localStorage
        const customer = JSON.parse(storedData);
        const response = await axios.get(
          `http://localhost:2003/api/home/check-love?idCustom=${customer.id}&idRoom=${id}`
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
      toast.error("vui lòng đăng nhập !");
      return;
    }
    // Định nghĩa hàm fetchData bên trong useEffect
    async function fetchData() {
      try {
        const storedData = localStorage.getItem("idCustom");
        // Nếu dữ liệu tồn tại trong localStorage
        const customer = JSON.parse(storedData);
        const response = await axios.get(
          `http://localhost:2003/api/home/set-love?idCustom=${customer.id}&idRoom=${id}`
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
      <ToastContainer></ToastContainer>
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
          </span>
        </div>
        <p>{room.note}</p>
        <div className="item-text-item">
          <span className={cx("item-type-room")}>
            {room.typeRoom && room.typeRoom.typeRoomName} -
            {room.floor && room.floor.floorName}
          </span>
        </div>

        <br />
        <div className="item-text-item">
          <span>Sức chứa : </span>
          <span className={cx("item-capacity-wrapper")}>
            <span className={cx("item-capacity")}>
              {room.typeRoom && room.typeRoom.capacity}
            </span>
            <i class="fa fa-user"></i>
          </span>
          -
          <span className={cx("item-capacity-wrapper")}>
            <span className={cx("item-capacity")}>
              {room.typeRoom && room.typeRoom.children}
            </span>
            <i class="fa fa-child"></i>
          </span>
          {/* <span className={cx("capacity")}>
            {room.typeRoom.children}
            <i class="fa fa-child"></i>
          </span> */}
        </div>
        <br />
        <div className="item-text-item">
          <span>Đơn giá : </span>{" "}
          <span className={cx("item-capacity-wrapper")}>
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
        <hr />
        <div>
          <div className="item-text-item">
            <span>Tiện ích :</span>
            <br />
            <span className={cx("")}>
              {room.roomFacilityList &&
                room.roomFacilityList.map((facility) => (
                  <div key={facility.id}>
                    <ul>
                      {facility.facility && (
                        <li>- {facility.facility.facilityName}</li>
                      )}
                    </ul>
                  </div>
                ))}
            </span>
          </div>
        </div>
        <br></br>
        <div className="item-text-item">
          <span>
            Mô tả : <br />
          </span>{" "}
          <span className={cx("")}>{room.typeRoom && room.typeRoom.note}</span>
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
