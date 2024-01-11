import React, { useEffect } from "react";

function Success() {
  useEffect(() => {
    // Hàm này sẽ được gọi sau khi component được render
    const timeoutId = setTimeout(() => {
      // Sau 2 giây, chuyển trang đến địa chỉ '/new-page'
      window.location.href = "/";
    }, 2000);

    // Clear timeout nếu component unmounted hoặc được chuyển trang trước khi hết thời gian
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <img
          style={{
            height: 450,
            width: 450,
            margin: 30,
          }}
          src="https://www.nhahangquangon.com/wp-content/uploads/2020/10/icon-thanh-cong.png"
        />
        <p
          style={{
            fontSize: 50,
          }}
        >
          Thanh toán thành công!{" "}
        </p>
      </div>
    </>
  );
}

export default Success;
