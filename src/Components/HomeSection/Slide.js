import React, { useState } from "react";
import Data from "./Data";
import axios from "axios";
import { useEffect } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Select } from "antd";
import { InputNumber } from "antd";

const Home = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const [typeRoomChose, setTypeRoomChose] = useState("");
  const [typeRoom, setTypeRoom] = useState([]);
  // const text = `/?search=true&typeRoom=${typeRoomChose}&checkIn=${checkIn}&checkOut=${checkOut}&priceTo=${priceRange[1]}&priceFrom=${priceRange[0]}&numberCustom=${numberCustom}&click=${click}`;
  const [dayStart, setDayStart] = useState(dayjs());
  const [defaultDate, setDefaultDate] = useState(dayjs().add(1, "day"));
  const [numberNight, setNumberNight] = useState(1);
  const [numberRoom, setNumberRoom] = useState(1);
  const [numberCustom, setNumberCustom] = useState(1);
  const [numberChildren, setNumberChidren] = useState(1);
  const formattedDate = dayStart.format("DD-MM-YYYY");
  const formattedDate2 = defaultDate.format("DD-MM-YYYY");
  const today = dayjs();
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
          setTypeRoomChose(response.data[0].typeRoomName);
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
    setDefaultDate(dayStart.add(value, "day"));
    setNumberNight(value);
  };

  const handleChange2 = (value) => {
    console.log(`selected ${value}`);
    setTypeRoomChose(value);
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
  const dArr = [
    { value: 1, label: "1 Ngày" },
    { value: 2, label: "2 Ngày" },
    { value: 3, label: "3 Ngày" },
    { value: 4, label: "4 Ngày" },
    { value: 5, label: "5 Ngày" },
    { value: 6, label: "6 Ngày" },
    { value: 7, label: "7 Ngày" },
    { value: 8, label: "8 Ngày" },
    { value: 9, label: "9 Ngày" },
    { value: 10, label: "10 Ngày" },
    { value: 11, label: "11 Ngày" },
    { value: 12, label: "12 Ngày" },
    { value: 13, label: "13 Ngày" },
    { value: 14, label: "14 Ngày" },
    { value: 15, label: "15 Ngày" },
    { value: 16, label: "16 Ngày" },
    { value: 17, label: "17 Ngày" },
    { value: 18, label: "18 Ngày" },
    { value: 19, label: "19 Ngày" },
    { value: 20, label: "20 Ngày" },
    { value: 21, label: "21 Ngày" },
    { value: 22, label: "22 Ngày" },
    { value: 23, label: "23 Ngày" },
    { value: 24, label: "24 Ngày" },
    { value: 25, label: "25 Ngày" },
    { value: 26, label: "26 Ngày" },
    { value: 27, label: "27 Ngày" },
    { value: 28, label: "28 Ngày" },
    { value: 29, label: "29 Ngày" },
    { value: 30, label: "30 Ngày" },
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
              defaultValue={today}
              selected={dayStart ? dayStart : today}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              disabledDate={disabledDate}
              placeholder="Chọn ngày"
            />
          </div>
          <div className="flex-item">
            <p span>Số Đêm</p>
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
              defaultValue={1}
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
              defaultValue={1}
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
              defaultValue={1}
              onChange={(value) => {
                setNumberChidren(value);
              }}
              style={{
                padding: "5px 10px",
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
          <div className="flex-item">
            <button
              className="btn btn-success btn-custom"
              style={{
                width: 235,
              }}
              onClick={() => handleSearch()}
            >
              Lựa chọn
            </button>
          </div>
        </div>
        <div className="display-flex">
          <div className="flex-item">
            <p>
              {" "}
              Khách đến nhận phòng vào{" "}
              <span className="text-red">14h00 {formattedDate}</span>
            </p>
            <p>
              {" "}
              trả phòng vào{" "}
              <span className="text-red">12h00 {formattedDate2}</span>
            </p>
          </div>
          <div className="flex-item center-item "></div>
        </div>
      </section>
    </>
  );
};
export default Home;
