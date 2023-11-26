import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BlogData from "../BlogData";
import EmptyFile from "../../../Common/Empty/EmptyFile";
import HeadTitle from "../../../Common/HeadTitle/HeadTitle";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogSingle = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

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

  useEffect(() => {
    let item = items.find((item) => item.id === id);
    if (item) {
      setItem(item);
    }
  }, [id, items]);
  return (
    <>
      <HeadTitle />

      {item ? (
        <section className="single-page top">
          <div className="container">
            <Link to="/blog" className="primary-btn back">
              <i className="fas fa-long-arrow-alt-left"></i> Go Back
            </Link>

            {/* --------- main-content--------- */}

            <article className="content flex_space">
              <div className="main-content">
                <img src={item.photoDTOS[0]} alt="" />

                <div className="category flex_space">
                  <span>{item.createAt}</span>
                  <label>{item.createBy}</label>
                </div>

                <h1> {item.title} </h1>
                <p>{item.content}</p>
                <p>{item.content}</p>

                <h2>Two Column Text Sample</h2>

                <div className="para flex_space">
                  <p>{item.countLike}</p>
                  <p>{item.countView}</p>
                </div>
              </div>
              {/* --------- main-content--------- */}

              {/* --------- side-content--------- */}
              <div className="side-content">
                <div className="category-list">
                  <h1>Categories</h1>
                  <hr />
                  <ul>
                    {BlogData.map((item) => {
                      return (
                        <li key={item.index}>
                          <i className="far fa-play-circle"></i>
                          {item.catgeory}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* --------- side-content--------- */}
            </article>
          </div>
        </section>
      ) : (
        <EmptyFile />
      )}
    </>
  );
};

export default BlogSingle;
