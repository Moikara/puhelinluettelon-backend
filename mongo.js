const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://phonebook:${password}@cluster0.mvhbltp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[3] && process.argv[4]) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person ({
        name,
        number
    })

    person.save().then(result => {
        console.log('note saved!', result)
        mongoose.connection.close()
      })
} else {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
}