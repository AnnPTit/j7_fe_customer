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
  const [favouriteRooms, setFavouriteRooms] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const idCustom = localStorage.getItem("idCustom");
  const idCustomObject = JSON.parse(idCustom);
  const userId = idCustom ? idCustomObject.id : null;

  useEffect(() => {
    async function fetchData() {
      try {
        if (userId) {
          const response = await axios.get(
            `http://localhost:2003/api/home/load/favourite/${userId}?current_page=${pageNumber}`
     
          );
          console.log(response.data);
          if (response.data && response.data.content) {
            setFavouriteRooms(response.data.content);
            setTotalPages(response.data.totalPages);
            console.log("Favourite Rooms", response.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [userId, pageNumber]);

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  return (
    <section className="gallery top">
      <div className="container grid">
        {favouriteRooms.map((room) => (
          <Cards key={room.roomId} room={room} />
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
