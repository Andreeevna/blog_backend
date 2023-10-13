import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

mongoose
	.connect(
		'mongodb+srv://sandreeevna:Lana199881@cluster0.u02m9me.mongodb.net/?retryWrites=true&w=majority'
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

app.post('/auth/login', (req, res) => {
	console.log(req.body)
	const token = jwt.sign(
		{
			email: req.body.email,
		},
		'secret123'
	)

	res.json({
		success: true,
		token,
	})
})

app.listen('4444', err => {
	if (err) {
		return console.log(err)
	}

	console.log('server OK')
})
