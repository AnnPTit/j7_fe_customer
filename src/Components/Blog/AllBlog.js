import React, { useEffect, useState } from "react";
import "./BlogHome.css";
import BlogCard from "./BlogCard";

import axios from "axios";

const AllBlog = () => {
  const [items, setIems] = useState([]);
  const fetchDataFromAPI = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2003/api/home/load/blog"
      );
      const data = response.data.content;
      console.log(response);
      setIems(data);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };
  useEffect(() => {
    fetchDataFromAPI(); // Gọi hàm để truy vấn dữ liệu từ API và cập nhật state
  }, []);

  return (
    <>
      <section className="blog top">
        <div className="container">
          <div className="content grid">
            {items.map((item) => {
              return <BlogCard key={item.id} item={item} />;
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default AllBlog;
