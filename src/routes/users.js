const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const { generateToken, isAuth } = require('../../auth')

const router = express.Router()

router.post('/register', expressAsyncHandler(async(req, res, next) => {
    console.log(req.body)
    const user = new User({
        name: req.body.name,
        phone: req.body.phone,
        userId: req.body.userId,
        password: req.body.password,
    })
    const newUser = await user.save()  // DB에 저장
    if(!newUser){
        res.status(401).json({ code:401, message: '유효하지 않은 사용자 정보입니다'})
    }else{
        // 구조분해, 값복사 개념, newUser의 필드이름과 , const 안의 변수이름이 같으면 값이 복사된다
        const { name, phone, userId, isAdmin, createdAt } = newUser // const 중괄호 안에 것들은 어떻게 가져오는거지?
        res.json({
            code: 200,
            token: generateToken(newUser),
            name, phone, userId, isAdmin, createdAt // 위에 const {} 안에 있는 값들을 가져온다
        })
    }
}))
// url에 스페이스바 공백 있으면 안됨
router.post('/login', expressAsyncHandler(async (req, res, next) => {
    console.log('로그인')
    console.log(req.body)
    const loginUser = await User.findOne({  //내장 메서드
        phone: req.body.phone,
        password: req.body.password,
    })
    if(!loginUser){
        res.status(401).json({ code: 401, message:'유효하지 않은 폰번호나 비밀번호 입니다'})
    }else{
        const { name, phone, userId, isAdmin, createdAt } = loginUser // 이건 유저생성때와 같은건가?
        res.json({
            code: 200,
            token: generateToken(loginUser),
            name, phone, userId, isAdmin, createdAt
        })
    }
}))
router.put('/:id', isAuth, expressAsyncHandler(async(req, res, next) => {
    const user = await User.findById(req.params.id)
    if(!user){
        res.status(404).json({ code: 404, message: '사용자가 존재하지 않습니다'})
    }else{
        user.name = req.body.name || user.name
        user.phone = req.body.phone || user.phone
        user.password = req.body.password || user.password
        const updatedUser = await user.save()
        const { name, phone, userId, isAdmin, createdAt } = updatedUser
        res.json({
            code: 200,
            token: generateToken(updatedUser),
            name, phone, userId, isAdmin, createdAt
        })
    }
}))
router.delete('/:id', (req, res, next) => { // 회원탈퇴 처리
    res.json('회원탈퇴 처리')
})

module.exports = router