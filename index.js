import bcrypt from 'bcrypt'
import express from 'express'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

import { registerValidator } from './validations/auth.js'

import UserModel from './models/User.js'

mongoose
	.connect(
		'mongodb+srv://sandreeevna:Lana199881@cluster0.u02m9me.mongodb.net/blog?retryWrites=true&w=majority'
	)
	.then(() => {
		console.log('db OK')
	})
	.catch(err => console.log('db err', err))

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
	res.send('Hello, world')
})

app.post('/auth/login', async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}

		const isValidPass = await bcrypt.compare(
			req.body.passwordHash,
			user._doc.passwordHash
		)

		if (!isValidPass) {
			return res.status(400).json({
				message: 'Неверный логин или пароль',
			})
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc

		res.json({
			...userData,
			token,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось авторизоваться',
		})
	}
})

app.post('/auth/register', registerValidator, async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		const password = req.body.passwordHash
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new UserModel({
			fullName: req.body.fullName,
			email: req.body.email,
			passwordHash: hash,
			avatarUrl: req.body.avatarUrl,
		})

		const user = await doc.save() // сохраняем в bd

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc

		res.json({
			...userData,
			token,
		})
	} catch (error) {
		console.log(error)

		res.status(500).json({
			message: 'Не удалось зарегистрироваться',
		})
	}
})

app.listen('4444', err => {
	if (err) {
		return console.log(err)
	}

	console.log('server OK')
})
