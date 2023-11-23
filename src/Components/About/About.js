import React from "react";
import "./About.css";
import AboutCard from "./AboutCard";
import HeadTitle from "../../Common/HeadTitle/HeadTitle";

const About = () => {
  return (
    <>
      <HeadTitle />

      <section className="about top">
        <div className="container">
          <AboutCard />
        </div>
      </section>

      <section className="features top">
        <div className="container aboutCard flex_space">
          <div className="row row1">
            <h1>
              <span>Định hướng - Tầm nhìn</span>
            </h1>
            <p>
              Khách sạn Armani Hotel hướng tới mục tiêu trở thành một trong
              những khách sạn hàng đầu Việt Nam, được du khách trong và ngoài
              nước yêu mến. Khách sạn cam kết mang đến cho du khách những trải
              nghiệm nghỉ dưỡng tuyệt vời, với chất lượng dịch vụ cao cấp, đội
              ngũ nhân viên chuyên nghiệp, nhiệt tình và cơ sở vật chất hiện
              đại.
            </p>
            <p>
              Với những định hướng và tầm nhìn rõ ràng, Armani Hotel tin tưởng
              sẽ đạt được những thành công trong tương lai, trở thành một trong
              những khách sạn hàng đầu Việt Nam.
            </p>
            <button className="secondary-btn">
              Explore More <i className="fas fa-long-arrow-alt-right"></i>
            </button>
          </div>
          <div className="row image">
            <img src="/images/feature-img-1.jpg" alt="" />
            <div className="control-btn">
              <button className="prev">
                <i className="fas fa-play"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
