const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Product } = require("../models/Product");
//=================================
//             product
//=================================

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

var upload = multer({ storage: storage }).single("file");

router.post("/image", (req, res) => {
  //가져온 이미지를 저장을 해주면 된다.
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/", (req, res) => {
  //받아온 정보들을 디비에 넣어 준다.
  const product = new Product(req.body);
  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/products", (req, res) => {
  // product collection에 들어있는 모든 상품 정보들을 가져오기

  let limit = req.body.limit ? parseInt(req.body.limit) : 20; //string일 경우 int로 바꿔줌
  let skip = req.body.skip ? parseInt(req.body.skip) : 0; //0, 20은 없다면임
  let term = req.body.searchTerm;

  let findArgs = {};
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0], //greater then equal. mongo db에서 사용
          $lte: req.body.filters[key][1], //less then equal
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    Product.find(findArgs) //조건에 맞게 가져오기. 파라미터 없으면 다 가져오는것.
      .find({ $text: { $search: term } }) //몽고db 기능.
      .populate("writer") //등록한 사람의 아이디를 이용해서 writer의 모든 정보를 가져오게
      .skip(skip) //0번째부터
      .limit(limit) //8개 가져와
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length });
      }); //query
  } else {
    Product.find(findArgs) //조건에 맞게 가져오기. 파라미터 없으면 다 가져오는것.
      .populate("writer") //등록한 사람의 아이디를 이용해서 writer의 모든 정보를 가져오게
      .skip(skip) //0번째부터
      .limit(limit) //8개 가져와
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length });
      }); //query
  }
});

router.get("/products_by_id", (req, res) => {
  //productId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져온다.
  let type = req.query.type;
  let productIds = req.query.id;
  // id = 123123, 23232, 23543 이거를
  // productIds = ['123123', '23232', 23543'] 이렇게 만들어준다.
  if (type === "array") {
    let ids = req.query.id.split(",");
    productIds = ids.map((item) => {
      return item;
    });
  }
  Product.find({ _id: { $in: productIds } })
    .populate("writer")
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(product);
    });
});

module.exports = router;
