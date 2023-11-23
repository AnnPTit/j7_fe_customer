import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({
  item: {
    id,
    title,
    photoDTOS,
    content,
    countLike,
    countView,
    createAt,
    createBy,
  },
}) => {
  return (
    <>
      <div className="items">
        <div className="img">
          {photoDTOS.map((photo, index) => (
            <img key={index} src={photo} alt={`Photo ${index + 1}`} />
          ))}
          {/* <img src={photoDTOS.[0]} alt='Gallery Image' /> */}
        </div>

        <div className="category flex_space">
          <span>{createAt}</span>
          <label>{createBy}</label>
        </div>

        <div className="details">
          <h3>{title}</h3>
          <p>{countLike}</p>
          <p>{countView}</p>
        </div>

        <Link to={`/blogsingle/${id}`} className="blogItem-link">
          READ MORE <i className="fa fa-long-arrow-right"></i>
        </Link>
      </div>
    </>
  );
};

export default BlogCard;
