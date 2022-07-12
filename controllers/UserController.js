
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import ClothesModel from "../models/Clothes.js";
import {update} from "./ClothesController.js";


export const register = async (req, res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            phone: req.body.phone,
            login : req.body.login,
            favorites: req.body.favorites,
            orders: req.body.orders,
            passwordHash : hash
        })

        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id
        }, 'secret123' , {expiresIn: '90d'})

        const { passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})

        if (!user) {
            return res.status(404).json({
                message: 'Такого аккаунта не существует'
            })
        }

        const inValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!inValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль '
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, 'secret123' , {expiresIn: '30d'})

        const { passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось войти'
        })
    }
}


export const getMe = async (req,res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if (!user){
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        const { passwordHash, ...userData} = user._doc
        res.json(userData)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
}


export const getAllUser = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить все  статьи'
        })
    }
}


export const getAllOrders = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users.map((item) =>  item.orders).filter(item => item.length).flat())
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить все  статьи'
        })
    }
}


export const handleFavorites = async (req, res) => {
    try {
        const userId = req.params.id

        console.log(userId)

        UserModel.findByIdAndUpdate({
            _id: userId
        },  {
            favorites: req.body.favorites,
        }, {
            returnDocument: 'after',
        }, (err, doc) => {
            if (err) {
                console.log(err)
                return  res.status(500).json({
                    message: 'Не удалось добавить в избранное'
                })
            }
            if (!doc) {
                return res.status(404).json({
                    message: 'Юзер не найден'
                })
            }
            res.json(doc)
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось добавить в избранное'
        })
    }
}




export const handleOrders = async (req, res) => {
    try {
        const userId = req.params.id

        const user = await UserModel.findById({_id: userId})

        UserModel.findByIdAndUpdate({
            _id: userId
        },  {
            orders: [...user.orders, req.body],
        }, {
            returnDocument: 'after',
        }, (err, doc) => {
            if (err) {
                console.log(err)
                return  res.status(500).json({
                    message: 'Не удалось совершить покупку'
                })
            }
            if (!doc) {
                return res.status(404).json({
                    message: 'Юзер не найден'
                })
            }
            res.json(doc)
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось совершить покупку'
        })
    }
}

export const handleStatus = async (req, res) => {
    try {
        const userId = req.params.id

        const user = await UserModel.findById({_id: userId})

        UserModel.findByIdAndUpdate({
            _id: userId
        },  {
            orders: user.orders.map((item) => {
                if (item.number === req.body.number){
                    return {...item, status: req.body.status}
                } else {
                    return item
                }
            } ),
        }, {
            returnDocument: 'after',
        }, (err, doc) => {
            if (err) {
                console.log(err)
                return  res.status(500).json({
                    message: 'Не удалось подтвердить покупку'
                })
            }
            if (!doc) {
                return res.status(404).json({
                    message: 'Юзер не найден'
                })
            }
            res.json(doc)
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось подтвердить покупку'
        })
    }
}
