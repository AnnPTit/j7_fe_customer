import { useEffect, useState } from "react";
import axios from "axios";
// import Tippy from "@tippyjs/react";
import classNames from "classnames/bind";
import style from "./Cart.module.scss";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

function Cart() {
  //lấy id custom đăng nhập từ local
  const [idCustom, setIdCustom] = useState("");
  useEffect(() => {
    const storedData = localStorage.getItem("idCustom");
    if (storedData === null) {
      toast.error("Vui lòng đăng nhập");
      setTimeout(function () {
        window.location.href = "/sign-in";
      }, 2000);
    } else if (storedData) {
      const customer = JSON.parse(storedData);
      console.log("22222", customer);
      setIdCustom(customer.id);
    }
  }, []);

  // Nếu dữ liệu tồn tại trong localStorage

  const [data, setData] = useState([]);
  const [odStt, setOdStt] = useState(1);
  const cx = classNames.bind(style);
  // call API để lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        let Api = `http://localhost:2003/api/home/cart/${idCustom}/${odStt}`;
        // console.warn(Api);
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
  }, [idCustom, odStt]);

  function formatDate(dateString) {
    const date = new Date(dateString); // Chuyển đổi chuỗi ngày thành đối tượng Date
    if (!isNaN(date.getTime())) {
      // Kiểm tra xem chuyển đổi thành công hay không
      const day = date.getDate();
      const month = date.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
      const year = date.getFullYear();

      // Định dạng ngày, tháng và năm thành "dd/mm/yyyy"
      return `${padZero(day)}/${padZero(month)}/${year}`;
    } else {
      return dateString; // Trả lại nguyên gốc nếu không thể định dạng
    }
  }

  function padZero(number) {
    return number.toString().padStart(2, "0"); // Thêm số 0 phía trước nếu cần
  }

  let total = 0;
  const groupedData = data.reduce((result, room1) => {
    const orderCode = room1.orderCode;

    if (!result[orderCode]) {
      result[orderCode] = { data: [], totalPrice: 0 };
    }
    result[orderCode].data.push(room1);
    result[orderCode].totalPrice = room1.deposit;
    let start = room1.bookingStart;
    let end = room1.bookingEnd;
    let startDate = new Date(start);
    let endDate = new Date(end);
    let timeDiff = endDate - startDate;
    let daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    total = total + room1.price;
    result[orderCode].total = total * daysDiff;
    console.log(daysDiff);
    return result;
  }, {});

  const groupedArray = Object.values(groupedData);

  console.log(groupedArray);

  const createPaymentMomo = async (code) => {
    try {
      const response = await axios.post(
        `http://localhost:2003/api/payment-method/payment-momo/online/${code}`
      );
      window.location.href = response.data.payUrl;
    } catch (error) {
      console.error("Error creating payment:", error);
    }
    console.log(code);
  };

  const cancelOrder = async (code) => {
    try {
      const response = await axios.post(
        `http://localhost:2003/api/home/order/cancel/${code}/0`
      );
      if (response.data.status === 1) {
        toast.success(response.data.message);
      }
      if (response.data.status === 0) {
        toast.error(response.data.message);
      }
      window.location.href = `/cart`;
    } catch (error) {
      console.error("Error creating payment:", error);
    }
    console.log(code);
  };

  return (
    <>
      <ToastContainer></ToastContainer>
      <div className={cx("header")}>
        <ul className={cx("nav")}>
          <li className={cx("nav-item")}>
            <button
              style={
                odStt === 1
                  ? { color: "white", background: "black", borderRadius: 20 }
                  : null
              }
              className={cx("nav-link")}
              onClick={() => {
                setOdStt(1);
              }}
            >
              Chờ xác nhận
            </button>
          </li>
          <li className={cx("nav-item")}>
            <button
              style={
                odStt === 4
                  ? { color: "white", background: "black", borderRadius: 20 }
                  : null
              }
              className={cx("nav-link")}
              onClick={() => {
                setOdStt(4);
              }}
            >
              Đã xác nhận
            </button>
          </li>
          <li className={cx("nav-item")}>
            <button
              style={
                odStt === 5
                  ? { color: "white", background: "black", borderRadius: 20 }
                  : null
              }
              className={cx("nav-link")}
              onClick={() => {
                setOdStt(5);
              }}
            >
              Chờ check In
            </button>
          </li>
          <li className={cx("nav-item")}>
            <button
              style={
                odStt === 2
                  ? { color: "white", background: "black", borderRadius: 20 }
                  : null
              }
              className={cx("nav-link")}
              onClick={() => {
                setOdStt(2);
              }}
            >
              Đã nhận phòng
            </button>
          </li>
          <li className={cx("nav-item")}>
            <button
              style={
                odStt === 3
                  ? { color: "white", background: "black", borderRadius: 20 }
                  : null
              }
              className={cx("nav-link")}
              onClick={() => {
                setOdStt(3);
              }}
            >
              Đã trả phòng
            </button>
          </li>
          <li className={cx("nav-item")}>
            <button
              style={
                odStt === 0
                  ? { color: "white", background: "black", borderRadius: 20 }
                  : null
              }
              className={cx("nav-link")}
              onClick={() => {
                setOdStt(0);
              }}
            >
              Đã hủy
            </button>
          </li>
          <li className={cx("nav-item")}>
            <button
              style={
                odStt === 8
                  ? { color: "white", background: "black", borderRadius: 20 }
                  : null
              }
              className={cx("nav-link")}
              onClick={() => {
                setOdStt(8);
              }}
            >
              Hết hạn thanh toán
            </button>
          </li>
          <li className={cx("nav-item")}>
            <button
              style={
                odStt === 9
                  ? { color: "white", background: "black", borderRadius: 20 }
                  : null
              }
              className={cx("nav-link")}
              onClick={() => {
                setOdStt(9);
              }}
            >
              Hết hạn checkin
            </button>
          </li>
          <li className={cx("nav-item")}>
            <button
              style={
                odStt === 7
                  ? { color: "white", background: "black", borderRadius: 20 }
                  : null
              }
              className={cx("nav-link")}
              onClick={() => {
                setOdStt(7);
              }}
            >
              Hết hạn
            </button>
          </li>
          <li className={cx("nav-item")}>
            <button
              style={
                odStt === 6
                  ? { color: "white", background: "black", borderRadius: 20 }
                  : null
              }
              className={cx("nav-link")}
              onClick={() => {
                setOdStt(6);
              }}
            >
              Bị từ chối
            </button>
          </li>
        </ul>
      </div>
      <div className={cx("wrapper")}>
        {data.length === 0 ? (
          <div className={cx("no-data")}>
            <img
              src="https://cdn4.iconfinder.com/data/icons/music-ui-solid-24px/24/cross_delete_remove_close-2-256.png"
              alt="no data"
            />
            <h2 className={cx("no-data-tile")}> Không có dữ liệu </h2>
          </div>
        ) : (
          groupedArray.map((arr) => (
            <div
              className={cx("group-order")}
              onClick={() => {
                // const ids = [];
                // for (let index = 0; index < arr.data.length; index++) {
                //   const element = arr.data[index];
                //   let id = element.roomId;
                //   ids.push(id);
                // }
                // let resultString = ids[0];
                // if (ids.length >= 2) {
                //   resultString = ids.join("&");
                // }
                // console.log(resultString);
                // let url = `http://localhost:3001/booking/${resultString}`;
                // window.location.href = url;
                console.log(arr);
              }}
            >
              <div className={cx("order-title")}>
                <h2 className={cx("order-name")}>
                  {arr.data[0].orderCode} - {"Tiền cọc : "}
                  {arr.totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                  {/* {"-"}
                  {arr.total.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })} */}
                </h2>

                {arr.data[0].orderStatus === 4 ? (
                  <button
                    style={{
                      borderRadius: 10,
                      backgroundColor: "#b84d84",
                      width: 200,
                    }}
                    className="btn btn-primary"
                    onClick={() => createPaymentMomo(arr.data[0].orderCode)}
                  >
                    Thanh Toán MOMO
                  </button>
                ) : arr.data[0].orderStatus === 1 ? (
                  <button
                    style={{
                      borderRadius: 10,
                      width: 200,
                    }}
                    className="btn btn-primary"
                    // onClick={() => cancelOrder(arr.data[0].orderCode)}
                    onClick={() => {
                      Swal.fire({
                        title: "Bạn có chắc chắn muốn hủy ? ",
                        text: "",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, Add it!",
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          const isSubmitSuccess = await cancelOrder(
                            arr.data[0].orderCode
                          );
                          if (isSubmitSuccess) {
                            Swal.fire("Hủy thành công !", "success");
                            toast.success("Hủy Thành Công !");
                          }
                        }
                      });
                    }}
                  >
                    Hủy Đặt Phòng
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
              {arr.data.map((room1) => (
                <div key={room1.id} className={cx("room")}>
                  <div className={cx("img")}>
                    {room1.url && (
                      <img
                        className={cx("img-item")}
                        src={room1.url}
                        alt="Room"
                      />
                    )}
                  </div>
                  <div className={cx("room-body")}>
                    <div className={cx("room-heading")}>
                      <h2 className={cx("room-title")}>{room1.roomName}</h2>
                      <p>-</p>
                      <span className={cx("type-room")}>
                        {room1.typeRoom && <p> {room1.typeRoom}</p>}
                      </span>
                    </div>
                    {room1.typeRoom && (
                      <p>
                        Sức chứa :
                        <span className={cx("capacity")}>
                          <i class="fa fa-user"></i> {room1.capacity}
                        </span>
                        <span className={cx("capacity")}>
                          <i class="fa fa-child"></i>
                          {room1.children}
                        </span>
                      </p>
                    )}
                    {room1.typeRoom && (
                      <p>
                        Số khách :
                        <span className={cx("capacity")}>
                          <i class="fa fa-user"></i> {room1.numberCustom}
                        </span>
                      </p>
                    )}
                    <br />
                    <div className={cx("room-price")}>
                      {room1.typeRoom && (
                        <p>
                          Đơn giá :
                          <span
                            style={{
                              color: "red",
                            }}
                          >
                            {room1.price.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND", // Loại tiền tệ Việt Nam (VND)
                            })}
                          </span>
                        </p>
                      )}
                      {room1.typeRoom && (
                        <p>
                          CheckIn :
                          <span
                            style={{
                              color: "red",
                            }}
                          >
                            {formatDate(room1.bookingStart)}
                          </span>
                        </p>
                      )}
                      {room1.typeRoom && (
                        <p>
                          CheckOut :
                          <span
                            style={{
                              color: "red",
                            }}
                          >
                            {formatDate(room1.bookingEnd)}
                          </span>
                        </p>
                      )}
                      {room1.typeRoom && (
                        <p>
                          Ngày đặt :
                          <span
                            style={{
                              color: "red",
                            }}
                          >
                            {formatDate(room1.bookingDay)}
                          </span>
                        </p>
                      )}
                    </div>
                    <br />
                    {room1.refuseReason && (
                      <p>Lí do từ chối : {room1.refuseReason}</p>
                    )}
                  </div>

                  <div className={cx("service-item")}>
                    {room1.orderStatus === 1 &&
                    new Date(room1.bookingStart) > new Date() ? (
                      <input
                        style={{
                          backgroundColor: "#95c4e0",
                          borderRadius: 50,
                          textAlign: "center",
                          lineHeight: 0.2,
                          color: "white",
                        }}
                        value={"Chờ xác nhận"}
                        disabled={true}
                      />
                    ) : room1.orderStatus === 4 ? (
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <input
                          style={{
                            backgroundColor: "green",
                            borderRadius: 50,
                            textAlign: "center",
                            lineHeight: 0.2,
                            color: "white",
                          }}
                          value={"Đã xác nhận"}
                          disabled={true}
                        />
                      </div>
                    ) : room1.orderStatus === 5 ? (
                      <input
                        style={{
                          backgroundColor: "#95c4e0",
                          borderRadius: 50,
                          textAlign: "center",
                          lineHeight: 0.2,
                          color: "white",
                        }}
                        value={"Chờ check in"}
                        disabled={true}
                      />
                    ) : room1.orderStatus === 2 ? (
                      <input
                        style={{
                          backgroundColor: "green",
                          borderRadius: 50,
                          textAlign: "center",
                          lineHeight: 0.2,
                          color: "white",
                        }}
                        value={"Đã nhận phòng"}
                        disabled={true}
                      />
                    ) : room1.orderStatus === 3 ? (
                      <input
                        style={{
                          backgroundColor: "#95c4e0",
                          borderRadius: 50,
                          textAlign: "center",
                          lineHeight: 0.2,
                          color: "white",
                        }}
                        value={"Đã trả phòng"}
                        disabled={true}
                      />
                    ) : room1.orderStatus === 0 ? (
                      <input
                        style={{
                          backgroundColor: "#95c4e0",
                          borderRadius: 50,
                          textAlign: "center",
                          lineHeight: 0.2,
                          color: "white",
                        }}
                        value={"Đã hủy"}
                        disabled={true}
                      /> ? (
                        odStt === 6
                      ) : (
                        <input
                          style={{
                            backgroundColor: "red",
                            borderRadius: 50,
                            textAlign: "center",
                            lineHeight: 0.2,
                            color: "white",
                          }}
                          value={"Bị từ chối"}
                          disabled={true}
                        />
                      )
                    ) : (
                      <input
                        style={{
                          backgroundColor: "red",
                          borderRadius: 50,
                          textAlign: "center",
                          lineHeight: 0.2,
                          color: "white",
                        }}
                        value={"Hết hạn"}
                        disabled={true}
                      />
                    )}
                    {room1.orderStatus === 1 &&
                    new Date(room1.bookingStart) > new Date() ? (
                      <button onClick={() => {}}></button>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div
                    style={{
                      width: 50,
                    }}
                  ></div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Cart;
