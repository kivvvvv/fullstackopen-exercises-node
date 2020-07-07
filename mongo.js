const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('Please provide the password as an argument: node mongo.js <password>')
	process.exit(1)
}

const password = process.argv[2]
const uri = `mongodb+srv://fullstack:${password}@cluster0.wr8sr.mongodb.net/phonebook?retryWrites=true`
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
	id: Number,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
	console.log('phonebook:')
	Person
		.find({})
		.then(result => {
			result.forEach(person => {
				console.log(`${person.name} ${person.number}`)
			})
			mongoose.connection.close()
		})
	return
}

if (process.argv.length === 5) {
	const name = process.argv[3]
	const number = process.argv[4]
	const person = new Person({
		name,
		number,
		id: Math.round(Math.random() * 1000)
	})

	person.save().then(result => {
		console.log(`added ${result.name} number ${result.number} to phonebook`)
		mongoose.connection.close()
	})
}
