import React, { useEffect, useState } from "react";
import "./BlogHome.css";
import BlogCard from "./BlogCard";
import MyPagination from "./index";
import axios from "axios";

const AllBlog = () => {
  const [items, setIems] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/load/blog?current_page=${pageNumber}`
        );
        console.log(response.data);
        if (response.data) {
          setTotalPages(response.data.totalPages);
          setIems(response.data.content);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pageNumber]);

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
        <MyPagination
          pageNumber={pageNumber}
          totalPages={totalPages}
          setPageNumber={setPageNumber}
        />
      </section>
    </>
  );
};

export default AllBlog;
