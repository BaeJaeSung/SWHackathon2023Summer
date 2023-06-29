const express = require("express");
const cors = require("cors");

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const session = require("express-session");

// default
const indexRouter = require("./routes/index");

// custom
const userRouter = require("./routes/user");
const matchRouter = require("./routes/match");
const chatRouter = require("./routes/chat");
const chatgptRouter = require("./routes/chatgpt");

const app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// session middleware
app.use(
  session({
    HttpOnly: true,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      // maxAge: threeHours,
      httpOnly: true,
      Secure: true,
    },
    // store: new fileStore(), // sessions 폴더에 session record 저장
  })
);

// default
app.use("/", indexRouter);

// custom
app.use("/user", userRouter);
app.use("/match", matchRouter);
app.use("/chat", chatRouter);
app.use("/chatgpt", chatgptRouter);

module.exports = app;
