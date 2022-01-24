///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require('dotenv').config()
// pull PORT from .env, give default value of 8000
const { PORT = 8000, DATABASE_URL } = process.env
// const PORT = process.env || 3001
// import express from 'express
const express = require('express')
// create application object 
const app = express()
// import mongoose
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
     size: Number,
     img: String,
 })
 const Sneaker = mongoose.model('Sneaker', SneakerSchema)
  
  ///////////////////////////////
  // MiddleWare
  ////////////////////////////////
  app.use(cors()) // to prevent cors errors, open access to all origins
  app.use(morgan("dev")) // logging
  app.use(express.json()) // parse json bodies
  

  //index route
  app.get("/sneakers", async (req, res) => {
    try {
      // send all people
      res.json(await Sneaker.find({}))
    } catch (error) {
      //send error
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
  