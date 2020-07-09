const express = require('express')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())

const morgan = require('morgan')
morgan.token('body', request => JSON.stringify(request.body))
app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.use(express.static('build'))

let persons = [
	{
		name: 'Arto Hellas',
		number: '040-123456',
		id: 1
	},
	{
		name: 'Ada Lovelace',
		number: '39-44-5323523',
		id: 2
	},
	{
		name: 'Dan Abramov',
		number: '12-43-234345',
		id: 3
	},
	{
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
		id: 4
	}
]

app.get('/api/persons', (request, response) => {
	Person.find({})
		.then(result => {
			response.json(result)
		})
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(result => {
			if (!result) {
				response.status(404).end()
				return
			}

			response.json(result)
		})
		.catch(next)
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end()
		})
		.catch(error => {
			next(error)
		})
})

app.put('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndUpdate(
		request.params.id,
		{
			number: request.body.number
		},
		{
			new: true
		}
	)
		.then(result => {
			response.json(result)
		})
		.catch(next)
})

app.post('/api/persons', (request, response) => {
	const body = request.body
	if (!body || !body.name || !body.number) {
		return response.status(404).json({
			error: 'wrong body format'
		})
	}

	if (persons.some(person => person.name === body.name)) {
		return response.status(409).json({
			error: 'name must be unique'
		})
	}

	const newPerson = new Person({
		name: body.name,
		number: body.number,
	})
	newPerson.save()
		.then(result => {
			console.log(`added ${result.name} number ${result.number} to phonebook`)
			response.json(result)
		})
})

app.get('/info', (request, response, next) => {
	const date = new Date()
	Person.find({})
		.then(result => {
			response.send(`
				Phonebook has info for ${result.length} people
				${date.toDateString()} ${date.toTimeString()}
			`)
		})
		.catch(next)
})

app.use((error, request, response, next) => {
	if (error.name === 'CastError') {
		response.status(400).send({
			error: 'malformatted id'
		})
		return
	}

	next(error)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
