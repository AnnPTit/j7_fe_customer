import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import style from "./Cards.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const cx = classNames.bind(style);
const Cards = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [floorChose, setFloorChose] = useState("");
  const [typeRoomChose, setTypeRoomChose] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [dataChange, setDataChange] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let Api = `http://localhost:2003/api/home/room/loadAndSearch1?current_page=${pageNumber}`;

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
                      src={`${value.photoList[0].url}`}
                      alt=""
                    />
                    <i className="fas fa-map-marker-alt">
                      <label>{value.typeRoom.typeRoomName}</label>
                    </i>
                  </Link>
                </div>
                <div className="rate">
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="far fa-star"></i>
                  <i className="far fa-star"></i>
                </div>
                <div className="details">
                  <h2>{value.roomName}</h2>
                  <div className="boarder"> {value.note}</div>
                  <h3>
                    {value.typeRoom.pricePerDay} / <span>Per Day</span>
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Cards;
