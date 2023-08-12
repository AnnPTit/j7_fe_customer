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

const cx = classNames.bind(Style);

function Preview() {
  const { id } = useParams();
  const [room, setRoom] = useState([{}]);
  const [open, setOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [floorChose, setFloorChose] = useState("");
  const [typeRoomChose, setTypeRoomChose] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [dataChange, setDataChange] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const [data, setData] = useState([]);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
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
  // Hàm Get All
  useEffect(() => {
    const fetchData = async () => {
      try {
        let Api = `http://localhost:2003/api/home/room/loadAndSearch?current_page=${pageNumber}&id=${id}`;

        if (textSearch !== "") {
          Api = Api + `&key=${textSearch}`;
        }
        if (floorChose !== "") {
          Api = Api + `&floorId=${floorChose}`;
        }
        if (typeRoomChose !== "") {
          Api = Api + `&typeRoomId=${typeRoomChose}`;
        }
        // console.warn(Api);
        const response = await axios.get(Api); // Thay đổi URL API của bạn tại đây
        console.log(response.data);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
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
  }, [pageNumber, dataChange, textSearch, floorChose, typeRoomChose]);

  const idArray = room.map((roomObj) => roomObj.id);
  const idString = idArray.join("&");
  const url = `/booking/${idString}`;
  return (
    <div className={cx("wrapper")}>
      <button className="btn btn-outline-primary" onClick={handleOpenDialog}>
        Thêm Phòng
      </button>
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
            Tìm kiếm:
            <input
              type="text"
              style={{
                border: "1px solid #ccc",
                height: 20,
              }}
            />
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
                      <p> Đơn giá theo giờ : {room.typeRoom.pricePerHours}</p>
                    )}
                    {room.typeRoom && (
                      <p> Đơn giá theo ngày : {room.typeRoom.pricePerDay}</p>
                    )}
                  </div>
                  <br />
                  <p>{room.note}</p>
                </div>

                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    setRoom((pre) => [...pre, room]);
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
                {roomItem.typeRoom && (
                  <p> Đơn giá theo giờ : {roomItem.typeRoom.pricePerHours}</p>
                )}
                {roomItem.typeRoom && (
                  <p> Đơn giá theo ngày : {roomItem.typeRoom.pricePerDay}</p>
                )}
              </div>
              <br />
              <p>{roomItem.note}</p>
            </div>
          </div>
        ))}

        <Link to={url}>
          <button type="button" className="btn btn-success">
            Đặt phòng
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Preview;
