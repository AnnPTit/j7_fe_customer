import React, { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import styled from "@emotion/styled";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Gallery.css";
import Cards from "./Cards";
import MyPagination from "./index";

const cx = classNames.bind(styled);

function Gallery() {
  const [pageNumber, setPageNumber] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [love, setLove] = useState(false);


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/room/load?current_page=${pageNumber}`
        );
        console.log(response.data);
        if (response.data) {
          setRooms(response.data.content);
          setTotalPages(response.data.totalPages);
          console.log("Rooms", response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pageNumber]);

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  return (
    <section className="gallery top">
      <div className="container grid">
        {rooms.map((room) => (
          <Cards key={room.index} room={room}  />
        ))}
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
