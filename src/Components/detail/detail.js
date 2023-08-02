import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";

var stompClient = null;

const disconnect = () => {
  if (stompClient != null) {
    stompClient.disconnect();
    console.log("Stomp disconnected");
  }
};
const sendMessage = () => {
  stompClient.send("/app/products", {}, "Hêllo");
};
function Detail() {
  const [arr, setArr] = useState(["con cac"]);
  const connect = () => {
    const ws = new SockJS(`http://localhost:2003/ws`);
    stompClient = Stomp.over(ws);
    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/product", (data) => {
        const mess = data;
        console.log("Mes", mess);
        setArr((prve) => [...prve, data.body]);
      });
    });
  };
  connect();
  return (
    <div>
      <h1>Đây là trang detail</h1>
      <button
        onClick={() => {
          connect();
        }}
      >
        Connect
      </button>
      <button
        onClick={() => {
          disconnect();
        }}
      >
        DisConnect
      </button>
      <button
        onClick={() => {
          sendMessage();
        }}
      >
        sendMessage
      </button>
      <ul>
        {arr.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default Detail;
