import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'

import { registerValidator } from './validations/auth.js'

import * as PostController from './controllers/PostController.js'
import { getMe, login, register } from './controllers/UserController.js'
import checkAuth from './utils/checkAuth.js'
import handleValidationErr from './utils/handleValidationErr.js'
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

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
	res.send('Hello, world')
})

app.post('/auth/login', loginValidator, handleValidationErr, login)

app.post('/auth/register', registerValidator, handleValidationErr, register)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.get('/auth/me', checkAuth, getMe)

app.get('/tags', PostController.getLastTags)
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post(
	'/posts',
	checkAuth,
	postCreateValidator,
	handleValidationErr,
	PostController.create
)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch(
	'/posts/:id',
	checkAuth,
	postCreateValidator,
	handleValidationErr,
	PostController.update
)

app.listen('4444', err => {
	if (err) {
		return console.log(err)
	}

	console.log('server OK')
})
