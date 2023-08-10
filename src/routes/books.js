const express = require('express')
const Book = require('../models/Book')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')

const mongoose = require('mongoose')
const { Types: { ObjectId }} = mongoose

const router = express.Router()

// 현재 사용자의 도서목록에 특정 도서 추가
router.post('/', isAuth, expressAsyncHandler(async(req, res, next) => {
    const searchedBook = await Book.findOne({
        user: req.user._id,
        title: req.body.title,
    })
    if(searchedBook){
        res.status(204).json({ code: 204, message: '이미 추가되어 있습니다'})
        console.log('이미 추가되어 있습니다')
    }else{
        const book = new Book({
            user: req.user._id,
            title: req.body.title,
            category: req.body.category,
            imgUrl: req.body.imgUrl,
        })
        const newBook = await book.save()
        if(!newBook){
            res.status(401).json({ code: 401, message: '도서 생성에 실패하였습니다'})
            console.log('도서 생성에 실패하였습니다')

        }else{
            res.status(201).json({
                code: 201,
                message: '새로운 도서가 추가되었습니다',
                newBook,
            })
            console.log('새로운 도서가 추가되었습니다')
        }
    }
}))

//현재 사용자의 전체 도서목록 조회
router.get('/', isAuth, expressAsyncHandler(async(req, res, next) => {
    const books = await Book.find({ user: req.user._id}).populate('user')
    if(books.length === 0){
        res.status(404).json({ code: 404, message: '도서를 찾을 수 없습니다'})
        console.log('도서를 찾을 수 없습니다')
    }else{
        res.json({code: 200, books})
    }
}))

// 특정 도서 조회하기
router.get('/:id', isAuth, expressAsyncHandler(async(req, res, next) => {
    const book = await Book.findOne({
        user: req.user._id, // isAuth에서 전달된 값
        _id: req.params.id //  BOOK ID
    })
    if(!book){
        res.status(404).json({ code: 404, message: '도서가 존재하지 않습니다'})
    }else{
        res.json({code: 200, message:'도서를 찾았습니다.', book})
        console.log('도서를 찾았습니다.')
    }
}))
// 특정 도서 변경하기
router.put('/:id', isAuth, expressAsyncHandler(async(req, res, next) => {
    const book = await Book.findOne({
        user: req.user._id, // isAuth에서 전달된 값
        _id: req.params.id // BOOK ID
    })
    if(!book){
        res.status(404).json({ code: 404, message: '도서가 존재하지 않습니다'})
    }else{
        book.title = req.body.title || book.title
        book.category = req.body.category || book.category
        book.isBooked = req.body.isBooked || book.isBooked
        book.imgUrl = req.body.imgUrl || book.imgUrl
        book.lastModifiedAt = new Date()
        book.finishedAt = book.isBooked ? book.lastModifiedAt : book.finishedAt

        const updatedBook = await book.save()
        res.status(200).json({
            code: 200,
            message: '도서정보가 변경되었습니다',
            updatedBook,
        })
        console.log('도서정보가 변경되었습니다')
    }
}))
router.delete('/:id', isAuth, expressAsyncHandler(async(req, res, next) => {
    const book = await Book.findOne({
        user: req.user._id,
        _id: req.params.id,
    })
    if(!book){
        res.status(404).json({ code: 404, message: '도서가 존재하지 않습니다'})
    }else{
        await Book.deleteOne({
            user: req.user._id,
            _id: req.params.id,
        })
        res.status(204).json({ code: 204, message: '도서가 삭제되었습니다'})
        console.log('도서가 삭제되었습니다')
    }
}))

/* 그룹핑 - 시작 */

// 관리자 대쉬보드
router.get('/group/:field', isAuth, expressAsyncHandler(async(req, res, next) => {
    if(!req.user.isAdmin){
        res.status(401).json({ code: 401, message:'관리자 권한이 없습니다' })
        console.log('관리자 권한이 없습니다')
    }else{
        const docs = await Book.aggregate([
            {
                $group:{
                    _id: `$${req.params.field}`,
                    count: { $sum: 1}
                }
            }
        ])
        console.log(`그룹의 갯수: ${docs.length}`)
        docs.sort((d1, d2) => d1._id - d2._id)
        res.json({ code:200, message:'그룹화 되었습니다', docs})
        console.log('그룹화 되었습니다')
    }
}))
// 이용자 대쉬보드
router.get('/group/mine/:field', isAuth, expressAsyncHandler(async(req, res, next) => {
    const docs = await Book.aggregate([
        {
            $match: { user: new ObjectId(req.user._id)}
        },
        {
            $group: {
                _id: `$${req.params.field}`,
                count: { $sum: 1 }
            }
        }
    ])
    console.log(`그룹의 갯수: ${docs.length}`)
    docs.sort((d1, d2) => d1._id - d2._id)
    res.json({ code:200, message:'그룹화 되었습니다', docs})
    console.log('그룹화 되었습니다')
}))
router.get('/group/date/:field', isAuth, expressAsyncHandler(async(req, res, next) => {
    if(!req.user.isAdmin){
        res.status(401).json({ code: 401, message:'관리자 권한이 없습니다' })
        console.log('관리자 권한이 없습니다')
    }else{
        if(req.params.field === 'createdAt' || req.params.field === 'lastModifiedAt' || req.params.field === 'finishedAt'){
            const docs = await Book.aggregate([
                {
                    $group: {
                        _id: {  year: { $year: `$${req.params.field}`}, month: { $month: `$${req.params.field}`},
                        count: { $sum: 1 }
                        }
                    }
                }   
            ])
            console.log(`그룹의 갯수: ${docs.length}`)
            docs.sort((d1, d2) => d1._id - d2._id)
            res.json({ code:200, message:'그룹화 되었습니다', docs})
            console.log('그룹화 되었습니다')
        }else{
            res.status(204).json({ code: 204, messgage: '콘텐츠가 없습니다'})
            console.log('콘텐츠가 없습니다')
        }
    }
}))
router.get('/group/mine/date/:field', isAuth, expressAsyncHandler(async(req, res, next) => {
    if(req.params.field === 'createdAt' || req.params.field === 'lastModifiedAt' || req.params.field === 'finishedAt'){
        const docs = await Book.aggregate([
            {
                $group: {
                    _id: {  year: { $year: `$${req.params.field}`}, month: { $month: `$${req.params.field}`},
                    count: { $sum: 1 }
                    }
                }
            }   
        ])
        console.log(`그룹의 갯수: ${docs.length}`)
        docs.sort((d1, d2) => d1._id - d2._id)
        res.json({ code:200, message:'그룹화 되었습니다', docs})
        console.log('그룹화 되었습니다')
    }else{
        res.status(204).json({ code: 204, messgage: '콘텐츠가 없습니다'})
        console.log('콘텐츠가 없습니다')
    }
    
} ))
/* 그룹핑 - 끝 */

module.exports = router