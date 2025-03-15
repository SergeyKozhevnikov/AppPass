import config from 'dotenv/config'
import express from 'express'
import sequelize from './db.js'
import * as db from './orm.js'
import { json } from 'sequelize'
import path from 'path'


const __dirname = path.resolve(path.dirname(""))

const PORT = process.env.PORT || 3000

sequelize.authenticate()
    .catch(error => console.error(error))

//db.sync({alter:true})
sequelize.sync()

const app = express()
app.use('/html', express.static(__dirname+'/html'))

app.get('/1', (req, res) => {
    const user = db.Pass.findAll({where:{userid: "1"}})
    .then(users=>{res.send(users)})
    console.log(user)
})

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/html/page.html')
 })

 app.use((req, res, next) => {
    res.sendStatus(404)
 })

app.listen(PORT, () => console.log(`Сервер запущен на localhost:${PORT}`))

