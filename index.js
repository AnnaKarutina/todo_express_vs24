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
            const tasks = JSON.parse(data)
            resolve(tasks)
        })
    })
}

app.get('/', (req, res) => {
    readFile('./tasks.json')
      .then((tasks) => {
        res.render('index', {tasks: tasks})
    })
})

app.post('/', (req, res) => {
    readFile('./tasks.json')
      .then((tasks) => {
        let index
        if(tasks.length === 0){
            index = 0
        } else {
            index = tasks[tasks.length - 1].id + 1
        }
        const newTask = {
            id: index,
            task: req.body.task
        }
        tasks.push(newTask)
        const data = JSON.stringify(tasks, null, 2)
        
        fs.writeFile('./tasks.json', data, err => {
            if (err) {
              console.error(err);
              return
            } else {
              res.redirect('/')
            }
        });

    })
})

app.get('/delete-task/:taskId', (req, res) => {
    deletedTaskId = parseInt(req.params.taskId)
    readFile('./tasks.json')
        .then((tasks) => {
            tasks.forEach((task, index) => {
               if(task.id === deletedTaskId) {
                tasks.splice(index, 1)
               } 
            });
            const data = JSON.stringify(tasks, null, 2)
        
            fs.writeFile('./tasks.json', data, err => {
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