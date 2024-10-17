const express = require("express")
const app = express()
const usersRouter = require("../routes/users")
const fruitRouter = require("../routes/fruits")

app.use(express.json())
app.use(usersRouter)
app.use(fruitRouter)

module.exports = app;