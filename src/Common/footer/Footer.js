import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="container grid">
          <div className="box">
            <h2>ARMANI HOTEL</h2>
            <p>EMAIL : anptph27230@fpt.edu.vn</p>
            <p>PHONE : 0389718892 </p>
            <p>ADDRESS : Trinh van bo - ha noi</p>
            <div className="icon flex_space">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-linkedin"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-pinterest"></i>
              <i className="fab fa-youtube"></i>
            </div>
          </div>

          <div className="box">
            <h2>THÔNG TIN</h2>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About us</Link>
              </li>
              <li>
                <Link to="/gallery">Gallery</Link>
              </li>
              <li>
                <Link to="/destinations">Destinations</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/testimonial">Testimonial</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* <div className="box post">
            <h2>RECENT POSTS</h2>
            <ul>
              <li>
                <p>Lorem ipsum dolor sit amet sectetur adipiscing elit amet</p>
                <label className="fa fa-calendar-alt"></label>
                <span>01 Oct 2020</span>
              </li>
              <li>
                <p>Lorem ipsum dolor sit amet sectetur adipiscing elit amet</p>
                <label className="fa fa-calendar-alt"></label>
                <span>01 Oct 2020</span>
              </li>
              <li>
                <p>Lorem ipsum dolor sit amet sectetur adipiscing elit amet</p>
                <label className="fa fa-calendar-alt"></label>
                <span>01 Oct 2020</span>
              </li>
            </ul>
          </div> */}

          <div className="box">
            <h2>KẾT NỐI VỚI ARMANI</h2>
            <p>
              {/* Armani luôn luôn lắng nghe những đóng góp, phàn hồi từ khách hàng.
              Qua đó, nắm bắt được nhu cầu tâm tư khách hàng. */}
            </p>

            {/* <input type="text" name="" id="" />
            <input type="text" className="primary-btn" value="SUBSCRIBE" /> */}
          </div>
        </div>
      </footer>
      <div className="legal">
        <p>© 2023 All Rights Reserved.</p>
      </div>
    </>
  );
};

export default Footer;
