// match API
const express = require("express");
const db = require("../db");

const router = express.Router();

// hiki 목록 불러오기 (자영업자 사용 API)
router.post("/load_candidate_hiki", async (req, res, next) => {
  const getAllHikiSQL = `SELECT user.uid AS uid, user.id AS id, user.nickname AS nickname, profile.info AS info, profile.study_career AS study_career FROM user, youth_profile AS profile WHERE TYPE = 0 AND user.id = profile.uid`;

  const hikis = [];
  const hikiInfo = await new Promise((resolve, reject) => {
    db.query(getAllHikiSQL, (err, res) => {
      if (err) {
        console.log(err);
        resolve(null);
      } else {
        resolve(res);
      }
    });
  });

  for (let user of hikiInfo) {
    let hiki = {};

    // add career field
    const getHikiCareerSQL = `SELECT * FROM user, youth_career WHERE user.id = youth_career.uid AND user.id = '${user.id}'`;
    const career = await new Promise((resolve, reject) => {
      db.query(getHikiCareerSQL, (err, res) => {
        if (err) throw err;

        resolve(res);
      });
    });

    const result = await new Promise((resolve) => {
      hiki.uid = user.uid;
      hiki.id = user.id;
      hiki.nickname = user.nickname;
      hiki.info = user.info;
      hiki.study_career = user.study_career;
      // hiki.images;
      hiki.career = career;

      resolve(hiki);
    });

    await hikis.push(result);
  }
  console.log("hikis", hikis);

  res.send(hikis);
});

// 자영업자 목록 불러오기 (히키 사용 API)
router.post("/load_candidate_ceo", async (req, res, next) => {
  const getAllCEOSQL = `SELECT user.id AS id, ceo.name AS name, ceo.number AS number, ceo.intro AS intro, ceo.employee_count AS employee_count, ceo.type AS type, ceo.representative AS representative FROM user, company_profile AS ceo WHERE user.id = ceo.uid`;

  const ceos = [];
  const ceoInfo = await new Promise((resolve, reject) => {
    db.query(getAllCEOSQL, (err, res) => {
      if (err) {
        throw err;
      }

      resolve(res);
    });
  });

  // console.log(ceoInfo);

  for (let user of ceoInfo) {
    let ceo = {};

    // add works field
    const getCEOWorkSQL = `SELECT * FROM company_employment AS ceo_work WHERE ceo_work.uid = '${user.id}'`;
    console.log("for get ceo query", user.id);
    const works = await new Promise((resolve, reject) => {
      db.query(getCEOWorkSQL, (err, res) => {
        if (err) throw err;

        console.log(res);
        resolve(res);
      });
    });

    const result = await new Promise((resolve) => {
      ceo.id = user.id;
      ceo.name = user.name;
      ceo.number = user.number;
      ceo.intro = user.intro;
      ceo.employee_count = user.employee_count;
      // ceo.img_url;
      ceo.type = user.type;
      ceo.representative = user.representative;
      ceo.works = works;

      resolve(ceo);
    });

    await ceos.push(result);
  }
  console.log("ceos", ceos);

  res.send(ceos);
});

// Yes or No 선택
router.post("/choice", async (req, res, next) => {
  const body = req.body;

  const id = body.id;
  const type = body.type;
  const receiver_id = body.receiver_id;
  const choice = body.choice;

  // if hiki
  let insertLikeSQL;
  let checkMatchedSQL;
  if (parseInt(type) === 0) {
    insertLikeSQL = `INSERT INTO matching(hiki_id, ceo_id, hiki_choice)
                            VALUES ('${id}', '${receiver_id}', ${choice})
                            ON DUPLICATE KEY UPDATE
                            hiki_choice = VALUES(choice)`;

    checkMatchedSQL = `SELECT * FROM mathing WHERE hiki_id = '${id}'`;
  } else {
    insertLikeSQL = `INSERT INTO matching(hiki_id, ceo_id, ceo_choice)
                            VALUES ('${id}', '${receiver_id}', ${choice})
                            ON DUPLICATE KEY UPDATE
                            ceo_choice = VALUES(choice)`;

    checkMatchedSQL = `SELECT * FROM mathing WHERE ceo_id = '${id}'`;
  }

  const result = await new Promise((resolve) => {
    db.query(insertLikeSQL, (err) => {
      if (err) resolve(false);

      resolve(true);
    });
  });

  const is_matched = await new Promise((resolve) => {
    db.query(checkMatchedSQL, (err, res) => {
      if (err) throw err;

      if (res.hiki_choice === 1 && res.hiki_choice === 1) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });

  res.json({
    success: result,
    is_matched: is_matched,
  });
});

router.post("/received", async (req, res, next) => {
  const body = req.body;

  const id = body.id;
  const type = body.type;

  // if hiki
  if (parseInt(type) === 0) {
    sql = `SELECT * FROM user, matching, youth_profile WHERE `;
  }
});

module.exports = router;