const express = require('express')
const path = require('path')
const fs = require('node:fs');

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf-8', (error, data) => {
            if (error) {
                console.error(error)
                return
            }
            const tasks = data.split('\n')
            resolve(tasks)
        })
    })
}

app.get('/', (req, res) => {
    readFile('./tasks')
      .then((tasks) => {
        res.render('index', {tasks: tasks})
    })
})

app.post('/', (req, res) => {
    readFile('./tasks')
      .then((tasks) => {
        tasks.push(req.body.task)
        const data = tasks.join('\n')
        
        fs.writeFile('./tasks', data, err => {
            if (err) {
              console.error(err);
              return
            } else {
              res.redirect('/')
            }
        });

    })
})

app.listen(3001, () => {
    console.log('Server started at http://localhost:3001')
})