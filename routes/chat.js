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

  for (let chat of chatList) {
    const recent_msg = await new Promise((resolve) => {
      db.query(
        `SELECT message FROM chat_contents WHERE chat_id = ${chat.chat_id} ORDER BY sendtime DESC`,
        (err, res) => {
          if (err) throw err;
          resolve(res[0].message);
        }
      );
    });

    const hiki_name = await new Promise((resolve) => {
      db.query(
        `SELECT nickname FROM user WHERE id = '${chat.hiki_id}'`,
        (err, res) => {
          if (err) throw err;
          resolve(res[0].nickname);
        }
      );
    });

    const ceo_name = await new Promise((resolve) => {
      db.query(
        `SELECT nickname FROM user WHERE id = '${chat.ceo_id}'`,
        (err, res) => {
          if (err) throw err;
          resolve(res[0].nickname);
        }
      );
    });

    chat.hiki_name = hiki_name;
    chat.ceo_name = ceo_name;
    chat.recent_msg = recent_msg;
  }


  res.send(chatList);
});

router.post("/contents", async (req, res, next) => {
  const body = req.body;

  const chat_id = body.chat_id;

  const getChatContentsSQL = `SELECT *
                              FROM chat_contents AS chat
                              WHERE chat_id = ${chat_id}
                              ORDER BY sendtime`;

  const contents = await new Promise((resolve, reject) => {

    db.query(getChatContentsSQL, (err, res) => {
      if (err) {
        throw err;
      }

      resolve(res);
    });
  });


  let hiki_name;
  let ceo_name;
  if (contents.length !== 0) {
    hiki_name = await new Promise((resolve) => {
      db.query(
        `SELECT nickname FROM user WHERE id = '${contents[0].hiki_id}'`,
        (err, res) => {
          if (err) throw err;
          resolve(res[0].nickname);
        }
      );
    });

    ceo_name = await new Promise((resolve) => {
      db.query(
        `SELECT nickname FROM user WHERE id = '${contents[0].ceo_id}'`,
        (err, res) => {
          if (err) throw err;
          resolve(res[0].nickname);
        }
      );
    });
  }

  const result = {
    hiki_name: hiki_name,
    ceo_name: ceo_name,
    contents: contents,
  };

  res.send(result);
});

router.post("/send", async (req, res, next) => {
  const body = req.body;

  const chat_id = body.chat_id;
  const id = body.id;
  const msg = body.msg;
  const type = body.type;
  const receiver_id = await new Promise((resolve) => {
    if (parseInt(type) === 0) {
      db.query(
        `SELECT ceo_id FROM chat_info WHERE hiki_id = '${id}'`,
        (err, res) => {
          if (err) throw err;
          resolve(res[0].ceo_id);
        }
      );
    } else {
      db.query(
        `SELECT hiki_id FROM chat_info WHERE ceo_id = '${id}'`,
        (err, res) => {
          if (err) throw err;
          resolve(res[0].hiki_id);
        }
      );
    }
  });

  const date = new Date().toISOString().slice(0, 19).replace("T", " ");
  const success_flag = await new Promise((resolve) => {
    let insertChatSQL;
    if (parseInt(type) === 0) {
      insertChatSQL = `INSERT INTO chat_contents(chat_id, message, sendtime, hiki_id, ceo_id, sender)
                        VALUES('${chat_id}', '${msg}', '${date}', '${id}', '${receiver_id}', 0)`;
    } else {
      insertChatSQL = `INSERT INTO chat_contents(chat_id, message, sendtime, hiki_id, ceo_id, sender)
                        VALUES('${chat_id}', '${msg}', '${date}', '${receiver_id}', '${id}', 1)`;
    }

    db.query(insertChatSQL, (err, res) => {
      if (err) throw err;
      resolve(true);
    });
  });

  res.json({
    success: success_flag,
    sendtime: date,
  });
});


module.exports = router;
