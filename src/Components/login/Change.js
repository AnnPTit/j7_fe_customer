import React, { useState } from "react";
import HeadTitle from "../../Common/HeadTitle/HeadTitle";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./design.css";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu mới
    if (newPassword === currentPassword) {
      toast.error("Mật khẩu mới không được trùng với mật khẩu hiện tại!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    if (confirmNewPassword !== newPassword) {
      toast.error("Mật khẩu mới không trùng khớp!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    setLoading(true);

    try {
      const idCustom = localStorage.getItem("idCustom");
      const idCustomObject = JSON.parse(idCustom);
      const userId = idCustom ? idCustomObject.id : null;
      const changePasswordData = {
        password: newPassword,
      };
      console.log(idCustom);
      console.log(idCustom.id);

      // Gọi API để thay đổi mật khẩu
      const response = await axios.put(
        `http://localhost:2003/api/home/changePassWord/${userId}`,
        changePasswordData
      );
      console.log(response);

      if (response.status === 200) {
        console.log("API call successful");
        toast.success("Mật khẩu đã được thay đổi thành công!");
        window.location.href = "/sign-in";
      } else {
        console.log("API call failed");
        toast.error("Đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin!");
      }
    } catch (error) {
      console.error("API call failed:", error);
      toast.error("Có lỗi xảy ra trong quá trình thay đổi mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeadTitle title="Change Password" />
      <section className="forms top">
        <ToastContainer />
        <div className="container">
          <div className="sign-box">
            <h3>Thay đổi mật khẩu của bạn tại đây!</h3>
            <form action="" onSubmit={submitForm}>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mật khẩu mới"
                required
              />
              <input
                type="password"
                name="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Xác nhận lại mật"
                required
              />

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Vui lòng chờ trong giây lát..." : "Đổi mật khẩu"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChangePassword;
