// login API
const express = require("express");
const db = require("../db");

const router = express.Router();

/* GET home page. */
// user/join :: 회원가입 기능
router.post("/join", async (req, res, next) => {
  const body = req.body;

  const id = body.id;
  const pw = body.pw;
  const nickname = body.nickname;
  const type = body.type;
  const age = body.age;

  const insertUserSQL = `INSERT INTO user(id, pw, nickname, type, age) VALUES ('${id}', '${pw}', '${nickname}', ${type}, ${age})`;

  const join_flag = await new Promise((resolve, reject) => {
    db.query(insertUserSQL, (err, res) => {
      if (err) {
        console.log(err);

        resolve(false);
      } else {
        console.log(id, pw, nickname, type, age);
        console.log("insert success!");

        resolve(true);
      }
    });
  });

  // success
  if (await join_flag) {
    return res.send(true);
  } // failed
  else {
    return res.send(false);
  }

  // res.render("login", { title: "Express" });
});

// user/login :: 로그인 기능
router.post("/login", async (req, res, next) => {
  const body = req.body;

  const id = body.id;
  const pw = body.pw;

  const loginSQL = `SELECT * FROM user
                    WHERE id = '${id}' AND pw = '${pw}'`;

  let user;
  const login_flag = await new Promise((resolve, reject) => {
    db.query(loginSQL, (err, res) => {
      if (err) {
        console.log(err);
        reject(false);
      } else {
        // login failed!
        if (!res[0]) {
          resolve(false);
        } // login success!
        else {
          user = res[0];
          resolve(true);
        }
      }
    });
  });

  console.log("login_flag", login_flag);

  if (login_flag) {
    res.send(true);
  } else {
    res.send(false);
  }
});

// user/logout :: 로그아웃 기능
// router.post("/logout", async (req, res, next) => {
//   return res.send("test");
// });

module.exports = router;
