import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "20px", // Có thể điều chỉnh khoảng cách trên dưới theo nhu cầu của bạn
};

function MyPagination({ pageNumber, totalPages, setPageNumber }) {
  const handleChange = (event, value) => {
    setPageNumber(value - 1); // Giá trị `value` bắt đầu từ 1, còn `pageNumber` của bạn bắt đầu từ 0
  };

  return (
    <div style={containerStyle}> {/* Sử dụng inline style để căn giữa */}
      <Stack spacing={2}>
        <Pagination
          count={totalPages}
          page={pageNumber + 1} // Bắt đầu từ 1, còn `pageNumber` của bạn bắt đầu từ 0
          onChange={handleChange}
          shape="rounded"
          size="large"
          color="primary"
        />
      </Stack>
    </div>
  );
}

export default MyPagination;
