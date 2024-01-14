import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./Cart.css";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  IconButton,
  TextareaAutosize,
  DialogTitle,
} from "@mui/material";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CloseIcon from "@mui/icons-material/Close";

function Cart() {
  const [status, setStatus] = useState(1);
  const [books, setBooks] = useState([]);
  const [idChose, setIdChose] = useState({});
  const [noteCancelBooking, setNoteCancelBooking] = useState("");
  const [openRefund, setOpenRefund] = React.useState(false);
  const [typeRoomPhoto, setTypeRoomPhoto] = React.useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isChose, setIsChose] = useState("");

  const handlePreviewClick = (id) => {
    console.log(id);
    setIsChose(id);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "N/A"; // Return a default value when price is not a valid number
    }

    return price
      .toLocaleString({ style: "currency", currency: "VND" })
      .replace(/\D00(?=\D*$)/, "");
  };

  const handleCancelBooking2 = async () => {
    try {
      const response = axios.get(
        `http://localhost:2003/api/home/booking/cancel/${idChose}?reason=${noteCancelBooking}`
      );
      if (response) {
        console.log(response);
        toast.success("Hủy thành công !");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenRefund = () => {
    console.log("okk");
    setOpenRefund(true);
  };
  const handleCloseRefund = () => {
    setOpenRefund(false);
  };

  const formatDate = (createAt) => {
    const createDate = new Date(createAt);

    const day = createDate.getDate().toString().padStart(2, "0");
    const month = (createDate.getMonth() + 1).toString().padStart(2, "0");
    const year = createDate.getFullYear();
    const hours = createDate.getHours().toString().padStart(2, "0");
    const minutes = createDate.getMinutes().toString().padStart(2, "0");
    const seconds = createDate.getSeconds().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    return formatter.format(amount);
  };

  useEffect(() => {
    const storedData = localStorage.getItem("idCustom");
    let customer = null;
    if (storedData) {
      // Nếu dữ liệu tồn tại trong localStorage
      customer = JSON.parse(storedData);
      //   setCustomer(customer);
    } else {
      toast.error("Vui lòng đăng nhập");
      window.location.href = "/sign-in";
    }
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/booking/get-by-status/${status}/${customer.id}`
        );
        if (response.data) {
          setBooks(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    async function fetchData2() {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/booking/get-photo`
        );
        if (response.data) {
          setTypeRoomPhoto(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData2();
  }, [status]);

  const cancel = (id) => {
    setIdChose(id);
    setOpenRefund(true);
    console.log(id);
  };

  return (
    <div className="container">
      <ToastContainer></ToastContainer>

      <Dialog
        open={openRefund}
        onClose={handleCloseRefund}
        fullWidth
        PaperProps={{
          style: {
            maxWidth: "40%",
            maxHeight: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", justifyContent: "center" }}
          id="customized-dialog-title"
        >
          Xác nhận hủy đặt phòng
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseRefund}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[900],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <h6 style={{ marginLeft: 5 }}> Lí do hủy đặt phòng: </h6>
          <TextareaAutosize
            className="form-control"
            placeholder="Lí do hủy đặt phòng"
            name="note"
            cols={80}
            style={{ height: 150 }}
            variant="outlined"
            value={noteCancelBooking}
            onChange={(e) => setNoteCancelBooking(e.target.value)}
          />
          <br />
          <div className="rule">
            <h4 className="rule-heading">Quy định hủy đặt phòng</h4>
            <p className="rule-item">
              - Hủy đặt phòng hoặc thay đổi đặt phòng nên được thông báo{" "}
              <span className="text-red">
                trước 14:00 chiều (UCT + 7 Giờ Việt Nam) hai (02) ngày trước
                ngày nhận phòng
              </span>
              .
            </p>
            <p className="rule-item">
              - Nếu quý khách hủy đặt phòng hoặc thay đổi đặt phòng sau thời
              điểm nói trên, xin lưu ý khách sạn sẽ
              <span className="text-red"> tính phí đêm lưu trú đầu tiên</span>.
            </p>
            <p className="rule-item">
              - Nếu quý khách không đến nhận phòng vào ngày đã đặt, xin lưu ý
              khách sạn sẽ tính booking là ‘Không nhận phòng’ (No-Show) và tính
              phí <span className="text-red"> 100%</span> booking.
            </p>
            <p className="rule-item-small">
              * Một số chương trình khuyến mãi có chính sách hủy đặc biệt. Các
              chương trình khuyến mãi này sẽ tuân theo chính sách hủy được công
              bố trên trang web chính thức của khách sạn.
            </p>
          </div>
          <br />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={handleCloseRefund}
              color="error"
            >
              Đóng
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancelBooking2}
              style={{ marginLeft: 20 }}
            >
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="nav display-flex" style={{ cursor: "pointer" }}>
        <p
          onClick={() => setStatus(1)}
          className={status === 1 ? "active" : ""}
        >
          Đã đặt
        </p>
        <p
          onClick={() => setStatus(2)}
          className={status === 2 ? "active" : ""}
        >
          Đã xếp phòng
        </p>
        <p
          onClick={() => setStatus(5)}
          className={status === 5 ? "active" : ""}
        >
          Yêu cầu hủy
        </p>
        <p
          onClick={() => setStatus(3)}
          className={status === 3 ? "active" : ""}
        >
          Đã Check-In
        </p>
        <p
          onClick={() => setStatus(4)}
          className={status === 4 ? "active" : ""}
        >
          Đã Trả Phòng
        </p>
        <p
          onClick={() => setStatus(6)}
          className={status === 6 ? "active" : ""}
        >
          Đã Hủy
        </p>
        <p
          onClick={() => setStatus(0)}
          className={status === 0 ? "active" : ""}
        >
          Bị từ chối
        </p>
      </div>
      <hr></hr>
      <div className="body-cart">
        {books.map((book) => (
          <div className="display-flex body-item">
            <div className="flex-1">
              {typeRoomPhoto.map(
                (roomPhoto) =>
                  roomPhoto.id === book.typeRoom.id && (
                    <img
                      key={roomPhoto.id}
                      className="img"
                      src={roomPhoto.photoDTOS ? roomPhoto.photoDTOS[0] : ""}
                    />
                  )
              )}
            </div>

            <div className="flex-2">
              <div className=".text-align-left">
                <h3>
                  Đơn đặt phòng : x{book.numberRooms}{" "}
                  {book.typeRoom.typeRoomName}
                  <span
                    style={{
                      fontSize: 15,
                      color: "red",
                      marginLeft: 40,
                    }}
                  >
                    ( {formatCurrency(book.typeRoom.pricePerDay)} )
                  </span>
                </h3>
                <p>
                  <span className="in-dam">Khách hàng </span>: x
                  {book.numberAdults} Người lớn / x{book.numberChildren} Trẻ em
                </p>
                <div className="display-flex-5">
                  <p>
                    <span className="in-dam">Người đặt</span> :{" "}
                    {book.customer.fullname}
                  </p>
                  <p>
                    <span className="in-dam">Email </span>:{" "}
                    {book.customer.email}
                  </p>
                  <p>
                    <span className="in-dam">Ngày đặt</span> :
                    {formatDate(book.createAt)}
                  </p>
                </div>
                <div className="display-flex-5">
                  <p>
                    <span className="in-dam">Số đêm :</span> :{" "}
                    <span className="text-red">{book.numberDays}</span>
                  </p>
                  <p>
                    <span className="in-dam">Đơn giá :</span> :{" "}
                    <span className="text-red">
                      {formatCurrency(book.roomPrice)}
                    </span>
                  </p>
                  <p>
                    <span className="in-dam">Thanh toán (+ VAT 10%) </span>:{" "}
                    <span className="text-red">
                      {formatCurrency(book.totalPrice)}
                    </span>
                  </p>
                </div>

                <div className="display-flex-5">
                  <p>
                    <span className="in-dam">Check - In </span> :{" "}
                    <span className="text-red">
                      {new Date(book.checkInDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                  <p>
                    <span className="in-dam"> Check - Out </span> :{" "}
                    <span className="text-red">
                      {new Date(book.checkOutDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </div>
                {status === 1 ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => cancel(book.id)}
                  >
                    Hủy đặt phòng
                  </button>
                ) : status === 6 ? (
                  <div>
                    <p className="text-green">
                      * Yêu cầu hủy đã được chấp thuận
                    </p>
                    <p>Hình ảnh hoàn trả</p>
                    <Button
                      color="primary"
                      onClick={() => {
                        handlePreviewClick(book.id);
                      }}
                    >
                      Xem hình ảnh
                    </Button>

                    {showPreview && isChose === book.id ? (
                      <div className="image-preview-overlay">
                        <div className="image-preview-container">
                          <img
                            style={{
                              height: "auto",
                              maxWidth: "100%",
                            }}
                            src={book.url}
                            alt="Preview"
                          />
                          <button onClick={handleClosePreview}>Đóng</button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : status === 4 ? (
                  <p className="text-green">* Đã trả phòng</p>
                ) : (
                  <p className="text-red">* Yêu cầu của bạn đang được xử lý</p>
                )}
                <hr />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cart;
