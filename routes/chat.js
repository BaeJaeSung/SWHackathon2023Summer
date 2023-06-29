// chat API
const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/chat_list", async (req, res, next) => {
  const body = req.body;

  const id = body.id;
  const type = body.type;

  console.log(id, type);

  // if hiki
  let chatList;
  if (parseInt(type) === 0) {
    const getChatListSQL = `SELECT * FROM chat_info WHERE hiki_id = '${id}'`;

    chatList = await new Promise((resolve, reject) => {
      db.query(getChatListSQL, (err, res) => {
        if (err) {
          console.log(err);
          resolve(null);
        } else {
          console.log("find user!");

          resolve(res);
        }
      });
    });

    console.log("type == 0", chatList);
  } else {
    const getChatListSQL = `SELECT * FROM chat_info WHERE ceo_id = '${id}'`;

    chatList = await new Promise((resolve, reject) => {
      db.query(getChatListSQL, (err, res) => {
        if (err) {
          console.log(err);
          resolve(null);
        } else {
          resolve(res);
        }
      });
    });

    console.log("type == 1", chatList);
  }

  res.send(chatList);
});

router.post("/contents", async (req, res, next) => {
  const body = req.body;

  const chat_id = body.chat_id;

  const getChatContentsSQL = `SELECT * FROM chat_contents WHERE chat_id = ${chat_id}`;

  const result = await new Promise((resolve, reject) => {
    db.query(getChatContentsSQL, (err, res) => {
      if (err) {
        throw err;
      }

      resolve(res);
    });
  });

  res.send(result);
});

module.exports = router;
