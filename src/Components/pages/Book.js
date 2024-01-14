import "./Book.css";
// import "../HomeSection/Home.css";
import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";
import { Select } from "antd";

import { UserOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

const Book = () => {
  const [typeRoomChose, setTypeRoomChose] = useState();
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
  const [note, setNote] = useState();
  const [accountNumber, setAccountNumber] = useState();
  const [banks, setBanks] = useState([]);
  const [bankChose, setBankChose] = useState(17);
  const [numberRoomCanbeBook, setNumberRoomCanbeBook] = useState(0);
  const { TextArea } = Input;
  const { Option } = Select;
  const formattedDate = dayStart.format("DD-MM-YYYY");
  const formattedDate2 = defaultDate.format("DD-MM-YYYY");
  const today = dayjs();
  //------------------------------------------------------------------------------

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
    setNumberRoom(room);
    setNumberCustom(custom);
    setNumberChidren(children);
    setTypeRoomChose(decodeURIComponent(typeRoom));

    // Check loginF
    const storedData = localStorage.getItem("idCustom");
    if (storedData) {
      // Nếu dữ liệu tồn tại trong localStorage
      const customer = JSON.parse(storedData);
      setFullName(customer.fullname);
      setPhoneNumber(customer.phoneNumber);
      setEmail(customer.email);
    }
  }, []);

  //GET ngan hang
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`https://api.vietqr.io/v2/banks`);
        if (response.data) {
          setBanks(response.data.data);
          console.log(response.data);
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
    // checkRoomBook(value, dayStart, defaultDate);

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
    let totalPrice = originalPrice * numberNight * numberRoom;
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
    let total =
      (typeRoomDetail.pricePerDay * 0.1 + typeRoomDetail.pricePerDay) *
      numberNight;
    let bankRoomName = banks.find((value) => value.id === bankChose);
    let price = typeRoomDetail.pricePerDay * numberNight;

    Swal.fire({
      title: "Bạn chắc chắn đã đọc điều khoản và muốn đặt phòng ? ",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Tôi đã đọc ! Thanh Toán Ngay",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `http://localhost:2003/api/payment-method/payment-vnpay`,
            {
              amount: total,
              roomPrice: price,
              email: email,
              checkIn: dayStart.format("YYYY-MM-DD"), // Format the date as needed
              checkOut: defaultDate.format("YYYY-MM-DD"),
              numberNight: numberNight,
              numberRoom: numberRoom,
              numberCustomer: numberCustom,
              numberChildren: numberChildren,
              typeRoomChose: typeRoomChose,
              note: note,
              fullName: fullName,
              phoneNumber: phoneNumber,
              accountNumber: accountNumber,
              bankChose: bankRoomName.name,
            }
          );

          const { finalUrl } = response.data;
          window.location.href = finalUrl;
        } catch (error) {
          console.error("Error creating payment:", error);
          toast.error(error.response.data);
        }
      }
    });
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
  const options = banks.map((bank) => (
    <Option key={bank.id} value={bank.id}>
      {bank.name}
    </Option>
  ));

  useEffect(() => {
    async function checkRoomBook() {
      let api = `http://localhost:2003/api/home/booking/check-room`;
      console.warn(api);
      try {
        const response = await axios.post(api, {
          checkIn: dayStart.format("YYYY-MM-DD"), // Format the date as needed
          checkOut: defaultDate.format("YYYY-MM-DD"),
          typeRoomChose: typeRoomChose,
        });
        if (response) {
          setNumberRoomCanbeBook(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    checkRoomBook();
  }, [typeRoomChose, dayStart, defaultDate]);
  return (
    <>
      <ToastContainer></ToastContainer>
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
                <p>Số phòng</p>
                <InputNumber
                  min={1}
                  max={10}
                  value={numberRoom}
                  onChange={(value) => {
                    setNumberRoom(value);
                  }}
                  style={{
                    padding: "5px 10px",
                    fontSize: 14,
                  }}
                />
              </div>
              <div className="flex-item">
                <p span>Số người lớn </p>
                <InputNumber
                  min={1}
                  max={5}
                  value={numberCustom}
                  onChange={(value) => {
                    setNumberCustom(value);
                  }}
                  style={{
                    padding: "5px 10px",
                    fontSize: 14,
                  }}
                />
              </div>
              <div className="flex-item">
                <p>Số trẻ em</p>
                <InputNumber
                  min={1}
                  max={5}
                  value={numberChildren}
                  onChange={(value) => {
                    setNumberChidren(value);
                  }}
                  style={{
                    padding: "5px 10px",
                    fontSize: 14,
                  }}
                />
              </div>
              <div className="flex-item"></div>
              <div className="flex-item"></div>
              <div className="flex-item"></div>
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
              <div className="flex-item"></div>
            </div>
            <div className="display-flex">
              <div className="flex-item">
                <p>Ghi chú</p>
                <TextArea
                  onChange={(value) => setNote(value.target.value)}
                  rows={4}
                />
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
            <div className="display-flex-1">
              <div className="flex-item">
                <p>
                  Số tài khoản{" "}
                  <span className="rule-item-small text-red">
                    (*Vui lòng cung cấp số tài khoản để khách sạn hoàn tiền
                    trong trường hợp bạn hủy phòng)
                  </span>
                </p>
                <Input
                  size="large"
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                  }}
                  placeholder="Số tài khoản"
                  prefix={<UserOutlined />}
                />
              </div>
              <div className="flex-item-1"></div>
            </div>
            <div className="display-flex-1">
              <div className="flex-item">
                <p>Ngân hàng</p>
                <Select
                  showSearch
                  value={bankChose}
                  style={{ width: "100%", height: "52%" }}
                  size={"middle"}
                  onChange={(e) => {
                    setBankChose(e);
                  }}
                  optionFilterProp="children" // Specify which property of option will be used for filter
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {options}
                </Select>
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
              <span className="text-red">x{numberRoom}</span> {typeRoomChose}
            </p>
            <p>
              Số phòng có thể đặt :{" "}
              <span className="text-red"> {numberRoomCanbeBook}</span>
            </p>
            <div className="display-flex-1">
              <div className="flex-item-1">
                <img
                  className="type-room-img"
                  src={
                    typeRoomDetail.photoDTOS ? typeRoomDetail.photoDTOS[0] : ""
                  }
                />
              </div>
              <div className="flex-item-1">
                <ul className="facility">
                  <li>Wifi</li>
                  <br></br>
                  <li>Tắm nóng lạnh</li>
                </ul>
              </div>
              <div className="flex-item-1"></div>
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
        </div>
      </div>
    </>
  );
};
export default Book;
