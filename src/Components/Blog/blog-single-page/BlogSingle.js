import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BlogData from "../BlogData";
import EmptyFile from "../../../Common/Empty/EmptyFile";
import HeadTitle from "../../../Common/HeadTitle/HeadTitle";
import { useParams } from "react-router-dom";
import axios from "axios";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import { ToastContainer, toast } from "react-toastify";
var stompClient = null;
const sendMessage = (message) => {
  stompClient.send("/app/likes", {}, message);
};

const sendComment = (message) => {
  stompClient.send("/app/comments", {}, message);
};
const BlogSingle = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [like, setLike] = useState(0);
  const [comment, setComment] = useState([]);
  const [isLike, setIsLike] = useState(true);
  const [custom, setCustom] = useState(null);
  const [conentComment, setConentComment] = useState("");
  const [current, setCurrent] = useState(0);

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
      setLike(item.countLike);
    }
  }, [id, items]);

  function formatDate(inputDate) {
    const formattedDate = new Date(inputDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formattedDate;
  }
  const formatDate2 = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );

    return formattedDate;
  };

  const connect = () => {
    const ws = new SockJS(`http://localhost:2003/ws`);
    stompClient = Stomp.over(ws);
    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/like", (data) => {
        const status = data.body;
        setLike(status);
      });

      stompClient.subscribe("/topic/comment", (data) => {
        const status2 = data.body;
        console.log(status2);
        setComment(JSON.parse(status2));
      });
    });
  };

  const handleLike = () => {
    // lay id khach hang
    setIsLike(!isLike);
    const storedData = localStorage.getItem("idCustom");
    if (storedData) {
      const customer = JSON.parse(storedData);
      setCustom(customer);
    }
    const payload = {
      customerId: custom !== null ? custom.id : null,
      blogId: id,
      islike: isLike,
    };
    sendMessage(JSON.stringify(payload));
  };

  const handleComment = () => {
    // lay id khach hang
    const storedData = localStorage.getItem("idCustom");
    if (storedData) {
      const customer = JSON.parse(storedData);
      const payload = {
        username: customer !== null ? customer.fullname : "user",
        idBlog: id,
        isCreate: true,
        content: conentComment,
      };
      sendComment(JSON.stringify(payload));
      setConentComment("");
    } else {
      toast.info("Vui lòng đăng nhập !");
    }
  };

  const loadComment = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2003/api/home/blog/comment?blogId=${id}&&currentPage=${current}`
      );

      if (response) {
        const data = response.data;
        console.log(data);
        setComment(data);
      } else {
        console.error("Response or content is undefined.");
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  const setCountView = () => {
    try {
      const viewRes = axios.get(
        `http://localhost:2003/api/home/view?blogId=${id}`
      );
      // setView(viewRes);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Xử lý khi nhấn phím Enter ở đây
      e.preventDefault(); // Ngăn chặn việc thực hiện line break trong input
      handleComment();
    }
  };

  useEffect(() => {
    connect();
    setCountView();
    loadComment();
  }, [id]);
  return (
    <>
      <ToastContainer></ToastContainer>
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
                {item.photoDTOS && item.photoDTOS.length > 0 && (
                  <img src={item.photoDTOS[0]} alt="" />
                )}

                <div className="category flex_space">
                  <span>{formatDate(item.createAt)}</span>
                  <label>{item.createBy}</label>
                </div>
                <div className="para">
                  {/* <p>
                    <i class="fa fa-thumbs-up"></i>
                    <span> {like}</span>
                  </p> */}
                  <p>
                    <i class="fa fa-eye"></i>
                    <span> {item.countView}</span>
                  </p>
                </div>
                <h1> {item.title} </h1>
                <p>{item.content}</p>
                <p>{item.content}</p>
                <div className="para flex_space">
                  {/* <button
                    style={{
                      padding: 10,
                      paddingRight: 40,
                      paddingLeft: 40,
                      borderRadius: 20,
                      fontSize: 24,
                    }}
                    onClick={handleLike}
                  >
                    <i class="fa fa-thumbs-up"></i>
                  </button> */}
                  <input
                    type="text"
                    placeholder="Bình luận"
                    value={conentComment}
                    style={{
                      background: "#ccc",
                    }}
                    onChange={(e) => setConentComment(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                </div>
                <div className="para">
                  {comment.map((commentItem, id) => (
                    <div key={id} className="commentItem">
                      <p>
                        {" "}
                        {commentItem.username} : {commentItem.content}{" "}
                        {formatDate2(commentItem.createdAt)}
                      </p>
                    </div>
                  ))}
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
