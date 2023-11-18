import React from "react";
import Cards from "./Cards";
import Cards2 from "./Cards2";
import "./MostPopular.css";

const MostPopular = () => {
  return (
    <>
      <section className="popular top">
        <div className="full_container">
          <div className="heading">
            <h1>Phòng</h1>
            <div className="line"></div>
          </div>  
          <div className="content">
            <Cards />
          </div>
        </div>
      </section>
      <section className="popular top">
        <div className="full_container">
          <div className="heading">
            <h1>Phòng có lượt đặt cao</h1>
            <div className="line"></div>
          </div>  
          <div className="content">
            <Cards2 />
          </div>
        </div>
      </section>
    </>
  );
};

export default MostPopular;
