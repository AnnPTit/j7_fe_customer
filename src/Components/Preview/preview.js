import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import Style from "./preview.module.scss";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Slider, Typography } from "@mui/material";
import { DatePicker } from "antd";
import { ToastContainer, toast } from "react-toastify";

const cx = classNames.bind(Style);

function Preview() {
  const { id } = useParams();
  const [room, setRoom] = useState([{}]);
  const [open, setOpen] = useState(false);
  const [typeRoomChose, setTypeRoomChose] = useState("");
  const [data, setData] = useState([]);
  const [selectedDateStart, setSelectedDateStart] = useState(new Date());
  const [selectedDateEnd, setSelectedDateEnd] = useState(new Date());
  const [typeRoom, setTypeRoom] = useState([]);
  const [click, setClick] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [numberCustom, setNumberCustom] = useState("");
  const [children, setChildren] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const price1 = priceRange[0];
  const price2 = priceRange[1];

  // const formatDate = (date) => {
  //   const day = date.getDate().toString().padStart(2, "0");
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0");
  //   const year = date.getFullYear();
  //   return `${year}-${month}-${day}`;
  // };
  // const formattedStartDate = formatDate(selectedDateStart);
  // const formattedEndDate = formatDate(selectedDateEnd);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const payload = {
    roomName: roomName,
    typeRoom: typeRoomChose,
    numberCustom: numberCustom,
    pricePerDays: [price1, price2],
    checkIn: selectedDateStart,
    checkOut: selectedDateEnd,
    children: children,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let Api = `http://localhost:2003/api/home/room/search?current_page=${0}`;
        console.warn(payload);
        const response = await axios.post(Api, payload); // Thay đổi URL API của bạn tại đây
        console.log(response.data.content);
        setData(response.data.content);
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
  }, [click]);

  const handleSearch = () => {
    setClick(!click);
  };

  //Hàm detail
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/room/detail/${id}`
        );
        if (response.data) {
          // setRoom([response.data]);
          const room = {
            capacity: response.data.typeRoom.capacity,
            children: response.data.typeRoom.children,
            id: response.data.id,
            note: response.data.note,
            pricePerDay: response.data.typeRoom.pricePerDay,
            pricePerHours: response.data.typeRoom.pricePerHours,
            roomCode: response.data.roomCode,
            roomName: response.data.roomName,
            typeRoom: response.data.typeRoom.typeRoomName,
            urls: [response.data.photoList[0].url],
          };
          console.log(room);
          setRoom([room]);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [id]);

  // Hàm get loại phòng
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/type-room/getList`
        );
        if (response.data) {
          setTypeRoom(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  const handleChange = (event, newValue) => {
    setPriceRange(newValue);
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND", // Đổi VND thành đơn vị tiền tệ mong muốn (Việt Nam Đồng)
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleRemoveRoom = (id) => {
    if (room.length === 1) {
      toast.error("Không thể xóa !");
    } else {
      const updatedRoom = room.filter((item) => item.id !== id);
      setRoom(updatedRoom);
    }
  };
  const handleAddRoom = (room1) => {
    if (room.length === 3) {
      toast.error("Bạn chỉ được đặt 3 phòng 1 lần !");
      return;
    }
    const isRoomExist = room.some(
      (existingRoom) => existingRoom.id === room1.id
    );
    if (isRoomExist) {
      toast.error("Phòng đã tồn tại");
    } else {
      setRoom((prev) => [...prev, room1]);
    }
  };

  console.log(room);
  const idArray = room.map((roomObj) => roomObj.id);
  const idString = idArray.join("&");
  const url = `/booking/${idString}`;

  return (
    <div className={cx("wrapper")}>
      <ToastContainer />
      <div>
        <button
          className={cx("btn btn-outline-primary")}
          onClick={handleOpenDialog}
          style={{
            float: "right",
            marginRight: 100,
            marginTop: 20,
            width: 150,
          }}
        >
          Thêm Phòng
        </button>
        <br />
        <div
          style={{
            marginTop: 100,
          }}
        >
          {room.map((roomItem) => (
            <div className={cx("room")} key={roomItem.id}>
              <div className={cx("img")}>
                {roomItem && roomItem.urls && roomItem.urls[0] && (
                  <img
                    className={cx("img-item")}
                    src={roomItem.urls[0]}
                    alt="Room"
                  />
                )}
              </div>
              <div className={cx("room-body")}>
                <div className={cx("room-heading")}>
                  <h2 className={cx("room-title")}>{roomItem.roomName}</h2>
                  <p>-</p>
                  {roomItem.typeRoom && (
                    <p className={cx("room-sub-title")}>{roomItem.typeRoom}</p>
                  )}
                </div>
                {roomItem.typeRoom && (
                  <p className={cx("item-capacity")}>
                    {" "}
                    Số Khách :{" "}
                    <span>
                      {roomItem.capacity} <i class="fa fa-user"></i>
                    </span>
                    -
                    <span>
                      {roomItem.children} <i class="fa fa-child"></i>
                    </span>
                  </p>
                )}
                <div className={cx("room-price")}>
                  {/* Đơn giá theo giờ :
                  {roomItem.typeRoom && (
                    <p>
                      {roomItem.pricePerHours.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  )} */}
                  Đơn giá :
                  {roomItem.typeRoom && (
                    <p>
                      {roomItem.pricePerDay.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  )}
                </div>
                <br />
                <p>{roomItem.note}</p>
              </div>
              <button
                className={cx("btn-delete")}
                onClick={() => {
                  handleRemoveRoom(roomItem.id);
                }}
              >
                <i
                  className={cx("fa fa-trash")}
                  style={{
                    fontSize: 30,
                    marginRight: 20,
                    padding: 20,
                    cursor: "pointer",
                  }}
                ></i>
              </button>
            </div>
          ))}
        </div>
        <Link to={url}>
          <button
            type="button"
            className={cx("btn btn-success")}
            style={{
              float: "right",
              marginRight: 100,
              marginTop: 20,
              width: 150,
            }}
          >
            Đặt phòng
          </button>
        </Link>
      </div>
      <br />
      <br />
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
        style={{
          zIndex: 1,
        }}
      >
        <DialogTitle>Thêm Phòng </DialogTitle>
        <DialogContent>
          <div>
            <div className={cx("filter")}>
              <div>
                <input
                  className={cx("input-search")}
                  type="text"
                  placeholder="Tên phòng"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>

              <input
                className={cx("input-search-number")}
                type="number"
                placeholder="Số khách"
                value={numberCustom}
                onChange={(e) => setNumberCustom(e.target.value)}
              />

              
                <input
                  className={cx("input-search-number")}
                  type="number"
                  placeholder="Trẻ em"
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                />
          

              <div>
                <select
                  className={cx("input-search-type")}
                  onChange={(e) => {
                    setTypeRoomChose(e.target.value);
                  }}
                >
                  <option value={""}>Loại phòng</option>
                  {typeRoom.map((type) => (
                    <option key={type.id} value={type.typeRoomCode}>
                      {type.typeRoomName}
                    </option>
                  ))}
                </select>
              </div>
              <div className={cx("price-range")}>
                <Typography id="range-slider" gutterBottom></Typography>
                <Slider
                  value={priceRange}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  min={0}
                  max={5000000}
                />
                <Typography>
                  {`${formatCurrency(priceRange[0])} - ${formatCurrency(
                    priceRange[1]
                  )}`}
                </Typography>
              </div>
            </div>
            <div className={cx("search-date")}>
              <div className={cx("date-picker")}>
                <div
                  className={cx("input-group-date")}
                  style={{
                    marginRight: 10,
                    marginLeft: 10,
                  }}
                >
                  <DatePicker
                    selected={selectedDateStart}
                    onChange={setSelectedDateStart}
                    // dateFormat="dd/MM/yyyy"
                    placeholder="Ngày checkIn"
                    style={{ zIndex: 100000000000000 }} // Chọn giá trị zIndex phù hợp với trang của bạn
                  />
                </div>
                <div className={cx("input-group-date")} style={{}}>
                  <DatePicker
                    selected={selectedDateEnd}
                    onChange={setSelectedDateEnd}
                    // dateFormat="dd/MM/yyyy"
                    placeholder="Ngày checkOut"
                  />
                </div>
              </div>
              <button
                className={cx("search-btn")}
                onClick={() => {
                  handleSearch();
                }}
              >
                Tìm
              </button>
            </div>
            {data.map((room1) => (
              <div key={room1.id} className={cx("room")}>
                <div className={cx("img")}>
                  <img className={cx("img-item")} src={room1.urls[0]} />
                </div>
                <div className={cx("room-body")}>
                  <div className={cx("room-heading")}>
                    <h2 className={cx("room-title-2")}>{room1.roomName}</h2>
                    <p>-</p>
                    {room1.typeRoom && <p> {room1.typeRoom}</p>}
                  </div>
                  {room1.typeRoom && (
                    <p>
                      {" "}
                      Sức chứa : {room1.capacity} | Trẻ em : {room1.children}
                    </p>
                  )}
                  <div className={cx("room-price")}>
                    {/* Đơn giá theo giờ :
                    <p>
                      {" "}
                      {room1.pricePerHours.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p> */}
                    Đơn giá :
                    <p>
                      {room1.pricePerDay.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>

                  <br />
                  <p>{room1.note}</p>
                </div>

                <button
                  type="button"
                  className={cx("btn btn-success ")}
                  onClick={() => {
                    handleAddRoom(room1);
                  }}
                  style={{
                    marginRight: 30,
                    paddingRight: 50,
                    paddingLeft: 50,
                  }}
                >
                  Thêm
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default Preview;
