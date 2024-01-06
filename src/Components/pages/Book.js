import "./Book.css";
// import "../HomeSection/Home.css";
import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Select } from "antd";
// import { InputNumber } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Input } from "antd";

const Book = () => {
  const [typeRoomChose, setTypeRoomChose] = useState("");
  const [typeRoom, setTypeRoom] = useState([]);
  // const text = `/?search=true&typeRoom=${typeRoomChose}&checkIn=${checkIn}&checkOut=${checkOut}&priceTo=${priceRange[1]}&priceFrom=${priceRange[0]}&numberCustom=${numberCustom}&click=${click}`;
  const [dayStart, setDayStart] = useState(dayjs());
  const [defaultDate, setDefaultDate] = useState(dayjs().add(1, "day"));
  const [numberNight, setNumberNight] = useState(1);
  const [numberRoom, setNumberRoom] = useState(1);
  const [numberCustom, setNumberCustom] = useState(1);
  const [numberChildren, setNumberChidren] = useState(1);
  const [typeRoomDetail, setTypeRoomDetail] = useState({});
  const [fullName, setFullName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [email, setEmail] = useState();
  const [payment, setPayment] = useState(0);

  const [text, setText] = useState(
    "Số phòng : 0 , Số người lớn 0 , Số trẻ em : 0"
  );
  const formattedDate = dayStart.format("DD-MM-YYYY");
  const formattedDate2 = defaultDate.format("DD-MM-YYYY");
  const today = dayjs();
  useEffect(() => {
    var currentUrl = window.location.href;
    // window.location=`/book/${formattedDate}/${formattedDate2}/${numberNight}/${numberRoom}/${numberCustom}/${numberChildren}/${typeRoomChose}`

    // Tách thông tin từ đường dẫn
    var urlParts = currentUrl.split("/");
    var startDate = urlParts[4];
    var endDate = urlParts[5];
    var night = urlParts[6];
    var room = urlParts[7];
    var custom = urlParts[8];
    var children = urlParts[9];
    var typeRoom = urlParts.slice(10);

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Other Info:", night);
    console.log("rôm :", room);
    console.log("cus:", custom);
    console.log("chil:", children);
    console.log("tyoe:", decodeURIComponent(typeRoom));

    // Set
    const startDateObj = dayjs(startDate, "DD-MM-YYYY");
    const endDateObj = dayjs(endDate, "DD-MM-YYYY");
    console.log(endDateObj);
    setDayStart(startDateObj);
    setDefaultDate(endDateObj);
    setNumberNight(night);
    setNumberRoom(room);
    setNumberCustom(custom);
    setNumberChidren(children);
    var text = `Số phòng : ${room} , Số người lớn  ${custom} , Số trẻ em :  ${children}`;
    setText(text);
    setTypeRoomChose(decodeURIComponent(typeRoom));

    // Check login

    const storedData = localStorage.getItem("idCustom");

    if (storedData) {
      // Nếu dữ liệu tồn tại trong localStorage
      const customer = JSON.parse(storedData);
      setFullName(customer.fullname);
      setPhoneNumber(customer.phoneNumber);
      setEmail(customer.email);
    }
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
          console.log(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/type-room/getByName?name=${decodeURIComponent(
            typeRoomChose
          )}`
        );
        if (response.data) {
          console.log("11111", response.data);
          setTypeRoomDetail(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [typeRoomChose]);

  function disabledDate(current) {
    return current && current < dayjs().endOf("day");
  }
  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setDefaultDate(dayStart.add(value, "day"));
    setNumberNight(value);
  };

  const handleChange2 = (value) => {
    console.log(`selected ${value}`);
    setTypeRoomChose(value);

    try {
      const response = axios.get(
        `http://localhost:2003/api/home/type-room/getByName?name=${decodeURIComponent(
          typeRoomChose
        )}`
      );
      if (response.data) {
        console.log("11111", response.data);
        setTypeRoomDetail(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = (selectedDate) => {
    setNumberNight(1);
    setDefaultDate(dayStart.add(2, "day"));
    const selectedDateTime = new Date(selectedDate);
    const currentDate = new Date();
    const thirtyDaysLater = new Date(currentDate);
    thirtyDaysLater.setDate(currentDate.getDate() + 30);

    if (
      selectedDateTime >= currentDate &&
      selectedDateTime <= thirtyDaysLater
    ) {
      console.log("Ngày hợp lệ");
      const dayjsSelectedDateTime = dayjs(selectedDateTime);
      setDayStart(dayjsSelectedDateTime);
    } else {
      console.log("Vui lòng chọn ngày trong vòng 30 ngày trong tương lai");
    }
  };
  const handleSearch = () => {
    console.log(formattedDate);
    console.log(formattedDate2);
    console.log(numberNight);
    console.log(numberRoom);
    console.log(numberCustom);
    console.log(numberChildren);
    console.log(typeRoomChose);
    window.location = `/book/${formattedDate}/${formattedDate2}/${numberNight}/${numberRoom}/${numberCustom}/${numberChildren}/${typeRoomChose}`;
  };

  function caculateRoomPrice() {
    let originalPrice = typeRoomDetail.pricePerDay;
    let totalPrice = originalPrice * numberNight;
    return totalPrice;
  }

  function formatCurrency(value) {
    let currencyFormatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return currencyFormatter.format(value);
  }
  function caculateVAT(value) {
    let vat = value * 0.1;
    let currencyFormatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return currencyFormatter.format(vat);
  }

  function caculatePayment(value) {
    let total = value * 0.1 + value;
    let currencyFormatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    // setPayment(total);
    return currencyFormatter.format(total);
  }

  const handleFullNameChange = (event) => {
    const { value } = event.target;
    setFullName(value);
  };
  const handlePhoneChange = (event) => {
    const { value } = event.target;
    setPhoneNumber(value);
  };
  const handleEmailChange = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  const createPayment = async () => {
    console.log("hell");
    let total =
      (typeRoomDetail.pricePerDay * 0.1 + typeRoomDetail.pricePerDay) *
      numberNight;
    try {
      const response = await axios.post(
        `http://localhost:2003/api/payment-method/payment-vnpay`,
        {
          amount: total,
        }
      );
      const { finalUrl } = response.data;
      window.location.href = finalUrl;
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const dArr = [
    { value: 1, label: "1 Đêm" },
    { value: 2, label: "2 Đêm" },
    { value: 3, label: "3 Đêm" },
    { value: 4, label: "4 Đêm" },
    { value: 5, label: "5 Đêm" },
    { value: 6, label: "6 Đêm" },
    { value: 7, label: "7 Đêm" },
    { value: 8, label: "8 Đêm" },
    { value: 9, label: "9 Đêm" },
    { value: 10, label: "10 Đêm" },
    { value: 11, label: "11 Đêm" },
    { value: 12, label: "12 Đêm" },
    { value: 13, label: "13 Đêm" },
    { value: 14, label: "14 Đêm" },
    { value: 15, label: "15 Đêm" },
    { value: 16, label: "16 Đêm" },
    { value: 17, label: "17 Đêm" },
    { value: 18, label: "18 Đêm" },
    { value: 19, label: "19 Đêm" },
    { value: 20, label: "20 Đêm" },
    { value: 21, label: "21 Đêm" },
    { value: 22, label: "22 Đêm" },
    { value: 23, label: "23 Đêm" },
    { value: 24, label: "24 Đêm" },
    { value: 25, label: "25 Đêm" },
    { value: 26, label: "26 Đêm" },
    { value: 27, label: "27 Đêm" },
    { value: 28, label: "28 Đêm" },
    { value: 29, label: "29 Đêm" },
    { value: 30, label: "30 Đêm" },
  ];
  return (
    <>
      <div className="container-book">
        <div className="side-left">
          <h2>Đặt phòng khách sạn</h2>
          <p>Điền thông tin người đặt phòng vào bên dưới</p>
          <section className="slide-form-1">
            <div className="display-flex">
              <div className="flex-item">
                <p>Ngày nhận phòng</p>
                <DatePicker
                  style={{
                    width: "80%",
                    padding: "10px",
                  }}
                  value={dayStart ? dayStart : today}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  disabledDate={disabledDate}
                  placeholder="Chọn ngày"
                />
              </div>
              <div className="flex-item">
                <p span>Số đêm</p>
                <Select
                  value={numberNight}
                  style={{ width: "80%", height: "52%" }}
                  size={"middle"}
                  onChange={handleChange}
                  options={dArr}
                />
              </div>
              <div className="flex-item">
                <p>Ngày trả phòng</p>
                <DatePicker
                  style={{
                    width: "80%",
                    padding: "10px",
                  }}
                  value={defaultDate ? defaultDate : null}
                  placeholder="Chọn ngày"
                  disabled={true}
                />
              </div>
            </div>
            <div className="display-flex">
              <div className="flex-item">
                <p
                  style={{
                    width: "200%",
                  }}
                >
                  Số phòng , Số người lớn , Số trẻ em
                </p>
                <Input
                  value={text}
                  disabled={true}
                  style={{
                    padding: "9px 10px",
                    fontSize: 14,
                    width: "360%",
                  }}
                />
              </div>
              <div className="flex-item"></div>
              <div className="flex-item"></div>
              <div className="flex-item">
                <p></p>
              </div>
              <div className="flex-item">
                <p>Loại phòng</p>
                <Select
                  value={typeRoomChose}
                  style={{ width: "160%", height: "52%" }}
                  size={"middle"}
                  onChange={handleChange2}
                >
                  {typeRoom.map((option) => (
                    <Select.Option key={option.id} value={option.typeRoomName}>
                      {option.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="flex-item">
                <p></p>
              </div>
            </div>
            <div className="display-flex">
              <div className="flex-item">
                {/* <button className="btn btn-success">Lựa chọn</button> */}
              </div>
              <div className="flex-item center-item ">
                {/* <button className="btn btn-success">Lựa chọn 2</button> */}
              </div>
              <div className="flex-item"></div>
            </div>
            <div className="display-flex">
              <div className="flex-item"></div>
              <div className="flex-item center-item "></div>
            </div>
          </section>
          <hr />
          <div className="user-info">
            <h2>Thông tin người đặt hàng</h2>
            <br />
            <p>Tên người liên hệ</p>
            <Input
              size="large"
              placeholder="Họ và tên"
              value={fullName ? fullName : null}
              onChange={handleFullNameChange}
              prefix={<UserOutlined />}
            />
            <div className="display-flex-1">
              <div className="flex-item-1">
                <p>Số điện thoại</p>
                <Input
                  size="large"
                  value={phoneNumber ? phoneNumber : null}
                  onChange={handlePhoneChange}
                  placeholder="số điện thoại"
                  prefix={<UserOutlined />}
                />
              </div>
              <div className="flex-item-1">
                <p>Email</p>
                <Input
                  size="large"
                  value={email ? email : null}
                  onChange={handleEmailChange}
                  placeholder="Email"
                  prefix={<UserOutlined />}
                />
              </div>
              <div className="flex-item-1"></div>
            </div>
          </div>
        </div>
        <div className="side-right">
          <h2>Armani Hotel</h2>
          <br />
          <br />
          <p>
            Khách đến nhận phòng vào{" "}
            <span className="text-red">14h00 {formattedDate}</span>
          </p>
          <p>
            trả phòng vào{" "}
            <span className="text-red">12h00 {formattedDate2}</span>
          </p>
          <br></br>
          <div className="type-room">
            <p>
              x{numberRoom} {typeRoomChose}
            </p>
            <div className="display-flex-1">
              <div className="flex-item-1">
                <img
                  className="type-room-img"
                  src="https://studiochupanhdep.com/Upload/Newsimages/phong-khach-san-tt-studio.jpg"
                />
              </div>
              <div className="flex-item-1">
                <ul className="facility">
                  <li>Wifi</li>
                  <br></br>
                  <li>Tắm nóng lạnh</li>
                </ul>
              </div>
            </div>
            <p> Thanh toán trực tiếp</p>
          </div>
          <p>Chi tiết giá</p>
          <p>
            Thanh toán :{" "}
            <span className="text-red">
              {caculatePayment(caculateRoomPrice())}
            </span>{" "}
          </p>
          <p>
            Tiền phòng :{" "}
            <span className="text-red">
              {formatCurrency(caculateRoomPrice())}
            </span>{" "}
          </p>
          <p>
            Thuế ( 10 % VAT) :
            <span className="text-red">{caculateVAT(caculateRoomPrice())}</span>{" "}
          </p>
          <p>
            Phí phục vụ :{" "}
            <span
              style={{
                fontWeight: 700,
              }}
            >
              MIỄN PHÍ
            </span>{" "}
          </p>
          <button className="btn btn-outline-success" onClick={createPayment}>
            Thanh Toán{" "}
          </button>
        </div>
      </div>
    </>
  );
};
export default Book;
