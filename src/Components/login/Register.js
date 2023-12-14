import React, { useState } from "react";
import HeadTitle from "../../Common/HeadTitle/HeadTitle";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./design.css";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [recValue, setRecValue] = useState([]);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  const submitForm = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu và xác nhận mật khẩu

    if (cpassword !== password) {
      toast.error("Mật khẩu không trùng khớp!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error("Mật khẩu không trùng khớp!");
      // Xử lý khi mật khẩu và xác nhận mật khẩu không khớp, có thể hiển thị thông báo cho người dùng
      return;
    }

    setLoading(true);

    try {
      const newValue = {
        fullname: fullname,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
      };
      console.log("Payload: " + newValue);

      // Gọi API để lưu thông tin người dùng mới
      const response = await axios.post(
        "http://localhost:2003/api/home/customer/save",
        newValue
      );

      console.log(response);

      if (response.status === 200) {
        console.log("API call successful");
        // Chuyển hướng sau khi đăng ký thành công
        window.location.href = "/sign-in";
      } else {
        console.log("API call failed");
        // Xử lý khi API gặp lỗi, có thể hiển thị thông báo cho người dùng
      }
    } catch (error) {
      console.error("API call failed:", error);
      // Xử lý khi có lỗi xảy ra trong quá trình gọi API, có thể hiển thị thông báo cho người dùng
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeadTitle />
      <section className="forms top">
        <ToastContainer />
        <div className="container">
          <div className="sign-box">
            <p>Bạn chưa có tài khoản? Hãy tạo cho mình một tài khoản mới!</p>
            <form action="" onSubmit={submitForm}>
              <input
                type="text"
                name="name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Họ và tên"
                required
              />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Số điện thoại"
                required
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                required
              />
              <input
                type="password"
                name="cpassword"
                value={cpassword}
                onChange={(e) => setCpassword(e.target.value)}
                placeholder="Xác nhận mật khẩu"
                required
              />

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Creating Account..." : "Create an Account"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
