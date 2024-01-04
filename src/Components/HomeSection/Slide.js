import React, { useState } from "react";
import Data from "./Data";
import axios from "axios";
import style from "./Slide.module.scss";
import classNames from "classnames/bind";
import PriceRangeSlider from "./PriceRangeSlider/PriceRangeSlider";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Select, Space } from "antd";
import moment from "moment";
import { InputNumber } from "antd";

const cx = classNames.bind(style);
const Home = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [typeRoomChose, setTypeRoomChose] = useState("");
  const [checkIn, setCheckIn] = useState();
  const [checkOut, setCheckOut] = useState();
  const [typeRoom, setTypeRoom] = useState([]);
  const [numberCustom, setNumberCustom] = useState(0);
  const [click, setClick] = useState(false);
  const text = `/?search=true&typeRoom=${typeRoomChose}&checkIn=${checkIn}&checkOut=${checkOut}&priceTo=${priceRange[1]}&priceFrom=${priceRange[0]}&numberCustom=${numberCustom}&click=${click}`;
  const [dayStart, setDayStart] = useState(moment());

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const initialDate = `${year}-${month}-${day}`;
    setCheckIn(initialDate);
    setCheckOut(initialDate);
    setDayStart(initialDate);
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

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  function disabledDate(current) {
    return current && current < dayjs().endOf("day");
  }
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const handleDateChange = (selectedDate) => {
    // Chuyển đổi ngày chọn thành đối tượng Date
    const selectedDateTime = new Date(selectedDate);

    // Lấy ngày hiện tại
    const currentDate = new Date();

    // Tính toán ngày trong vòng 30 ngày tính từ ngày hiện tại
    const thirtyDaysLater = new Date(currentDate);
    thirtyDaysLater.setDate(currentDate.getDate() + 30);

    // So sánh ngày chọn với khoảng thời gian 30 ngày trong tương lai
    if (
      selectedDateTime >= currentDate &&
      selectedDateTime <= thirtyDaysLater
    ) {
      console.log("Ngày hợp lệ");
      setDayStart(selectedDateTime);
    } else {
      console.log("Vui lòng chọn ngày trong vòng 30 ngày trong tương lai");
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
      <section className="slider">
        <div className="control-btn">
          <button className="prev" onClick={prevSlide}>
            <i className="fas fa-caret-left"></i>
          </button>
          <button className="next" onClick={nextSlide}>
            <i className="fas fa-caret-right"></i>
          </button>
        </div>

        {Data.map((slide, index) => {
          return (
            <div
              className={index === current ? "slide active" : "slide"}
              key={index}
            >
              {index === current && <img src={slide.image} alt="Home Image" />}
            </div>
          );
        })}
      </section>
      <section className="slide-form">
        <div className="display-flex">
          <div className="flex-item">
            <p>Ngày nhận phòng</p>
            <DatePicker
              style={{
                width: "80%",
                padding: "10px",
              }}
              selected={dayStart}
              onChange={handleDateChange}
              startDate={dayStart} // Đặt giá trị mặc định cho DatePicker
              dateFormat="dd/MM/yyyy"
              disabledDate={disabledDate}
              placeholder="Chọn ngày"
            />
          </div>
          <div className="flex-item">
            <p span>Số đêm</p>
            <Select
              defaultValue={1}
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
              selected={dayStart ? dayStart : null}
              onChange={handleDateChange}
              // dateFormat="dd/MM/yyyy"
              disabledDate={disabledDate}
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
              defaultValue={1}
              onChange={() => {}}
              style={{
                padding: "5px 0",
                fontSize: 14,
              }}
            />
          </div>
          <div className="flex-item">
            <p span>Số người lớn </p>
            <InputNumber
              min={1}
              max={5}
              defaultValue={1}
              onChange={() => {}}
              style={{
                padding: "5px 0",
                fontSize: 14,
              }}
            />
          </div>
          <div className="flex-item">
            <p>Số trẻ em</p>
            <InputNumber
              min={1}
              max={5}
              defaultValue={1}
              onChange={() => {}}
              style={{
                padding: "5px 0",
                fontSize: 14,
              }}
            />
          </div>
          <div className="flex-item">
            <p></p>
          </div>
          <div className="flex-item">
            <p>Loại phòng</p>
            <Select
              defaultValue={1}
              style={{ width: "100%", height: "52%" }}
              size={"middle"}
              onChange={handleChange}
              options={dArr}
            />
          </div>
          <div className="flex-item">
            <p></p>
            {/* <br />
            <button className="btn btn-success">Lựa chọn</button> */}
          </div>
        </div>
        <div className="display-flex">
          <div className="flex-item">
            {/* <button className="btn btn-success">Lựa chọn</button> */}
          </div>
          <div className="flex-item center-item ">
            {/* <button className="btn btn-success">Lựa chọn 2</button> */}
          </div>
          <div className="flex-item">
            <button className="btn btn-success">Lựa chọn</button>
          </div>
        </div>
        <div className="display-flex">
          <div className="flex-item">
            <p>
              {" "}
              Khách đến nhận phòng vào{" "}
              <span className="text-red">12h00 {dayStart + ""}</span>
            </p>
            <p>
              {" "}
              và trả phòng vào{" "}
              <span className="text-red">12h00 {dayStart + ""}</span>
            </p>
          </div>
          <div className="flex-item center-item "></div>
        </div>
      </section>
    </>
  );
};
export default Home;
