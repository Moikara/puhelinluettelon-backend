const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' },
]

const getId = () => {
    return Math.floor(Math.random() * 1000);
}

app.get('/info', (request, response) => {
    const amountOfEntries = persons.length
    const timeStamp = new Date().toString();
    response.send(`Phonebook has info for ${amountOfEntries} people ${timeStamp}`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        return response.json(person)
    }

    return response.status(404).end()
})

app.post('/api/persons', (request, response) => {
    const name = request.body.name
    const number = request.body.number

    if (!name || !number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    if (persons.findIndex(person => person.name === name) > -1) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const id = getId()
    const newPerson = { id, name, number }

    persons = persons.concat(newPerson)
    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})