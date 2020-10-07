import React, { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";

function ProductImage(props) {
  const [Images, setImages] = useState([]);

  useEffect(() => {
    if (props.detail.images) {
      //&& props.detail.images.lenth > 0
      let images = [];
      props.detail.images.map((item) => {
        images.push({
          original: `http://localhost:5000/${item}`,
          thumbnail: `http://localhost:5000/${item}`,
        });
      });
      setImages(images);
    }
  }, [props.detail]); //props.detail이 바뀔때마다 라이프 사이클(유즈이펙트)를 작동시킨다. 원래는 렌더링 될때마다 작동됨

  return (
    <div>
      <ImageGallery items={Images} />
    </div>
  );
}

export default ProductImage;
