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

app.get('/api/persons/:id', (request, response) => {
	const selectedPerson = persons.find(person => person.id === Number(request.params.id))
	if (!selectedPerson) {
		response.status(404).end()
		return
	}

	response.json(selectedPerson)
})

app.delete('/api/persons/:id', (request, response) => {
	const selectedPerson = persons.find(person => person.id === Number(request.params.id))
	if (!selectedPerson) {
		response.status(404).end()
		return
	}

	persons = persons.filter(person => person.id !== Number(request.params.id))
	response.status(204).end()
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

app.get('/info', (request, response) => {
	const date = new Date()
	response.send(`
	Phonebook has info for ${persons.length} people
	${date.toDateString()} ${date.toTimeString()}
	`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
