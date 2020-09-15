import React, { useEffect } from "react";
import { FaCode } from "react-icons/fa";
import Axios from "axios";
import { Icon, Col, Card, Row } from "antd";

function LandingPage() {
  //db에서 정보 가져오기
  useEffect(() => {
    let body = {};
    Axios.post("/api/product/products").then((response) => {
      if (response.data.success) {
        console.log(response.data);
      } else {
        alert("상품들을 가져오는데 실패 했습니다.");
      }
    });
  }, []);
  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          Let's travel Anywhere <Icon type="rocket" />
        </h2>
      </div>

      {/* Filter */}

      {/* Search */}

      {/* Cards */}

      <Card>
        <Meta />
      </Card>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button>더보기</button>
      </div>
    </div>
  );
}

export default LandingPage;
