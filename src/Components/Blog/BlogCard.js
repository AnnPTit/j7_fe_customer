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
  const formattedDate = new Date(createAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return (
    <>
      <div className="items">
        <div className="img">
          {photoDTOS &&
            photoDTOS.length > 0 &&
            photoDTOS.map((photo, index) => (
              <img
                style={{
                  height: 200,
                  objectFit: "cover",
                }}
                key={index}
                src={photo}
                alt={`Photo ${index + 1}`}
              />
            ))}

          {/* <img src={photoDTOS.[0]} alt='Gallery Image' /> */}
        </div>

        <div className="category flex_space">
          <span>{formattedDate}</span>
          <label>{createBy}</label>
        </div>

        <div className="details">
          <h3>{title}</h3>
          <p>
            <i class="fa fa-eye"></i>
            <span> {countView}</span>
          </p>
          {/* <p>
            <i class="fa fa-thumbs-up"></i>
            <span> {countLike}</span>
          </p> */}
        </div>

        <Link to={`/blogsingle/${id}`} className="blogItem-link">
          Đọc Thêm <i className="fa fa-long-arrow-right"></i>
        </Link>
      </div>
    </>
  );
};

export default BlogCard;
