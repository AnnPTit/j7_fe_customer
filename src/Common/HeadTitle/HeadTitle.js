import React from "react";
import "./HeadTitle.css";
import { useLocation, Link } from "react-router-dom";

const HeadTitle = () => {
  const location = useLocation();

  return (
    <>
      <section className="image-heading">
        <div className="container"></div>
      </section>
    </>
  );
};

export default HeadTitle;
