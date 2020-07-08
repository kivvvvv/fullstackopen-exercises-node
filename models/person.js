require('dotenv').config()

const mongoose = require('mongoose')
mongoose
	.connect(
		process.env.MONGO_URI, {
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
	name: String,
	number: String
})
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
