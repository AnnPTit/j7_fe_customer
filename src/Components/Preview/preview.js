import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import Style from "./preview.module.scss";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Slider, Typography } from "@mui/material";
import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import dayjs from "dayjs";
import { type } from "@testing-library/user-event/dist/type";

const cx = classNames.bind(Style);

function Preview() {
  const { id } = useParams();
  const [room, setRoom] = useState([{}]);
  const [open, setOpen] = useState(false);
  const [typeRoomChose, setTypeRoomChose] = useState("");
  const [dataChange, setDataChange] = useState(false);
  const [data, setData] = useState([]);
  const [selectedDateStart, setSelectedDateStart] = useState(new Date());
  const [selectedDateEnd, setselectedDateEnd] = useState(new Date());
  const [typeRoom, setTypeRoom] = useState([]);

  const [roomName, setRoomName] = useState("");
  const [numberCustom, setNumberCustom] = useState(1);
  // const [typeRoomName, setTypeRoomName] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000000]);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleSearch = () => {
    const price1 = priceRange[0];
    const price2 = priceRange[1];
    const formattedStartDate = formatDate(selectedDateStart);
    const formattedEndDate = formatDate(selectedDateEnd);

    // Hàm tìm kiếm
    const fetchData = async () => {
      try {
        let Api = `http://localhost:2003/api/home/get-room-filter?capacity=${numberCustom}`;

        if (roomName !== "") {
          Api = Api + `&roomName=${roomName}`;
        }
        if (typeRoomChose !== "") {
          Api = Api + `&typeRoomCode=${typeRoomChose}`;
        }
        if (price1 !== "") {
          Api = Api + `&startPrice=${price1}`;
        }
        if (price2 !== "") {
          Api = Api + `&endPrice=${price2}`;
        }
        if (formattedStartDate !== "") {
          Api = Api + `&dayStart=${formattedStartDate}`;
        }
        if (formattedEndDate !== "") {
          Api = Api + `&dayEnd=${formattedEndDate}`;
        }
        console.warn(Api);
        const response = await axios.get(Api); // Thay đổi URL API của bạn tại đây
        console.log(response.data);
        setData(response.data);
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
  };

  //Hàm detail
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/room/detail/${id}`
        );
        if (response.data) {
          setRoom([response.data]);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

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

  const idArray = room.map((roomObj) => roomObj.id);
  const idString = idArray.join("&");
  const url = `/booking/${idString}`;

  return (
    <div className={cx("wrapper")}>
      <button
        className={cx("btn btn-outline-primary")}
        onClick={handleOpenDialog}
        style={{
          float: "right",
          marginLeft: 40,
          marginTop: 40,
          marginRight: 40,
        }}
      >
        Thêm Phòng
      </button>
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
      >
        <DialogTitle>Thêm Phòng </DialogTitle>
        <DialogContent>
          <div>
            <div className={cx("filter")}>
              <div>
                Tên Phòng :
                <input
                  className={cx("input-search")}
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>
              <div>
                Số khách :
                <br />
                <input
                  className={cx("input-search-number")}
                  type="number"
                  value={numberCustom}
                  onChange={(e) => setNumberCustom(e.target.value)}
                />
              </div>
              <div>
                Loại phòng :
                <br />
                <select
                  className={cx("input-search-type")}
                  onChange={(e) => {
                    setTypeRoomChose(e.target.value);
                  }}
                >
                  {typeRoom.map((type) => (
                    <option key={type.id} value={type.typeRoomCode}>
                      {type.typeRoomName}
                    </option>
                  ))}
                </select>
              </div>
              <div className={cx("price-range")}>
                <Typography id="range-slider" gutterBottom>
                  Khoảng giá :
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  min={0}
                  max={5000000}
                />
                <Typography>{`${formatCurrency(
                  priceRange[0]
                )} - ${formatCurrency(priceRange[1])}`}</Typography>
              </div>
            </div>
            <div className={cx("search-date")}>
              <div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DateTimePicker
                    style={{
                      marginRight: 40,
                      marginLeft: 10,
                    }}
                    value={selectedDateStart}
                    disablePast
                    onChange={setSelectedDateStart}
                    label="Checkin"
                    showTodayButton
                  />

                  <DateTimePicker
                    value={selectedDateEnd}
                    disablePast
                    onChange={setselectedDateEnd}
                    label="Checkout"
                    showTodayButton
                  />
                </MuiPickersUtilsProvider>
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
            {data.map((room) => (
              <div key={room.id} className={cx("room")}>
                <div className={cx("img")}>
                  {room.photoList && (
                    <img
                      className={cx("img-item")}
                      src={room.photoList[0].url}
                    />
                  )}
                </div>
                <div className={cx("room-body")}>
                  <div className={cx("room-heading")}>
                    <h2 className={cx("room-title")}>{room.roomName}</h2>
                    <p>-</p>
                    {room.typeRoom && <p> {room.typeRoom.typeRoomName}</p>}
                  </div>
                  {room.typeRoom && <p> Số Khách : {room.typeRoom.capacity}</p>}

                  <div className={cx("room-price")}>
                    {room.typeRoom && (
                      <p>
                        {" "}
                        Đơn giá theo giờ :{" "}
                        {room.typeRoom.pricePerHours.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    )}
                    {room.typeRoom && (
                      <p>
                        {" "}
                        Đơn giá theo ngày :{" "}
                        {room.typeRoom.pricePerDay.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    )}
                  </div>

                  <br />
                  <p>{room.note}</p>
                </div>

                <button
                  type="button"
                  className={cx("btn btn-success ")}
                  onClick={() => {
                    setRoom((pre) => [...pre, room]);
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
      <div>
        {room.map((roomItem) => (
          <div className={cx("room")} key={roomItem.id}>
            <div className={cx("img")}>
              {roomItem.photoList && (
                <img
                  className={cx("img-item")}
                  src={roomItem.photoList[0].url}
                  alt="Room"
                />
              )}
            </div>
            <div className={cx("room-body")}>
              <div className={cx("room-heading")}>
                <h2 className={cx("room-title")}>{roomItem.roomName}</h2>
                <p>-</p>
                {roomItem.typeRoom && <p> {roomItem.typeRoom.typeRoomName}</p>}
              </div>
              {roomItem.typeRoom && (
                <p> Số Khách : {roomItem.typeRoom.capacity}</p>
              )}

              <div className={cx("room-price")}>
                Đơn giá theo giờ :
                {roomItem.typeRoom && (
                  <p>
                    {roomItem.typeRoom.pricePerHours.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                )}
                Đơn giá theo ngày :
                {roomItem.typeRoom && (
                  <p>
                    {roomItem.typeRoom.pricePerDay.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                )}
              </div>

              <br />
              <p>{roomItem.note}</p>
            </div>
          </div>
        ))}
        <Link to={url}>
          <button
            type="button"
            className="btn btn-success"
            style={{
              position: "relative",
              left: 1750,
            }}
          >
            Đặt phòng
          </button>
        </Link>
      </div>
    </div>
  );
}
export default Preview;
