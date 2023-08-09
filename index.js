const express = require('express') // 모듈 임포트
const app = express()
const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')
const axios = require('axios')
const usersRouter = require('./src/routes/users') // 사용자가 /api/users 라우터 요청을 보낸경우 처리할 라우트핸들러 함수를 임포트 한다
const booksRouter = require('./src/routes/books')
const config = require('./config')


let corsOptions = {
    origin: 'http://127.0.0.1:5500',
    credentials: true
}
let books = {}

mongoose.connect(config.MONGODB_URL)
.then(() => console.log('mongodb connected...'))
.catch(e => console.log(`failed to connect mongodb: ${e}`))

/* 공통 미들웨어  - 시작*/
// 로그기록

app.use(cors(corsOptions)) // CORS 설정
app.use(express.json()) // request body 파싱
app.use(logger('tiny')) // Logger 설정

app.use('/api/users', usersRouter) // User 라우터
app.use('/api/books', booksRouter) // Book 라우터
/* 공통 미들웨어  - 끝*/



/* API 설계 */

app.get('/hello', (req, res) => { // URL 응답 테스트
    res.json('hello world!')
})

app.post('/hello', (req, res) => { // POST 요청 테스트
    console.log(req.body)
    res.json({ userId: req.body.userId, email: req.body.email })
})
app.get('/error', (req, res) => { // 오류 테스트
    throw new Error('서버에 치명적인 에러가 발생했습니다.')
}) 
app.get('/fetch', async(req, res) => {  // 이건 아무거나 해도 되는건가?
    const response = await axios.get('https://jsonplaceholder.typicode.com/users')
    res.send(response.data)
})
// fallback handler
app.use((req, res, next) => { // 사용자가 요청한 페이지가 없는 경우 에러처리
    res.status(404).send('페이지를 찾을 수 없습니다.')
})
app.use((err, req, res, next) => { // 서버 내부 오류 처리
    console.error(err.stack)
    res.status(500).send('서버에 문제가 발생하였습니다.')
})
app.listen(3000, () => { /* 서버실행 */
    console.log('Now listening on port 3000')
})