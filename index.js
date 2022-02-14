const express = require('express')
const res = require('express/lib/response')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

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
    res.json(persons)
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

    const person = {
        id: Math.floor(Math.random() * 50) + 5,
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)
    response.json(person)
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
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })