require('dotenv').config()
const express = require('express')
const res = require('express/lib/response')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

const url = process.env.MONGODB_URI

mongoose.connect(url)

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "045-123455-66"
    },
    {
        id: 3,
        name: "Dan Abranom",
        number: "12-45-2467788"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => { res.json(persons)})
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'please add name and number'})
    }

    const sameNames = persons.filter(person => person.name === body.name)
    if (sameNames.length !== 0) {
        return response.status(400).json({ error: 'name must be unique'})
    }

    Person.save().then(result => {
      console.log('added ', Person.name, ' number ', Person.number, ' to phonebook')
      //mongoose.connection.close()
   })
    response.json(Person)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.get('/info', (req, res) => {
    const info = persons.length
    var time = new Date()
    var text = 'Phonebook has info for ' + info + ' people '+ ' - ' + time
    res.send(text)
  })
  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })