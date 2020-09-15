import React, { useState } from "react";
import Dropzone from "react-dropzone";
//import { Icon } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Axios from "axios";

function FileUpload(props) {
  const [Images, setImages] = useState([]);
  const dropHandler = (files) => {
    let formData = new FormData();

    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    Axios.post("/api/product/image", formData, config).then((response) => {
      if (response.data.success) {
        setImages([...Images, response.data.filePath]);
        props.refreshFunction(...Images, response.data.filePath); //부모 컴포넌트로 image state의 변경 시 전달함
      } else {
        alert("파일 저장하는데 실패 했습니다.");
      }
    });
  };

  const deleteHandler = (image) => {
    //복사
    const currentIndex = Images.indexOf(image); // 클릭한 것의 image 인덱스

    let newImages = [...Images];
    newImages.splice(currentIndex, 1); //newImages array에서 currentIndex부터 1개의 이미지를 지워준다.
    setImages(newImages);
    props.refreshFunction(newImages);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Dropzone onDrop={dropHandler}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              width: 300,
              height: 240,
              border: "1px solid lightgray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <PlusOutlined />
          </div>
        )}
      </Dropzone>

      <div
        style={{
          display: "flex",
          width: "350px",
          height: "240px",
          overflow: "scroll",
        }}
      >
        {Images.map((image, index) => (
          <div onClick={() => deleteHandler(image)} key={index}>
            <img
              style={{ minWidth: "300px", width: "300px", height: " 240px" }}
              src={`http://localhost:5000/${image}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUpload;
