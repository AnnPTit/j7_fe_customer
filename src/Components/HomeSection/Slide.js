import React, { useState } from "react";
import Data from "./Data";
import axios from "axios";
import style from "./Slide.module.scss";
import classNames from "classnames/bind";
import PriceRangeSlider from "./PriceRangeSlider/PriceRangeSlider";
import { useEffect } from "react";
import { Link } from "react-router-dom";

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
  const today = new Date().toISOString().split("T")[0];
  const text = `/?search=true&typeRoom=${typeRoomChose}&checkIn=${checkIn}&checkOut=${checkOut}&priceTo=${priceRange[1]}&priceFrom=${priceRange[0]}&numberCustom=${numberCustom}&click=${click}`;

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const initialDate = `${year}-${month}-${day}`;
    setCheckIn(initialDate);
    setCheckOut(initialDate);
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
        <div className="container">
          <h2>ARMANI Hotel - Nơi an nghỉ lí tưởng của bạn</h2>
          <span> Tìm kiếm phòng </span>

          <form>
            <div>
              <select
                className={cx("select")}
                onChange={(e) => {
                  setTypeRoomChose(e.target.value);
                }}
              >
                <option className={cx("option")} value={""}>
                  Loại phòng
                </option>
                {typeRoom.map((type) => (
                  <option
                    key={type.id}
                    value={type.typeRoomCode}
                    style={{
                      lineHeight: 100,
                    }}
                  >
                    {type.typeRoomName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex_space">
              <input
                className={cx("home-input")}
                type="date"
                value={checkIn}
                placeholder="Check In"
                onChange={(e) => {
                  setCheckIn(e.target.value);
                }}
              />
              <input
                className={cx("home-input")}
                type="date"
                value={checkOut}
                placeholder="Check Out"
                onChange={(e) => {
                  setCheckOut(e.target.value);
                }}
              />
            </div>
            <div className="flex_space"></div>

            <div className={cx("slider")}>
              <div className={cx("slider-item")}>
                <span>Khoảng giá :</span>
                <PriceRangeSlider
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              </div>
              <input
                className={cx("home-input")}
                type="number"
                placeholder="Số khách"
                value={numberCustom}
                onChange={(e) => {
                  setNumberCustom(e.target.value);
                }}
              />
            </div>
            <div className={cx("btn-search")}>
              <Link
                to={text}
                onClick={() => {
                  setClick(!click);
                }}
              >
                Search
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
export default Home;
