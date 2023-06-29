// login API
const express = require("express");
const db = require("../db");

const router = express.Router();

/* GET home page. */
// user/join :: 회원가입 기능 - OK
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

  res.json({
    success: join_flag,
  });
});

// user/login :: 로그인 기능 - OK
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
  res.json({
    success: login_flag,
  });
});

// user/logout :: 로그아웃 기능
// router.post("/logout", async (req, res, next) => {
//   return res.send("test");
// });

// img upload 보류
// router.post("/upload_picture", async (req, res, next) => {
//   const body = req.body;

//   const id = body.id;
//   const num = body.num;

//   // upload picture

//   res.send(true);
//   res.send(false);
// });

// hiki register profile text - OK
router.post("/register_profile_text", async (req, res, next) => {
  const body = req.body;

  const id = body.id;
  const info = body.info;

  const insertHikiProfileSQL = `INSERT INTO youth_profile(uid, info) VALUES('${id}', '${info}') ON DUPLICATE KEY UPDATE info = '${info}'`;
  const success_flag = await new Promise((resolve) => {
    db.query(insertHikiProfileSQL, (err) => {
      if (err) resolve(false);
      else resolve(true);
    });
  });

  res.json({
    success: success_flag,
  });
});

// hiki register study career - OK
router.post("/register_profile_study_career", async (req, res, next) => {
  const body = req.body;

  const id = body.id;
  const study_career = body.study_career;

  const insertHikiStudyCareerSQL = `INSERT INTO youth_profile(uid, study_career) VALUES('${id}', '${study_career}')
                                    ON DUPLICATE KEY UPDATE study_career = '${study_career}'`;

  const success_flag = await new Promise((resolve) => {
    db.query(insertHikiStudyCareerSQL, (err, res) => {
      if (err) resolve(false);
      else resolve(true);
    });
  });

  res.json({
    success: success_flag,
  });
});

// hiki register career - OK
router.post("/register_career", async (req, res, next) => {
  const body = req.body;

  const id = body.id;
  const company_name = body.company_name;
  const period = body.period;
  const experience = body.experience;

  const insertHikiCareerSQL = `INSERT INTO youth_career(uid, company_name, period, experience)
                              VALUES('${id}', '${company_name}', '${period}', '${experience}')`;

  const success_flag = await new Promise((resolve) => {
    db.query(insertHikiCareerSQL, (err) => {
      if (err) resolve(false);
      else resolve(true);
    });
  });

  res.json({
    success: success_flag,
  });
});

// 내 정보 불러오기 (보류)
// user, profile, career 다 가져와야함
// router.post("/my_info", async (req, res, next) => {
//   const body = req.body;

//   const id = body.id;
//   const type = await new Promise((resolve) => {
//     db.query(`SELECT type FROM user WHERE id = '${id}'`, (err, res) => {
//       if (err) throw err;
//       resolve(parseInt(res[0].type));
//     });
//   });

//   let user_info;
//   if (parseInt(type) === 0) {
//     const getHikiInfoSQL = `SELECT user.uid AS uid, user.id AS id, user.nickname AS nickname, user.type AS type, user.age AS age, profile.info AS info, profile.study_career AS study_career
//                             FROM user, youth_profile AS profile
//                             WHERE user.id = profile.uid AND user.id = '${id}'`;

//     user_info = await new Promise((resolve, reject) => {
//       db.query(getHikiInfoSQL, (err, res) => {
//         if (err) throw err;

//         resolve(res);
//       });
//     });

//     const career = await new Promise((resolve) => {
//       db.query(`SELECT * FROM youth_career WHERE uid = '${id}'`, (err, res) => {
//         if(err) throw
//       })
//     })

//   } else {
//     const getCEOInfoSQL = `SELECT * FROM company_profile WHERE uid = '${id}'`;

//     user_info = await new Promise((resolve, reject) => {
//       db.query(getCEOInfoSQL, (err, res) => {
//         if (err) throw err;

//         resolve(res);
//       });
//     });
//   }

//   res.send(user_info);
// });

router.post("/my_info", async (req, res, next) => {
  const body = req.body;
  const id = body.id;
  const type = body.type;

  let user;
  if (parseInt(type) === 0) {
    const getHikiInfoSQL = `SELECT user.uid AS uid, user.id AS id, user.nickname AS nickname, user.type AS type, user.age AS age, profile.info AS info, profile.study_career AS study_career, FROM user, youth_profile AS profile WHERE user.id = profile.uid;`;

    user = await new Promise((resolve, reject) => {
      db.query(getHikiInfoSQL, (err, res) => {
        if (err) throw err;
        resolve(res);
      });
    });

    const getHikiCareerSQL = `SELECT * FROM user, youth_career WHERE user.id = youth_career.uid AND user.id = '${id}'`;
    const career = await new Promise((resolve, reject) => {
      db.query(getHikiCareerSQL, (err, res) => {
        if (err) throw err;
        resolve(res);
      });
    });

    let hiki = {};
    const result = await new Promise((resolve) => {
      hiki.uid = user.uid;
      hiki.id = user.id;
      hiki.nickname = user.nickname;
      hiki.type = user.type;
      hiki.age = user.age;
      hiki.info = user.info;
      hiki.study_career = user.study_career;
      hiki.careers = career;

      resolve(hiki);
    });


  } else {
    const getCEOInfoSQL = `SELECT user.uid AS uid, user.id AS id, user.nickname AS nickname, user.type AS type, user.age AS age, profile.name AS name, profile.phone_number AS phone_number, profile.intro AS intro, profile.employee_count AS employee_count, profile.type AS company_type, profile.representative AS representative FROM user, company_profile AS profile WHERE user.id = profile.uid;`;

    user = await new Promise((resolve, reject) => {
      db.query(getCEOInfoSQL, (err, res) => {
        if (err) throw err;
        resolve(res);
      });
    });

    const getCEOWorkSQL = `SELECT * FROM company_employment AS ceo_work WHERE ceo_work.uid = '${id}'`;
    console.log("for get ceo query", user.id);
    const works = await new Promise((resolve, reject) => {
      db.query(getCEOWorkSQL, (err, res) => {
        if (err) throw err;
        console.log(res);
        resolve(res);
      });
    });

    let ceo = {};
    const result = await new Promise((resolve) => {
      ceo.uid = user.uid;
      ceo.id = user.id;
      ceo.nickname = user.nickname;
      ceo.type = user.type;
      ceo.age = user.age;
      ceo.name = user.name; // 회사 이름
      ceo.phone_number = user.phone_number;
      ceo.intro = user.intro;
      ceo.employee_count = user.employee_count;
      // ceo.img_url;
      ceo.company_type = user.company_type;
      ceo.representative = user.representative;
      ceo.works = works;

      resolve(ceo);
    });
  }
  res.send(user_info);
});

// hiki register

module.exports = router;
