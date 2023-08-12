import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import axios from "axios";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import style from "./booking.module.scss";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

var stompClient = null;
const disconnect = () => {
  if (stompClient != null) {
    stompClient.disconnect();
    console.log("Stomp disconnected");
  }
};
const sendMessage = (message) => {
  stompClient.send("/app/products", {}, message);
};
const cx = classNames.bind(style);
function Booking() {
  const { id } = useParams();
  const [room, setRoom] = useState([]);
  const [tc, setTc] = useState(0);
  const [dayStart, setDayStart] = useState();
  const [dayEnd, setDayEnd] = useState();
  const [roomPrice, setRoomPrice] = useState(0);
  const [deposit, setDeposit] = useState();
  const [totalPriceRoom, setTotalPriceRoom] = useState();
  const [dataService, setDataService] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedServiceCodes, setSelectedServiceCodes] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [guestCounts, setGuestCounts] = useState({}); // Một đối tượng để lưu số lượng khách cho từng phòng
  const [isBook, setIsBook] = useState(0);

  const handleSubmit = () => {
    const hoVaTenValue = document.getElementById("hoVaTenInput").value;
    const emailValue = document.getElementById("emailInput").value;
    const soDienThoaiValue = document.getElementById("soDienThoaiInput").value;
    const note = document.getElementById("note").value;
    // Tạo payload
    const roomData = room.map((room) => ({
      id: room.id,
      guestCount: guestCounts[room.id] || 0, // Lấy số lượng khách từ guestCounts, mặc định là 0 nếu không có
    }));
    const payload = {
      rooms: roomData,
      user: {
        hoVaTen: hoVaTenValue,
        email: emailValue,
        soDienThoai: soDienThoaiValue,
      },
      dayStart,
      dayEnd,
      deposit,
      totalPriceRoom,
      note,
    };
    console.log(payload);
    sendMessage(JSON.stringify(payload));
  };

  const handleGuestCountChange = (roomId, count) => {
    setGuestCounts((prevCounts) => ({
      ...prevCounts,
      [roomId]: count,
    }));
  };

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const initialDate = `${year}-${month}-${day}`;
    setDayStart(initialDate);
    setDayEnd(initialDate);
  }, []);
  //Hàm detail
  useEffect(() => {
    async function fetchData() {
      try {
        const ids = id.split("&");

        for (const id1 of ids) {
          const response = await axios.get(
            `http://localhost:2003/api/home/room/detail/${id1}`
          );
          if (response.data) {
            setRoom((prevRoom) => [...prevRoom, response.data]);
            setRoomPrice((prev) => prev + response.data.typeRoom.pricePerDay);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  // Hàm Lấy Tiền cọc
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/deposit/getByCode?code=TC`
        );
        // const vat = await axios.get(
        //   "http://localhost:2003/api/home/deposit/getByCode?code=VAT"
        // );
        // console.log("Room", response.data);
        setTc(response.data.pileValue);
        // setVat(vat.data.pileValue);

        console.log("Tiền cọc", response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  // Hàm get Service
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/service/getAll`
        ); // Thay đổi URL API của bạn tại đây
        console.log(response.data);
        setDataService(response.data);
      } catch (error) {
        if (error.response) {
          // Xử lý response lỗi
          if (error.response.status === 403) {
            alert("Bạn không có quyền truy cập vào trang này");
            window.location.href = "/auth/login"; // Thay đổi "/dang-nhap" bằng đường dẫn đến trang đăng nhập của bạn
          } else {
            alert("Có lỗi xảy ra trong quá trình gọi API");
          }
        } else {
          console.log("Không thể kết nối đến API");
        }
      }
    };
    fetchData();
  }, []);
  const handleChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prevState) => ({ ...prevState, [name]: checked }));
    if (checked) {
      setSelectedServiceCodes((prevSelectedCodes) => [
        ...prevSelectedCodes,
        name,
      ]);
    } else {
      setSelectedServiceCodes((prevSelectedCodes) =>
        prevSelectedCodes.filter((code) => code !== name)
      );
    }
  };
  function formatCurrency(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  const connect = () => {
    const ws = new SockJS(`http://localhost:2003/ws`);
    stompClient = Stomp.over(ws);
    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/product", (data) => {
        const status = data;
        console.log(status.body);
        setIsBook(status.body);
      });
    });
  };

  const handleChoseDay = (e) => {
    const selectedDay = e.target.value;
    if (selectedDay < today) {
      alert("Ngày đặt không thể nhỏ hơn ngày hôm nay.");
      return;
    }
    if (selectedDay > dayEnd) {
      alert("Ngày đặt không thể lớn hơn ngày trả.");
      return;
    }
    setDayStart(selectedDay);
  };
  const handleSubPrice = (e) => {
    const startDate = new Date(dayStart);
    const endDate = new Date(e.target.value);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (numberOfDays < 0) {
      alert("Vui lòng chọn lại ngày ");
      return;
    }
    setDayEnd(e.target.value);
    subPriceRoom(numberOfDays + 1, roomPrice);
  };
  const subPriceRoom = (day, roomPrice) => {
    console.log(roomPrice);
    let price = day * roomPrice;
    setTotalPriceRoom(price);
    setDeposit((price * tc) / 100);
  };

  return (
    <div>
      <h1>Hoàn Tất Đặt Phòng </h1>
      <FormGroup>
        {dataService.map((service) => (
          <FormControlLabel
            key={service.id}
            control={
              <Checkbox
                checked={checkedItems[service.id] || false}
                onChange={handleChange}
                name={service.id}
              />
            }
            label={
              service.serviceName +
              " - " +
              formatCurrency(service.price) +
              " VND"
            }
          />
        ))}
      </FormGroup>
      <div className={cx("wrapper")}>
        {room.map((room1) => (
          <div key={room1.id} className={cx("room")}>
            <div className={cx("img")}>
              {room1.photoList && (
                <img
                  className={cx("img-item")}
                  src={room1.photoList[0].url}
                  alt="Room"
                />
              )}
            </div>
            <div className={cx("room-body")}>
              <div className={cx("room-heading")}>
                <h2 className={cx("room-title")}>{room1.roomName}</h2>
                <p>-</p>
                {room1.typeRoom && <p> {room1.typeRoom.typeRoomName}</p>}
              </div>
              {room1.typeRoom && <p> Số Khách : {room1.typeRoom.capacity}</p>}

              <div className={cx("room-price")}>
                {room1.typeRoom && (
                  <p> Đơn giá theo giờ : {room1.typeRoom.pricePerHours}</p>
                )}
                {room1.typeRoom && (
                  <p> Đơn giá theo ngày : {room1.typeRoom.pricePerDay}</p>
                )}
              </div>
              <br />
              <p>{room1.note}</p>
            </div>
            <div>
              <input
                type="number"
                value={guestCounts[room1.id] || ""}
                onChange={(e) =>
                  handleGuestCountChange(room1.id, e.target.value)
                }
                style={{
                  background: "red",
                }}
              />
            </div>
          </div>
        ))}

        {/* Thông tin của khách hàng  */}
        <div className={cx("info-body")}>
          <div className={cx("info-customer")}>
            <h2>Thông tin khách hàng </h2>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Họ và tên
              </label>
              <input
                type="text"
                className="form-control"
                id="hoVaTenInput"
                placeholder="Nguyen Van A"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="basic-url" className="form-label">
                Email
              </label>
              <div className="input-group">
                <span className="input-group-text" id="basic-addon3">
                  @
                </span>
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  aria-describedby="basic-addon3 basic-addon4"
                />
              </div>
            </div>
            <p>Số điện thoại</p>
            <div className="input-group mb-3">
              <span className="input-group-text">+84</span>
              <input
                id="soDienThoaiInput"
                type="text"
                className="form-control"
                aria-label="Amount (to the nearest dollar)"
              />
            </div>
          </div>
          <div className={cx("info-order")}>
            <h2>Thông tin đơn hàng </h2>
            <p>Ngày Đặt</p>
            <div className="input-group mb-3">
              <input
                type="date"
                className="form-control"
                value={dayStart}
                onChange={(e) => handleChoseDay(e)}
              />
            </div>
            <div className="input-group mb-3">
              <input
                type="date"
                value={dayEnd}
                className="form-control"
                onChange={(e) => handleSubPrice(e)}
              />
            </div>
            <p>Nhận phòng từ : 2:00 CH</p>
            <p>Trả phòng trước : 12:00 CH</p>
            <p>Tiền Phòng </p>
            <input
              type="text"
              className="form-control"
              disabled
              defaultValue={totalPriceRoom}
            />
            <p>Tiền Cọc </p>
            <input
              type="text"
              className="form-control"
              disabled
              defaultValue={deposit}
            />
            <br />
            <p>Ghi chú </p>
            <input
              type="text"
              className="form-control"
              id="note"
              defaultValue={deposit}
            />
            <br />
            {isBook == 0 ? (
              <button
                type="button"
                className="btn btn-info"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Đặt phòng
              </button>
            ) : (
              <div>
                <button type="button" className="btn btn-success">
                  Phòng Đã được đặt thành công
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
