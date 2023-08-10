// 더미데이터 만들기

const mongoose = require('mongoose')
const User = require('./src/models/User')
const Book = require('./src/models/Book')
const config = require('./config')

const category = ['컴퓨터', '역사', '수필', '자유', '소설', '다큐', '인문', '경제경영']
const done = [true, false]
let users = []

mongoose.connect(config.MONGODB_URL)
.then(() => console.log("mongodb connected ..."))
.catch(e => console.log(`failed to connect mongodb: ${e}`))

// 랜덤 한글 생성
const generateRandomHangle = n => {
    const hangle = ["가", "나", "다", "라", "마", "바", "사", "아","자","차","카","타","파","하",
    "간", "난", "단", "란", "만", "반", "산", "안","잔","찬","칸","탄","판","한" ]
    const str = new Array(n).fill('가')
    return str.map(s => hangle[Math.floor(Math.random()*hangle.length)]).join("")
}

// 랜덤 알파벳 생성
const generateRandomAlphabet = n => {
    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    const str = new Array(n).fill('a')
    return str.map(s => alphabet[Math.floor(Math.random()*alphabet.length)]).join("")
  }

// 랜덤넘버 생성
const generateRandomNumber = n => {
    const number = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    const str = new Array(n).fill('1')
    return str.map(s => number[Math.floor(Math.random()*number.length)]).join("")
}

// 배열에서 랜덤값 선택
const selectRandomValue = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

// 랜덤날짜 생성
const generateRandomDate = (from, to) => {
    return new Date(
        from.getTime() + Math.random() * (to.getTime() - from.getTime())
    )
}


// user 데이터 생성 테스트
const createUsers = async(n, users) => {
    console.log('사용자가 추가되었습니다')
    for(let i =0; i < n; i++){
        const user = new User({
            name: generateRandomHangle(3),
            phone : `010-${generateRandomNumber(4)}-${generateRandomNumber(4)}`,
            userId: generateRandomAlphabet(8),
            password: generateRandomAlphabet(9),
        })
          users.push(await user.save()) 
    }
    return users
}

// books 데이터 생성

const createBooks = async(n, user) => {
    console.log(`${user.name}이 도서를 추가하였습니다`)
    for(let i = 0; i < n; i++){
        const book = new Book({
            user: user._id,
            title: generateRandomHangle(8),
            category: selectRandomValue(category),
            imgUrl: `https://www.${generateRandomAlphabet(8)}.com/${generateRandomAlphabet(10).png}`,
            isBooked: selectRandomValue(done),
            createdAt: generateRandomDate(new Date(2023,6,14), new Date()),
            lastModifiedAt: generateRandomDate(new Date(2023,6,14), new Date()),
            finishedAt: generateRandomDate(new Date(2023,6,14), new Date()),
        })
        await book.save()
    }
}

// 사용자와 해당 사용자의 책들을 순서대로 생성함
const buildData = async(users) => {
    users = await createUsers(7, users)
    users.forEach(user => createBooks(30, user))
}

// 데이터 생성
buildData(users)
