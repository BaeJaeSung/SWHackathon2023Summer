require("dotenv").config();

const express = require("express");
const db = require("../db");
const { Configuration, OpenAIApi } = require("openai");

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const chatGPT = async (prompt) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `당신은 사용자로부터 이름, 나이, 업무 경험(근무처 이름, 근무 기간, 근무 내용), 학력을 받고 이를 바탕으로 15~20줄 정도의 아르바이트 자기소개서를 작성하는 서비스입니다.`,
      },
      { role: "user", content: prompt },
    ],
  });

  console.log(response["data"]["choices"][0]["message"]["content"]);
  return response["data"]["choices"][0]["message"]["content"];
};

router.post("/create", async (req, res, next) => {
  const body = req.body;

  const id = body.id;
  const nickname = body.nickname;
  const age = body.age;
  const company_name = body.company_name;
  const period = body.period;
  const experience = body.experience;
  const study_career = body.study_career;

  const result = await chatGPT(
    `이름 : ${nickname}, 나이 : ${age}, 업무 경험(근무처 이름) : ${company_name}, 업무 경험(근무 기간) : ${period}, 업무 경험(근무 내용) : ${experience}, 학력 : ${study_career}`
  );

  // 예시 코드
  //   const result = await chatGPT(
  //     `이름 : ${"양래은"}, 나이 : ${22}, 업무 경험(근무처 이름) : ${"제주시청 한스델리"}, 업무 경험(근무 기간) : ${"6"}개월, 업무 경험(근무 내용) : ${"홀서빙 했습니다."}, 학력 : ${"제주대학교 재학중"}`
  //   );

  res.json({
    response: result,
  });
});

module.exports = router;
