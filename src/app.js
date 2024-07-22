import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "20kb",
  })
);

app.use(express.static("public"));

app.use(cookieParser());

// routes import

import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import commnetRouter from './routes/comment.routes.js '
import likeRouter from './routes/like.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import subscriberRouter from './routes/subscription.routes.js'


//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use('/api/v1/comment', commnetRouter)
app.use('/api/v1/like', likeRouter) 
app.use('/api/v1/tweet', tweetRouter)
app.use('/api/v1/subscription', subscriberRouter)

export { app }; 
