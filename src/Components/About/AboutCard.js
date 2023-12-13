import React from "react";
import "./About.css";

const AboutCard = () => {
  return (
    <>
      <div className="aboutCard mtop flex_space">
        <div className="row row1">
          <h4>Về chúng tôi</h4>
          <h1>
            Armani Hotel - <span>Nơi lưu trú lý tưởng của bạn</span>
          </h1>
          <p>
            Khách sạn Armani Hotel - Nơi lưu trú lý tưởng của bạn Khách sạn
            Armani Hotel là một khách sạn cao cấp với đầy đủ tiện nghi và dịch
            vụ hiện đại. Khách sạn được thiết kế theo phong cách sang trọng,
            tinh tế, mang đến cho du khách cảm giác thư giãn và thoải mái. Khách
            sạn có đa dạng các loại phòng nghỉ, được trang bị đầy đủ tiện nghi
            như: tivi, tủ lạnh, điều hòa, máy sấy tóc,... Các phòng đều có cửa
            sổ lớn, hướng ra biển hoặc thành phố, mang đến tầm nhìn tuyệt đẹp.
          </p>
          <p>
            Khách sạn Armani Hotel là lựa chọn lý tưởng cho du khách khi đến
            Việt Nam công tác, du lịch. Khách sạn hứa hẹn mang đến cho du khách
            những trải nghiệm nghỉ dưỡng tuyệt vời
          </p>
          {/* <button className="secondary-btn">
            <i className="fas fa-long-arrow-alt-right"></i>
          </button> */}
        </div>
        <div className="row ">
          <img src="/images/about-img-1.jpg" alt="" />
          {/* <div className="control-btn">
            <button className="prev">
              <i className="fas fa-play"></i>
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AboutCard;
