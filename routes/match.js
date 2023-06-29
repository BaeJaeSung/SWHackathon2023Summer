// match API
const express = require("express");
const db = require("../db");

const router = express.Router();

// hiki 목록 불러오기 (자영업자 사용 API)
router.post("/load_candidate_hiki", async (req, res, next) => {
  const body = req.body;

  const id = body.id; // 사업자 id

  const getAllHikiSQL = `SELECT user.uid AS uid, user.id AS id, user.nickname AS nickname, profile.info AS info, profile.study_career AS study_career FROM user, youth_profile AS profile WHERE TYPE = 0 AND user.id = profile.uid ORDER BY RAND() LIMIT 10;`;

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
    const getMatchSQL = `SELECT * FROM match WHERE hiki_id = '${user.id}' AND ceo_id = '${id}'`;
    const match = await new Promise((resolve, reject) => {
      db.query(getMatchSQL, (err, res) => {
        if (err) throw err;
        if (res.length === 0) 
          resolve(true);
        else {
          if (res[0]['ceo_choice'] == 0){
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });

    // 보여주지 않을 사람 건너 뛰기
    if (!match) 
      continue;

    // add career field
    const getHikiCareerSQL = `SELECT * FROM user, youth_career WHERE user.id = youth_career.uid AND user.id = '${user.id}'`;
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

  const body = req.body;

  const id = body.id; // 히키 id

  const getAllCEOSQL = `SELECT user.id AS id, ceo.name AS name, ceo.number AS number, ceo.intro AS intro, ceo.employee_count AS employee_count, ceo.type AS type, ceo.representative AS representative FROM user, company_profile AS ceo WHERE user.id = ceo.uid ORDER BY RAND() LIMIT 10;`;

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
    const getMatchSQL = `SELECT * FROM match WHERE ceo_id = '${user.id}' AND hiki_id = '${id}'`;
    const match = await new Promise((resolve, reject) => {
      db.query(getMatchSQL, (err, res) => {
        if (err) throw err;
        if (res.length === 0) 
          resolve(true);
        else {
          if (res[0]['hiki_choice'] == 0){
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });

    // 보여주지 않을 사람 건너 뛰기
    if (!match) 
      continue;

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
      
    let ceo = {};
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

// Yes or No 선택 - OK
router.post("/choice", async (req, res, next) => {
  const body = req.body;

  const id = body.id;
  const type = body.type;
  const receiver_id = body.receiver_id;
  const choice = body.choice;

  console.log(id, type, receiver_id, choice);

  // if hiki
  let insertLikeSQL;
  let checkMatchedSQL;
  if (parseInt(type) === 0) {
    insertLikeSQL = `INSERT INTO matching(hiki_id, ceo_id, hiki_choice)
                            VALUES ('${id}', '${receiver_id}', ${parseInt(
      choice
    )})
                            ON DUPLICATE KEY UPDATE
                            hiki_choice = ${choice}`;

    checkMatchedSQL = `SELECT * FROM matching WHERE hiki_id = '${id}'`;
  } else {
    insertLikeSQL = `INSERT INTO matching(hiki_id, ceo_id, ceo_choice)
                            VALUES ('${receiver_id}', '${id}', ${parseInt(
      choice
    )})
                            ON DUPLICATE KEY UPDATE
                            ceo_choice = ${choice}`;

    checkMatchedSQL = `SELECT * FROM matching WHERE ceo_id = '${id}'`;
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

      if (res[0].hiki_choice === 1 && res[0].ceo_choice === 1) {
        console.log("match!");
        resolve(true);
      } else {
        console.log("don`t match!");
        resolve(false);
      }
    });
  });

  res.json({
    success: result,
    is_matched: is_matched,
  });
});

// 나를 좋아하는데 내가 아직 발견못한 유저들 (상대 -> 나 : 1 // 나 -> 상대 : 0)
router.post("/received", async (req, res, next) => {
  const body = req.body;

  const id = body.id;
  const type = body.type;

  // if hiki

  if (parseInt(type) === 0) {
    sql = `SELECT * FROM user, matching, youth_profile WHERE `;
  } else {
  }
});

module.exports = router;
