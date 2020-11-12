const express = require('express');
const User = require('../db/models/user');
const auth = require('../middlware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail  , sendGoodByEmail} = require('../emails/account');

const router = new express.Router();

// post users
router.post('/users' , async (req , res) => {
    const user = new User(req.body);
    // user.save().then(()=> {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e);
    // })
    try {
        await user.save();
        sendWelcomeEmail(user.email , user.name)
        const token = await user.generateAuthToken();
        res.status(201).send({user , token});
    } catch (error) {
        res.status(400).send(error);
    }
    
})

router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        
        res.send({user , token})
    } catch (error) {
           res.status(400).send(error)
    }
})

// logout from current user
router.post('/users/logout' , auth , async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e)
    }
})

// logout from all devices
router.post('/users/logoutAll',auth , async (req,res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send()   
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/users/me' ,auth ,async (req , res) => {
    res.send(req.user)
    
})


router.delete('/users/me' , auth,async (req,res) => {
    try {
        const a = await req.user.remove()
        sendGoodByEmail(req.user.email , req.user.name)
        res.send(req.user);   
    } catch (error) {
        res.status(500).send('amina');
    }
});


//patch data 
router.patch('/users/me' ,auth ,async (req , res) => {
    const userUpdates = Object.keys(req.body);
    const allowedData = ['name' , 'age' , 'email' , 'password']
    const isAllowed = userUpdates.every((field) => allowedData.includes(field) );
    if (!isAllowed) {
        return res.status(404).send('Invalid updates !');
    }
    
    try {
        // const user =  await User.findByIdAndUpdate(req.params.id , req.body , {new : true , runValidators : true})
        
        userUpdates.forEach((update) => req.user[update] = req.body[update])
        
        await req.user.save()
        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
})

// setting images
const upload = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter(req, file, cb) {
        if ( !file.originalname.match(/\.(jpg|jpeg,png)$/)) {
            return cb(new Error('Please upload an image')) 
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth,  upload.single('avatar') ,async (req,res) => {
    // req.user.avatar = req.file.buffer
    const buffer = await sharp(req.file.buffer).resize({width:250 , height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error , req, res, next) => {
    res.status(400).send({error : error.message})
});

router.delete('/users/me/avatar' , auth , upload.single('avatar'),async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req,res,next) => {
    res.status(400).send({error : error.message})
});

router.get('/users/:id/avatar', async (req,res) => {
    
    try {
        const user = await User.findById(req.params.id)
        if (!user || ! user.avatar) {
            throw new Error('Error')
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    } catch (error) {
        res.status(400).send()
    }
})

module.exports = router