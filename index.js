import express from 'express'
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

app.post('/auth/register', (req, res) => {})

app.listen('4444', err => {
	if (err) {
		return console.log(err)
	}

	console.log('server OK')
})
