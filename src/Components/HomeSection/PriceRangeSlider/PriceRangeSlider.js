import React, { useState } from "react";
import { Slider, Typography } from "@mui/material";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND", // Đổi VND thành đơn vị tiền tệ mong muốn (Việt Nam Đồng)
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const PriceRangeSlider = ({ priceRange, setPriceRange }) => {
  const handleChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <div>
      <Typography id="range-slider" gutterBottom></Typography>
      <Slider
        value={priceRange}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        min={0}
        max={5000000}
      />
      <Typography>{`${formatCurrency(priceRange[0])} - ${formatCurrency(
        priceRange[1]
      )}`}</Typography>
    </div>
  );
};

export default PriceRangeSlider;
