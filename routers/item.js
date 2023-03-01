const express = require('express')
const Item = require('../models/item')
const Auth = require('../middleware/auth')

const router = new express.Router()

//fetch all items
router.get('/items', async(req, res) => {
    try {
        const items = await Item.find({})
        res.status(200).json(items)
    } catch (error) {
        res.status(400).send(error)
    }
})

//fetch an item by id
router.get('/items/:id', async(req, res) => {
    try{
        const item = await Item.findOne({_id: req.params.id})
        if(!item) {
            res.status(404).send({error: "Item not found"})
        }
        res.status(200).send(item) 
    } catch (error) {
        res.status(400).send(error)
    }
})

//fetch items by category
router.get('/category/', async(req, res) => {
    console.log("got here")
    const category = req.query.catName
    const queryRegx = new RegExp(req.query.catName, 'i')
    console.log(category)
    try{
        const item = await Item.find({category: { $regex: queryRegx }})
        if(!item) {
            res.status(404).send({error: "No item in this category"})
        }
        res.status(200).send(item) 
    } catch (error) {
        res.status(400).send(error)
    }
})

//fetch an item by string
router.get('/search/:query', async(req, res) => {
    console.log("query got here")
    const queryRegx = new RegExp(req.params.query, 'i')
    try{
        const itemList = await Item.find({
            $or: [
              { brand: { $regex: queryRegx } },
              { name: { $regex: queryRegx } },
              { description: { $regex: queryRegx } },
              { category: { $regex: queryRegx } },
            ],
        })
        if (itemList.length === 0) {
            return res.status(404).json({error: 'No matched item'})
        }
        res.status(200).send(itemList)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

//create an item
router.post('/items',Auth, async(req, res) => {
    try {
        const newItem = new Item({
            ...req.body,
            owner: req.user._id
        })
        console.log(newItem)
        await newItem.save()
        res.status(201).send(newItem)
    } catch (error) {
        console.log({error})
        res.status(400).send({message: "error"})
    }
})

//update an item

router.patch('/items/:id', Auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description', 'category', 'price']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'invalid updates'})
    }

    try {
        const item = await Item.findOne({ _id: req.params.id})
    
        if(!item){
            return res.status(404).send()
        }

        updates.forEach((update) => item[update] = req.body[update])
        await item.save()
        res.send(item)
    } catch (error) {
        res.status(400).send(error)
    }
})

//delete item
router.delete('/items/:id', Auth, async(req, res) => {
    try {
        const deletedItem = await Item.findOneAndDelete( {_id: req.params.id} )
        if(!deletedItem) {
            res.status(404).send({error: "Item not found"})
        }
        res.send(deletedItem)
    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports = router