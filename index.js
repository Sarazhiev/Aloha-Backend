import express from 'express'
import multer from 'multer'
import cors from 'cors'

import mongoose from 'mongoose'
import {
    registerValidation,
    loginValidation,
    clothesCreateValidation
} from './validations/validations.js'
import checkAuth from "./utils/checkAuth.js";
import {
    register,
    getMe,
    login,
    getAllUser,
    handleFavorites,
    handleOrders,
    getAllOrders, handleStatus
} from './controllers/UserController.js'
import {create, getAll,getOne, remove, update} from './controllers/ClothesController.js'
import handleValidatorErrors from "./utils/handleValidatorErrors.js";

mongoose.connect('mongodb+srv://aloha:aloha3134@cluster0.gqhxp.mongodb.net/aloha?retryWrites=true&w=majority')
    .then(() => console.log('Mongo DB успешно запущен'))
    .catch((err) =>  console.log('Ошибка при запуске Mongo DB ' ,err))


const server = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null,'uploads')
    },
    filename: (_, file, cb) => {
        cb(null,file.originalname)
    }
});

const upload = multer({storage})

server.use(express.json())
server.use(cors())
server.use('/uploads', express.static('uploads'))


const PORT = 4444


server.post('/auth/login', loginValidation,handleValidatorErrors, login)
server.post('/auth/register', registerValidation,handleValidatorErrors,  register )
server.patch('/users/favorites/:id', handleFavorites)
server.get('/auth/me', checkAuth ,getMe )
server.get('/users', getAllUser)
server.patch('/users/:id', handleOrders)
server.patch('/users/status/:id', handleStatus)
server.get('/orders', getAllOrders)

server.post('/upload',  upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

server.get('/clothes', getAll )
server.get('/clothes/:id', getOne )
server.delete('/clothes/:id', remove )
server.patch('/clothes/:id', clothesCreateValidation, handleValidatorErrors,   update )
server.post('/clothes', clothesCreateValidation, handleValidatorErrors, create )

server.listen(PORT, (err) => {
    if (err){
       return  console.log('Произошла ошибка', err)
    }
    console.log(`Сервер запущен на порту ${PORT}`)
})