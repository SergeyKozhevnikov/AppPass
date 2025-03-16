import config from 'dotenv/config'
import express from 'express'
import sequelize from './db.js'
import * as db from './orm.js'
import path from 'path'

const __dirname = path.resolve(path.dirname(""))

const PORT = process.env.PORT || 3000

sequelize.authenticate()
    .catch(error => console.error(error))

//db.sync({alter:true})
sequelize.sync()

const app = express()

app.set("view engine", "hbs")
app.use('/js', express.static(__dirname+'/js'))
app.use('/html', express.static(__dirname+'/html'))

app.get('/passes/:user', async function(req, res){
    const userid = await db.User.findOne({where:{id: req.params["user"]}})
    const profiles = await db.Profile.findOne({where:{id: userid.toJSON()['profileid']}})
    console.log(profiles.toJSON())
    await db.Pass.findAll({where:{userid: req.params["user"]}, raw: true})
    .then(results => res.render(__dirname+'/html/page.hbs', 
        {prof: profiles.toJSON(), passes: results}))
})

app.get('/api/:user', async function(req, res) {
    await db.Pass.findAll({where:{userid: req.params["user"]}, raw: true})
    .then(results => res.send(results))
})

 app.use((req, res, next) => {
    res.sendStatus(404)
 })

app.listen(PORT, () => console.log(`Сервер запущен на localhost:${PORT}`))

