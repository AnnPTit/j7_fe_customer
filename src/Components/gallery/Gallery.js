import React, { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import styled from "@emotion/styled";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Gallery.css";
import Cards from "./Cards";
import MyPagination from "./index";
import PriceRangeSlider from "../HomeSection/PriceRangeSlider/PriceRangeSlider";

const cx = classNames.bind(styled);

function Gallery() {
  const [pageNumber, setPageNumber] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [love, setLove] = useState(false);
  const [typeRoom, setTypeRoom] = useState([]);
  const [facility, setFacility] = useState([]);
  const [typeRoomChose, setTypeRoomChose] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [roomname, setRoomname] = useState();
  const [children, setChildren] = useState(0);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState(0);
  const [isCrease, setIsCrease] = useState(null);
  const [isCreaseBook, setIsCreaseBook] = useState(null);

  const handleCheckboxChange = (type) => {
    // Kiểm tra xem type có trong mảng selectedFacilities chưa
    const isSelected = selectedFacilities.includes(type);

    // Nếu đã chọn, loại bỏ khỏi mảng, ngược lại thì thêm vào mảng
    if (isSelected) {
      setSelectedFacilities(
        selectedFacilities.filter((facility) => facility !== type)
      );
    } else {
      setSelectedFacilities([...selectedFacilities, type]);
    }
  };
  useEffect(() => {
    handleSubmit();
  }, [pageNumber]);

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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/load/facility`
        );
        if (response.data) {
          setFacility(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const handleSubmit = () => {
    const payload = {
      roomname,
      typeRoomChose,
      selectedFacilities,
      priceRange,
      selectedChildren,
      currentPage: pageNumber,
      isCrease,
      isCreaseBook,
    };
    console.log(payload);
    async function fetchData() {
      try {
        const response = await axios.post(
          `http://localhost:2003/api/home/search/facility`,
          payload
        );
        if (response.data) {
          setRooms(response.data.content);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  };
  console.log("ROOM", rooms);
  return (
    <section className="gallery top">
      <div
        style={{
          display: "flex",
        }}
      >
        <div className="search-container">
          <div className="input-container">
            <label htmlFor="roomName">Tên phòng:</label>
            <input
              className="form-control"
              type="text"
              id="roomName"
              onChange={(e) => {
                setRoomname(e.target.value);
              }}
              placeholder="Nhập tên phòng"
              value={roomname}
            />
          </div>

          <div className="input-container">
            <label htmlFor="typeRoom">Loại phòng:</label>
            <select
              className="form-control select"
              id="typeRoom"
              onChange={(e) => {
                setTypeRoomChose(e.target.value);
              }}
            >
              <option className="option" value={""}>
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

          <div className="input-container">
            <label htmlFor="priceRange">Giá tiền:</label>
            <PriceRangeSlider
              className="price-range-slider"
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          <div className="input-container">
            <label>Tiện ích:</label>
            {facility.map((type) => (
              <div key={type.id} className="checkbox-container">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedFacilities.includes(type)}
                  onChange={() => handleCheckboxChange(type)}
                />
                <label className="form-check-label">{type.facilityName}</label>
              </div>
            ))}
          </div>

          <div className="input-container">
            <label htmlFor="selectedChildren">Trẻ em:</label>
            <select
              className="form-control"
              id="selectedChildren"
              value={selectedChildren}
              onChange={(e) => {
                setSelectedChildren(e.target.value);
              }}
            >
              {[0, 1, 2, 3, 4].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="input-container">
            <label htmlFor="isCrease">Sắp xếp theo:</label>
            <select
              className="form-control"
              id="isCrease"
              value={isCrease}
              onChange={(e) => {
                setIsCrease(e.target.value);
                setIsCreaseBook(null);
              }}
            >
              <option value={true}>Đơn giá tăng dần</option>
              <option value={false}>Đơn giá giảm dần</option>
            </select>
          </div>

          <div className="input-container">
            <label htmlFor="isCreaseBook">Sắp xếp theo:</label>
            <select
              className="form-control"
              id="isCreaseBook"
              value={isCreaseBook}
              onChange={(e) => {
                setIsCreaseBook(e.target.value);
                setIsCrease(null);
              }}
            >
              <option value={false}>Số lượng đặt giảm dần </option>
              <option value={true}>Số lượng đặt tăng dần</option>
            </select>
          </div>

          <button className="btn btn-primary" onClick={handleSubmit}>
            Tìm kiếm
          </button>
        </div>

        <div className="container grid">
          {rooms.map((room) => (
            <Cards key={room.index} room={room} />
          ))}
        </div>
      </div>
      <MyPagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        setPageNumber={handlePageChange}
      />
    </section>
  );
}

export default Gallery;
