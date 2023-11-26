import React, { useState } from "react";
import { Link } from "react-router-dom";
import HeadTitle from "../../Common/HeadTitle/HeadTitle";
import "./design.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [recValue, setRecValue] = useState([]);
  const payload = {
    email: email,
    password: password,
  };
  const submitForm = (e) => {
    e.preventDefault();
    const newValue = { email: email, password: password };

    setRecValue([...recValue, newValue]);
    console.log(newValue);

    setEmail("");
    setPassword("");
    const fetchData = async () => {
      try {
        let Api = `http://localhost:2003/api/home/login`;
        // console.warn(Api);
        console.log(payload);
        if (email === "") {
          toast.error("Mật khẩu không được để trống !");
          return;
        }
        if (password === "") {
          toast.error("Mật khẩu không được để trống !");
          return;
        }
        const response = await axios.post(Api, payload); // Thay đổi URL API của bạn tại đây
        console.log(response.data);
        const customer = {
          id: response.data.id,
          fullname: response.data.fullname,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
        };
        // luu thong tin dang nhap len localstorage
        localStorage.setItem("idCustom", JSON.stringify(customer));
        window.location.href = "/cart";
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
          toast.error("Tên đăng nhập hoặc mật khẩu không chính xác !");
        }
      }
    };

    fetchData();
  };
  return (
    <>
      <ToastContainer></ToastContainer>
      <HeadTitle />
      <section className="forms top">
        <div className="container">
          <div className="sign-box">
            <p>
              Enter your e-email and password below to log in to your account
              and use the benefits of our website.
            </p>
            <form action="" onSubmit={submitForm}>
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />

              <div className="flex_space">
                <div className="flex">
                  <input type="checkbox" />
                  <label>Remember Me</label>
                </div>
                <div className="flex">
                  <span>I forgot my password</span>
                </div>
              </div>

              <button type="submit" className="primary-btn">
                Sign In
              </button>
              <p>
                Don't have account? <Link to="/Register">Signup!</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
