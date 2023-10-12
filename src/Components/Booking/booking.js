import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import axios from "axios";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import style from "./booking.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import Tippy from "@tippyjs/react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import BasicTabs from "../Tab/CustomTabPanel";

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
  const [open, setOpen] = useState(false);
  const [room, setRoom] = useState([]);
  const [tc, setTc] = useState(0);
  const [dayStart, setDayStart] = useState();
  const [dayEnd, setDayEnd] = useState();
  const [roomPrice, setRoomPrice] = useState(0);
  const [deposit, setDeposit] = useState();
  const [vat, setVat] = useState();
  const [totalPriceRoom, setTotalPriceRoom] = useState();
  const today = new Date().toISOString().split("T")[0];
  const [guestCounts, setGuestCounts] = useState({}); // Một đối tượng để lưu số lượng khách cho từng phòng
  const [isBook, setIsBook] = useState({
    message: null,
    status: null,
    ids: [],
  });
  let ids;
  let url = id;
  function isValidEmail(email) {
    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    const hoVaTenValue = document.getElementById("hoVaTenInput").value;
    const emailValue = document.getElementById("emailInput").value;
    const soDienThoaiValue = document.getElementById("soDienThoaiInput").value;
    const note = document.getElementById("note").value;
    if (hoVaTenValue === "") {
      toast.error("Họ và tên không được để trống");
      return;
    } else if (emailValue === "") {
      toast.error("Email không được để trống");
      return;
    } else if (!isValidEmail(emailValue)) {
      toast.error("Email không đúng định dạng ");
      return;
    } else if (soDienThoaiValue === "") {
      toast.error("Số điện thoại không được để trống");
      return;
    }
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

  console.log(isBook.ids);
  const roomIds = room.map((room) => [room.id]);
  console.log(roomIds);
  let isMatched = false;

  isBook.ids.forEach((isBookId) => {
    roomIds.forEach((roomIdArray) => {
      if (roomIdArray.includes(isBookId)) {
        isMatched = true;
      }
    });
  });

  useEffect(() => {
    if (isMatched) {
      toast.error(isBook.message);
    } else {
      console.log("Không có phần tử trùng nhau giữa hai danh sách.");
    }
  });

  const handleGuestCountChange = (roomId, count) => {
    if (count < 0) {
      toast.error("Số khách lớn hơn 0");
      return;
    }
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
        console.log(url);
        ids = url.split("&");

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
  }, [id]);

  useEffect(() => {
    setTotalPriceRoom(roomPrice);
  });
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

  function formatCurrency(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  const handleRemoveRoom = (id) => {
    if (room.length === 1) {
      toast.error("Không thể xóa !");
    } else {
      Swal.fire({
        title: "Bạn có chắc chắn muốn xóa ? ",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đúng, Xóa nó!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const updatedRoom = room.filter((item) => item.id !== id);
          setRoom(updatedRoom);

          if (updatedRoom) {
            Swal.fire("Xóa thành công !", "success");
            toast.success("Xóa Thành Công !");
          }
        }
      });
    }
  };

  const connect = () => {
    const ws = new SockJS(`http://localhost:2003/ws`);
    stompClient = Stomp.over(ws);
    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/product", (data) => {
        const status = data.body; // Lấy nội dung từ tin nhắn
        console.log(status);
        const message = JSON.parse(status);
        // Sử dụng biến containsElements để kiểm tra và alert status.body
        setIsBook(message);
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
    const startDate = new Date(selectedDay);
    const endDate = new Date(dayEnd);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    subPriceRoom(numberOfDays + 1, roomPrice);
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
    setVat((price * tc) / 100);
  };

  return (
    <div>
      <ToastContainer />
      <h1
        style={{
          margin: 80,
        }}
      >
        Hoàn Tất Đặt Phòng
      </h1>
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
                <span className={cx("type-room")}>
                  {room1.typeRoom && <p> {room1.typeRoom.typeRoomName}</p>}
                </span>
              </div>
              {room1.typeRoom && (
                <p>
                  Sức chứa :
                  <span className={cx("capacity")}>
                    <i class="fa fa-user"></i> {room1.typeRoom.capacity}
                  </span>
                </p>
              )}

              <div className={cx("room-price")}>
                {room1.typeRoom && (
                  <p>
                    Đơn giá theo giờ :
                    <span
                      style={{
                        color: "red",
                      }}
                    >
                      {room1.typeRoom.pricePerHours.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND", // Loại tiền tệ Việt Nam (VND)
                      })}
                    </span>
                  </p>
                )}
                {room1.typeRoom && (
                  <p>
                    Đơn giá theo ngày :
                    <span
                      style={{
                        color: "red",
                      }}
                    >
                      {room1.typeRoom.pricePerDay.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND", // Loại tiền tệ Việt Nam (VND)
                      })}
                    </span>
                  </p>
                )}
              </div>
              <br />
              <p>{room1.note}</p>
            </div>
            <div className={cx("service-item")}>
              <input
                type="number"
                value={guestCounts[room1.id] || ""}
                onChange={(e) =>
                  handleGuestCountChange(room1.id, e.target.value)
                }
                placeholder="Số khách"
                className={cx("numberCustom")}
              />
              <Tippy
                content="Thêm dịch vụ"
                interactive={true}
                interactiveBorder={20}
                delay={100}
              >
                <i
                  class="fa fa-bars"
                  style={{
                    color: "black",
                    fontSize: 30,
                    marginRight: 20,
                    padding: 20,
                    cursor: "pointer",
                  }}
                  onClick={handleOpenDialog}
                ></i>
              </Tippy>
              <button
                onClick={() => {
                  handleRemoveRoom(room1.id);
                }}
              >
                <i
                  className={cx("fa fa-trash")}
                  style={{
                    color: "red",
                    fontSize: 30,
                    marginRight: 20,
                    padding: 20,
                    cursor: "pointer",
                  }}
                ></i>
              </button>
            </div>
            <div
              style={{
                width: 50,
              }}
            ></div>
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
            <p>Nhận phòng từ : 12:00 CH</p>
            <p>Trả phòng trước : 2:00 CH</p>
            <p>Tiền Phòng </p>
            <input
              type="text"
              className="form-control"
              disabled
              defaultValue={totalPriceRoom}
            />
            <p
              style={{
                marginTop: 20,
              }}
            >
              Tiền Cọc{" "}
            </p>
            <input
              type="text"
              className="form-control"
              disabled
              defaultValue={deposit}
            />
            <br />
            <p>VAT </p>
            <input
              type="text"
              className="form-control"
              disabled
              defaultValue={vat}
            />
            <br />
            <p>Ghi chú </p>
            <input
              type="text"
              className="form-control"
              id="note"
              defaultValue={""}
            />
            <br />

            {isMatched && isBook.status === 1 ? (
              <button type="button" className="btn btn-success">
                Phòng đã được đặt
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-info"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Đặt phòng
              </button>
            )}
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        fullWidth
        PaperProps={{
          style: {
            maxWidth: "60%",
            maxHeight: "90%",
          },
        }}
      >
        <DialogTitle>Chọn dịch vụ </DialogTitle>
        <DialogContent>
          <BasicTabs>
            <p>ok</p>
          </BasicTabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Booking;
