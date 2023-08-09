const express = require('express')
const Book = require('../models/Book')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')

const router = express.Router()

//현재 사용자의 전체 도서목록 조회
router.get('/', (req, res, next) => {
    res.json('현재 사용자의 전체 도서목록 조회')
})
router.post('/', (req, res, next) => {
    res.json('현재 사용자의 도서목록에 특정 도서 추가')
})
router.get('/:id', (req, res, next) => {
    res.json(' 현재 사용자의 특정 도서 조회')
})
router.put('/:id', (req, res, next) => {
    res.json('현재 사용자의 특정 도서내용 변경')
})
router.delete('/:id', (req, res, next) => {
    res.json(' 현재 사용자의 특정 도서 삭제')
})

module.exports = router