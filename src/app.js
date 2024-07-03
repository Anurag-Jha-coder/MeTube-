import cookieParser from "cookie-parser";
import express from "express";


const  app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential :true
}));

app.use(express.json({limit: "20kb"}));
app.use(express.urlencoded({
    extended:true,
    limit: "20kb"
}));

app.use(express.static("public"));

app.use(cookieParser());



export{app};
