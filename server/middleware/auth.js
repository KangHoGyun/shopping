const { User } = require("../models/User");

let auth = (req, res, next) => {
  let token = req.cookies.w_auth;
  // 쿠키 속의 토큰을 이용해서 유저 정보를 가져온다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true,
      });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
