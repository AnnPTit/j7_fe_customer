import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import style from "./Cards.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MyPagination from "../MyPagination/MyPagination";
const cx = classNames.bind(style);
const Cards2 = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [data, setData] = useState([]);

  const currentURL = window.location.href;
  // Tạo một đối tượng URLSearchParams từ URL
  const urlSearchParams = new URLSearchParams(currentURL);
  // Lấy giá trị của các tham số từ đối tượng URLSearchParams
  const typeRoom = urlSearchParams.get("typeRoom");
  const checkIn = urlSearchParams.get("checkIn");
  const checkOut = urlSearchParams.get("checkOut");
  const priceTo = urlSearchParams.get("priceTo");
  const priceFrom = urlSearchParams.get("priceFrom");
  const numberCustom = urlSearchParams.get("numberCustom");
  const click = urlSearchParams.get("click");
  console.log("typeRoom:", typeRoom);
  console.log("checkIn:", checkIn);
  console.log("checkOut:", checkOut);
  console.log("priceTo:", priceTo);
  console.log("priceFrom:", priceFrom);
  console.log("numberCustom:", numberCustom);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const payload = {
    typeRoom: typeRoom,
    numberCustom: numberCustom,
    pricePerDays: [priceFrom, priceTo],
    checkIn: checkIn,
    checkOut: checkOut,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let Api = `http://localhost:2003/api/home/room/top?total_page=5&current_page=${pageNumber}`;
        // console.warn(Api);
        const response = await axios.get(Api); // Thay đổi URL API của bạn tại đây

        console.log("Toprooom", response.data);
        setTotalPages(response.data.totalPages);
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
  }, [pageNumber]);

  return (
    <>
      <div className={cx("image")}>
        {data.map((value) => {
          const detailUrl = `/detail/${value.id}`; // Tạo đường dẫn chi tiết với ID của value
          return (
            <div key={value.id} className="cards">
              <div className="item">
                <div className="imgae">
                  <Link to={detailUrl}>
                    <img
                      className={cx("image-item")}
                      src={value.urls?.[0] ?? ""}
                      alt=""
                    />
                  </Link>
                </div>
                {/* <div className="rate">
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="far fa-star"></i>
                  <i className="far fa-star"></i>
                </div> */}
                <br></br>
                <div className="details">
                  <h2>{value.roomName}</h2>
                  <i
                    // <i class="fa-solid fa-people-roof"></i>
                    className="fas fa-map-marker-alt"
                    style={{
                      color: "red",
                    }}
                  ></i>
                  <label>{value.typeRoom}</label>
                  <br />
                  <span
                    style={{
                      marginRight: 5,
                    }}
                  >
                    {value.capacity}
                  </span>
                  <i className="fa fa-user"></i>
                  <span
                    style={{
                      marginRight: 5,
                      marginLeft: 5,
                    }}
                  >
                    {value.children}
                  </span>
                  <i className="fa fa-child"></i>
                  <h3>
                    {value && (
                      <span
                        style={{
                          color: "red",
                          fontWeight: 700,
                        }}
                      >
                        {value.pricePerDay?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    )}
                  </h3>
                  Số lượt đặt: <t />
                  {value && (
                    <span
                      style={{
                        color: "red",
                        fontWeight: 700,
                      }}
                    >
                      {value.countBook}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={cx("pagination")}>
        <MyPagination
          pageNumber={pageNumber}
          totalPages={totalPages}
          setPageNumber={setPageNumber}
        />
      </div>
    </>
  );
};

export default Cards2;
