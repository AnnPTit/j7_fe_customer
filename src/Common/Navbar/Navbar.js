import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Tippy from "@tippyjs/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Logo } from "../../Components/logo";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [customer, setCustomer] = useState({});

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  useEffect(() => {
    const storedData = localStorage.getItem("idCustom");

    if (storedData) {
      // Nếu dữ liệu tồn tại trong localStorage
      const customer = JSON.parse(storedData);
      setCustomer(customer);
    }
  }, []);
  const handleSignOut = () => {
    localStorage.removeItem("idCustom"); // Xóa dữ liệu từ Local Storage
    setCustomer({}); // Cập nhật customer thành một object rỗng
  };

  return (
    <>
      <nav className="navbar">
        <div className="container flex_space">
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : " fas fa-bars"}></i>
          </div>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li
              style={{
                width: 100,
              }}
            >
              <div onClick={()=>{
               window.location.href="http://localhost:3001/"
              }}>
              <Logo ></Logo>
              </div>
            </li>
            <li>
              <Link to="/" onClick={closeMobileMenu}>
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={closeMobileMenu}>
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link to="/gallery" onClick={closeMobileMenu}>
                Phòng
              </Link>
            </li>
            <li>
              <Link to="/favourite" onClick={closeMobileMenu}>
                Yêu thích
              </Link>
            </li>
            {/* <li>
              <Link to="/destinations" onClick={closeMobileMenu}>
                Điểm đến
              </Link>
            </li> */}
            <li>
              <Link to="/blog" onClick={closeMobileMenu}>
                Bài viết
              </Link>
            </li>
            <li>
              <Link to="/testimonial" onClick={closeMobileMenu}>
                Đội ngũ phát triển
              </Link>
            </li>
            {/* <li>
              <Link to="/contact" onClick={closeMobileMenu}>
                Contact Us
              </Link>
            </li> */}
          </ul>

          <div className="login-area flex">
            {Object.keys(customer).length > 0 ? (
              <li>
                <Link
                  to="/sign-in"
                  onClick={() => {
                    handleSignOut();
                  }}
                >
                  <i className="far fa-chevron-right"></i>Đăng xuất
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/sign-in">
                  <i className="far fa-chevron-right"></i>Đăng nhập
                </Link>
              </li>
            )}
            {Object.keys(customer).length > 0 ? (
              <li>
                <Link to="/profile">
                  <i className="far fa-chevron-right"></i>Trang cá nhân
                </Link>
                <Link to="/change">
                  <i className="far fa-chevron-right"></i>Đổi mật khẩu
                </Link>
              </li>
            ) : (
              <div></div>
            )}
            {/* <select class="form-select" aria-label="Default select example">
              <option selected>Quản lý tài khoản</option>
              <option>Thông tin cá nhân</option>
              <option>Đăng ký</option>
              <option>Đăng nhập</option>
              <option>Đăng xuất</option>
            </select> */}

            <li>
              <Tippy interactive={true} interactiveBorder={20} delay={100}>
                <Link to="/cart">
                  <i
                    class="fa fa-cart-plus"
                    style={{
                      fontSize: 20,
                    }}
                  ></i>
                </Link>
              </Tippy>
            </li>
          </div>
        </div>
      </nav>

      {/* <header>
        <div className="container flex_space">
          <div className="logo">
            <img src="images/logo.png" alt="" />
          </div>

          <div className="contact flex_space ">
            <div className="box flex_space">
              <div className="icons">
                <i className="fal fa-clock"></i>
              </div>
              <div className="text">
                <h4>Working Hours</h4>
                <Link to="/contact">Monday - Sunday: 9.00am to 6.00pm</Link>
              </div>
            </div>
            <div className="box flex_space">
              <div className="icons">
                <i className="fas fa-phone-volume"></i>
              </div>
              <div className="text">
                <h4>Call Us</h4>
                <Link to="/contact">+011 123 4567</Link>
              </div>
            </div>
            <div className="box flex_space">
              <div className="icons">
                <i className="far fa-envelope"></i>
              </div>
              <div className="text">
                <h4>Mail Us</h4>
                <Link to="/contact">info@exampal.com</Link>
              </div>
            </div>
          </div>
        </div>
      </header> */}
    </>
  );
};

export default Navbar;
