const express = require('express')
const router = new express.Router()
const auth = require('../middlewares/auth')
const User = require('../models/user')
const jsonpatch = require('jsonpatch')
const Jimp = require('jimp')
const inputValidation = require('../middlewares/inputValidation')
const schemas = require('./schemas')



router.post('/auth/login',inputValidation(schemas.login, 'body'), async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.userName, req.body.password)
        if(user){
            const token = await user.generateAuthToken()
            res.send({ token })
        } else {
            const user = new User(req.body)
            console.log(user)
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({ token })
        }
        
    } catch (error) {
        res.status(400).send("Internal Server error")
    }
})

router.post('/jsonpatch',inputValidation(schemas.jsonpatch,'body'), auth, async (req,res)=>{
    try {
        const json = req.body.json
        const patch = req.body.patch
        patched_json = jsonpatch.apply_patch(json,[patch]);
        res.send(patched_json)
    } catch (error) {
        res.status(500).send("Internal Server error")
    }
})

router.get('/thumbnail',inputValidation(schemas.query,'query'), auth, async (req,res)=>{
    try {
        const uri = req.query.url
        Jimp.read(uri, function(err,img){
            if (err) throw err;
            img.resize(50, 50).getBase64( Jimp.AUTO , function(e,img64){
                if(e)throw e
                res.send('<img src="'+img64+'">')
            })
        })
        
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
})

router.patch('/address', auth, async (req,res)=>{
    try {
        req.user.address = req.body.address
        await req.user.save()
        return res.status(201).send("Address added successfully")
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router