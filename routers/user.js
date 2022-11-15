const express = require('express')
const User = require('../models/user')
const Auth = require('../middleware/auth')
const router = new express.Router()


//signup
router.post('/signup', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }

})

//login

router.post('/login', async (req, res) => {
    await testLogin(req, res);
})

//logout
router.post('/users/logout', Auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//Logout All 
router.post('/users/logoutAll', Auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})


async function testLogin(req, res){
    try {
        const { email, password } = req.body;
        console.log("got here: ", req.body)
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
}
module.exports = router