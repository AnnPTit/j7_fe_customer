import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "./Cart.css";

function Cart() {
  const [status, setStatus] = useState(1);
  const [books, setBooks] = useState([]);
  //   const [customer, setCustomer] = useState();

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
  }, [status]);

  const cancel = (id) => {
    try {
      const response = axios.get(
        `http://localhost:2003/api/home/booking/cancel/${id}`
      );
      if (response) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <ToastContainer></ToastContainer>
      <div className="nav display-flex">
        <p
          onClick={() => setStatus(1)}
          className={status === 1 ? "active" : ""}
        >
          Đã đặt
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
              <img
                className="img"
                src="https://th.bing.com/th/id/R.6a56319455b67d0d6c7e8eee6ddcc695?rik=3%2fOjuEYJyGxpHA&pid=ImgRaw&r=0"
              />
            </div>

            <div className="flex-2">
              <div className=".text-align-left">
                <h3>
                  Đơn đặt hàng : x{book.numberRooms}{" "}
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
                {status === 1 ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => cancel(book.id)}
                  >
                    Hủy đặt phòng
                  </button>
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
