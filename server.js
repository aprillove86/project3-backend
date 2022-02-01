///////////////////////////////
// DEPENDENCIES
////////////////////////////////
require('dotenv').config()
// pull PORT from .env, give default value of 8000
const { PORT = 8000, DATABASE_URL } = process.env
const express = require('express')
const app = express()
const sneakerSeed = require('./sneakers')
const mongoose = require('mongoose')
const cors = require("cors")
const morgan = require("morgan")

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(DATABASE_URL)
// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to MongoDB"))
  .on("close", () => console.log("You are disconnected from MongoDB"))
  .on("error", (error) => console.log(error))

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route 
app.get('/', (req,res) => {
    res.send('hello world')
})
 //Model
 const SneakerSchema = new mongoose.Schema({
     name: String, 
     brand: String,
     size: String,
     img: String,
 })
 const Sneaker = mongoose.model('Sneaker', SneakerSchema)
  
  ///////////////////////////////
  // MiddleWare
  ////////////////////////////////
  app.use(cors()) // to prevent cors errors, open access to all origins
  app.use(morgan("dev")) // logging
  app.use(express.json()) // parse json bodies
  

  //seed route
  app.get('/sneakers/seed', async (req, res) => {
    await Sneaker.deleteMany({}) //deleted everything in the database
    await Sneaker.create(sneakerSeed); //created new data from the seed data above. 
    res.redirect('/sneakers')
    })


  //index route
  app.get("/sneakers", async (req, res) => {
    try {
            res.json(await Sneaker.find({}))
    } catch (error) {
          res.status(400).json(error)
    }
  })

  //create route
  app.post('/sneakers', async (req, res) => {
      try {
          res.json(await Sneaker.create(req.body))
      } catch (error) {
          res.status(400).json(error)
      }
  })
   //delete route
   app.delete('/sneakers/:id', async (req, res) => {
       try {
           res.json(await Sneaker.findByIdAndDelete(req.params.id))
       } catch (error) {
           res.status(400).json(error)
       }
   })
   //update route
   app.put('/sneakers/:id', async (req, res) => {
       try {
           res.json(
               await Sneaker.findByIdAndUpdate(req.params.id, req.body,
            { new: true })
        )} catch (error) {
            res.status(400).json(error)
        }
    })

    app.listen(PORT, () => console.log(`hallelujah holla back ${PORT}`))
  