const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const userRouter = require('./routers/user')
const itemRouter = require('./routers/item')
const cartRouter = require('./routers/cart')
const cors = require('cors');
require('./db/mongoose')

const port = process.env.PORT || 5000

const app = express()
app.use(cors({
    origin: 'http://localhost:3001'
}));

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', userRouter);
app.use('/item', itemRouter)
app.use(cartRouter)


app.get('/', function(req, res, next) {
    res.send("Hello world!");
});
app.listen(port, () => {
    console.log('server listening on port ' + port)
})