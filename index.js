import express from 'express'
import mongoose from 'mongoose'

import { registerValidator } from './validations/auth.js'

import * as PostController from './controllers/PostController.js'
import { getMe, login, register } from './controllers/UserController.js'
import checkAuth from './utils/checkAuth.js'
import { loginValidator } from './validations/login.js'
import { postCreateValidator } from './validations/post.js'

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

app.post('/auth/login', loginValidator, login)

app.post('/auth/register', registerValidator, register)

app.get('/auth/me', checkAuth, getMe)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidator, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, PostController.update)

app.listen('4444', err => {
	if (err) {
		return console.log(err)
	}

	console.log('server OK')
})
