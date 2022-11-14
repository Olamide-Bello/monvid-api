const express = require('express')
const userRouter = require('./routers/user')
const itemRouter = require('./routers/item')
const cartRouter = require('./routers/cart')
require('./db/mongoose')

const port = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(itemRouter)
app.use(cartRouter)


app.get('/', function(req, res, next) {
    res.send("Hello world!");
});
app.listen(port, () => {
    console.log('server listening on port ' + port)
})