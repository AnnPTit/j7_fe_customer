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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [dayStart, setDayStart] = useState(new Date());
  const [dayEnd, setDayEnd] = useState(new Date());
  const [roomPrice, setRoomPrice] = useState(0);
  const [deposit, setDeposit] = useState();
  const [customer, setCustomer] = useState({});
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vat, setVat] = useState();
  const [totalPriceRoom, setTotalPriceRoom] = useState();
  const today = new Date();
  const [loading, setLoading] = useState(false);
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
  function isPhoneNumberValid(phoneNumber) {
    const regex = /^(\+84|0)[35789][0-9]{8}$/;
    return regex.test(phoneNumber);
  }
  const handleOpenDialog = (id) => {
    console.log(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  // Tạo payload
  const roomData = room.map((room) => ({
    id: room.id,
    guestCount: guestCounts[room.id] || 0, // Lấy số lượng khách từ guestCounts, mặc định là 0 nếu không có
  }));
  const handleSubmit = () => {
    const hoVaTenValue = fullname;
    const emailValue = email;
    const soDienThoaiValue = phone;
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
    } else if (!isPhoneNumberValid(soDienThoaiValue)) {
      toast.error("Số điện thoại không đúng định dạng !");
      return;
    }

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
    for (let index = 0; index < payload.rooms.length; index++) {
      if (payload.rooms[index].guestCount === 0) {
        toast.error("Số khách không được để trống!");
        return;
      }
    }
    setLoading(true);
    sendMessage(JSON.stringify(payload));
  };

  const roomIds = room.map((room) => [room.id]);
  console.log(roomIds);
  let isMatched = false;

  if (isBook.ids && isBook.ids.length > 0) {
    isBook.ids.forEach((isBookId) => {
      roomIds.forEach((roomIdArray) => {
        if (roomIdArray.includes(isBookId)) {
          isMatched = true;
        }
      });
    });
  }

  useEffect(() => {
    if (isMatched) {
      toast.info(isBook.message);
    } else {
      console.log("Không có phần tử trùng nhau giữa hai danh sách.");
    }
  });

  const handleGuestCountChange = (roomId, count, capacity) => {
    if (count < 0) {
      toast.error("Số khách lớn hơn 0 !");
      return;
    }
    if (count > capacity) {
      toast.error("Số khách vượt quá sức chứa !");
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

  // useEffect(() => {
  //   const initialDate = new Date();
  //   // const year = currentDate.getFullYear();
  //   // const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  //   // const day = currentDate.getDate().toString().padStart(2, "0");
  //   // const initialDate = `${day}-${month}-${year}`;
  //   setDayStart(initialDate);
  //   setDayEnd(initialDate);
  // }, []);
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
    setDeposit(roomPrice / 10);
    setVat(roomPrice / 10);
  }, [roomPrice]);
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

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

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
        console.log(status.message);
        const message = JSON.parse(status);
        // Sử dụng biến containsElements để kiểm tra và alert status.body
        setIsBook(message);
        toast.error(message.message);
        setLoading(false);
      });
    });
  };

  const subPriceRoom = (day, roomPrice) => {
    console.log(roomPrice);
    let price = day * roomPrice;
    setTotalPriceRoom(price);
    setDeposit((price * tc) / 100);
    setVat((price * tc) / 100);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr); // Chuyển đổi chuỗi ngày thành đối tượng Date

    if (isNaN(date.getTime())) {
      return ""; // Trả về giá trị mặc định hoặc thông báo lỗi nếu chuỗi không hợp lệ
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const storedData = localStorage.getItem("idCustom");

    if (storedData) {
      // Nếu dữ liệu tồn tại trong localStorage
      const customer = JSON.parse(storedData);
      setCustomer(customer);
    }
  }, []);
  useEffect(() => {
    if (customer) {
      setFullname(customer.fullname);
      setEmail(customer.email);
      setPhone(customer.phoneNumber);
    }
  }, [customer]);

  const handleDateChange = (date) => {
    console.log("today", today);
    console.log("today2", date);
    if (date < today) {
      alert("Ngày đặt không thể nhỏ hơn ngày hôm nay.");
      return;
    }
    if (date > dayEnd) {
      alert("Ngày đặt không thể lớn hơn ngày trả.");
      return;
    }
    setDayStart(date);
    const startDate = new Date(date);
    const endDate = new Date(dayEnd);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    subPriceRoom(numberOfDays + 1, roomPrice);
  };
  const handleDateChange2 = (date) => {
    const startDate = new Date(dayStart);
    const endDate = date;
    const timeDiff = endDate.getTime() - startDate.getTime();
    const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (numberOfDays < 0) {
      alert("Vui lòng chọn lại ngày ");
      return;
    }
    setDayEnd(date);
    subPriceRoom(numberOfDays + 1, roomPrice);
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
                {/* {room1.typeRoom && (
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
                )} */}
                {room1.typeRoom && (
                  <p>
                    Đơn giá  :
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
                  handleGuestCountChange(
                    room1.id,
                    e.target.value,
                    room1.typeRoom.capacity
                  )
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
                  onClick={() => handleOpenDialog(room1.id)}
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
                onChange={(e) => {
                  setFullname(e.target.value);
                }}
                value={fullname}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                  aria-describedby="basic-addon3 basic-addon4"
                />
              </div>
            </div>
            <p>Số điện thoại</p>
            <div className="input-group mb-3">
              <span className="input-group-text">+84</span>
              <input
                type="text"
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                value={phone}
                className="form-control"
                aria-label="Amount (to the nearest dollar)"
              />
            </div>
          </div>
          <div className={cx("info-order")}>
            <h2>Thông tin đơn hàng </h2>
            <p>Ngày Đặt</p>
            <div
              className="input-group mb-3"
              style={{
                border: "1px solid #ccc",
              }}
            >
              {/* <input
                type="date"
                className="form-control"
                value={formatDate(dayStart)}
                onChange={(e) => handleChoseDay(e)}
              /> */}
              <DatePicker
                selected={dayStart}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div
              className="input-group mb-3"
              style={{
                border: "1px solid #ccc",
              }}
            >
              {/* <input
                type="date"
                value={dayEnd}
                className="form-control"
                onChange={(e) => handleSubPrice(e)}
              /> */}
              <DatePicker
                selected={dayEnd}
                onChange={handleDateChange2}
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <p>Nhận phòng từ : 12:00 CH</p>
            <p>Trả phòng trước : 2:00 CH</p>
            <p>Tiền Phòng </p>
            <input
              type="text"
              className="form-control"
              disabled
              defaultValue={totalPriceRoom ? formatPrice(totalPriceRoom) : null}
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
              defaultValue={deposit ? formatPrice(deposit) : null}
            />
            <br />
            <p>VAT </p>
            <input
              type="text"
              className="form-control"
              disabled
              defaultValue={vat ? formatPrice(vat) : null}
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
              <div>
                {loading && (
                  <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Đặt phòng
                </button>
              </div>
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
        <DialogTitle>Chọn dịch vụ</DialogTitle>
        <DialogContent>
          <BasicTabs></BasicTabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Booking;
