const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://ansku:${password}@cluster0.wfno6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
   name: String,
   number: String,
})
  
const Person = mongoose.model('Person', personSchema)

if (process.argv.length<4) {
    console.log('phonebook:')

    mongoose.connect(url)

    Person.find({}).then(persons => { persons.forEach(person => { console.log(person) })

    mongoose.connection.close()
  })

    //process.exit(1)
} else {
    const name = process.argv[3]
    const number = process.argv[4]


    mongoose.connect(url)

    const person = new Person({
       name: name,
       number: number,
    })

    person.save().then(result => {
       console.log('added ', person.name, ' number ', person.number, ' to phonebook')
        mongoose.connection.close()
    })
}
