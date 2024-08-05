import "dotenv/config";
import express, { response } from "express";
import path from 'path';
import cors from "cors";
import morgan from "morgan";
import smtpTransport from "./server/config/email.js";
import { auth_Connect } from "./server/util/dbConnect.js";

const PORT = 3050;
const __dirname = path.resolve();       //commonjs를 사용하면 기본적으로 __dirname이 포함되어 있지만 ESM에서는 기본적으로 포함되어있지 않다.
const BUILDDIR = "/ssidong_front/build/";       // "../front/build/"

const app = express();
const logger = morgan('dev');

app.use(express.json());            // 유저가 보낸 array/object 데이터를 출력하기 위해 사용
app.use(cors());                    // react와 통신을 원활하게 하기위한 미들웨어
app.use(logger);                    //서버 접속상태 실시간 확인 라이브러리                               
app.use(express.static(path.join(__dirname, "/ssidong_front/build")));     //서버에 접속하는 사람들에게 입력한 path추소에서 html파일을 전송함  

// 포트폴리오 정보를 가져옵니다.
app.get('/api/requestPortfolio', (req, res) => {
    const sql = `SELECT * FROM portfolio`;
    auth_Connect(sql, (success, state, rows, error) => {
        if (error || !success) return res.send(false)

        if (!rows.length) return res.send(false)

        return res.send(rows);
    })
})

// 이메일을 보냅니다
app.post('/api/sendmailToContact', (req, res) => {
    const { inquiry, companyName, phone, projectName, email, descrypt } = req.body;
    const mailOption = {
        from: "시동프로덕션",
        to: process.env.SMTP_EMAIL,
        subject: "[시동프로덕션] 문의드립니다.",
        text: `문의내용: ${inquiry}\n
               성명/회사명: ${companyName}\n
               연락처: ${phone}\n
               프로젝트명: ${projectName}\n
               이메일: ${email}\n
               상세내용: ${descrypt}`
    }

    smtpTransport.sendMail(mailOption, (error, response) => {
        console.log(response)
        if (error) {
            console.log(error);
            return res.status(200).send(false);
        } else {
            return res.status(200).send(true);
        }
    })
})

// 모든 라우팅 권한을 react로 옮겨줌
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, `${BUILDDIR}index.html`));
    console.log('Welcome to myday');
});

app.listen(PORT, console.log("시동프로덕션 홈페이지에 오신것을 환영합니다"));