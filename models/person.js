require('dotenv').config()

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose
	.connect(
		process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch(error => {
		console.log('error connecting to MongoDB:', error.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true,
		unique: true,
		uniqueCaseInsensitive: true
	},
	number: {
		type: String,
		minlength: 8,
		required: true
	}
})
personSchema.plugin(uniqueValidator)
personSchema.set('toJSON', {
	transform (document, returnedObject) {
		const transformedObject = Object.assign({}, returnedObject)
		transformedObject.id = document.id.toString()
		delete transformedObject._id
		delete transformedObject.__v
		return transformedObject
	}
})

module.exports = mongoose.model('Person', personSchema)
