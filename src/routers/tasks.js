const express = require('express');
const Task = require('../db/models/task');
const auth = require('../middlware/auth');
const router = express.Router();

// post tasks
router.post('/tasks' , auth ,async (req , res) => {
    //const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);
    } catch {
        res.status(500).send()
    }
   
});

// GET/tasks?sortBy=createdAt:desc
router.get('/tasks', auth , async (req , res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    
    try {
        // const tasks = await Task.find({owner : req.user._id});
        await req.user.populate({
            path:'tasks',
            match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
                } 
            }
        ).execPopulate();
        res.send(req.user.tasks);
    } catch(e) {
        res.status(500).send({e});
    }
});

router.get('/tasks/:id' ,auth ,async (req , res) => {
    
    const _id = req.params.id;
    try {
        const tasks = await Task.findOne({_id , owner : req.user._id});
        if (!tasks) {
            return res.status(404).send('No result have been found');
        }
        res.send(tasks);
    } catch {
        res.status(500).send()
    }
})

router.delete('/tasks/:id', auth , async (req,res) => {
    try {
        const tasks = await Task.findOneAndRemove({_id : req.params.id , owner : req.user._id});
        if(!tasks) {
            return res.status(404).send();
        }
        res.send(tasks);   
    } catch (error) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id',auth , async (req, res) => {
    const allowedFields = ['description' , 'completed'];
    const userInput = Object.keys(req.body);
    const isAllowed = userInput.every((field) => allowedFields.includes(field));
    if (!isAllowed) {
        return res.status(400).send({error : 'Invaluide Ipdates' })
    }
    
    try {
        // const task = await Task.findByIdAndUpdate(req.params.id , req.body , {new : true , runValidators : true});
        const task = await Task.findOne({_id : req.params.id , owner : req.user._id});
        console.log(task)
        if (!task) {
            return res.status(404).send()
        }
        allowedFields.forEach((update) => task[update] = req.body[update] );
        await task.save()
        
        res.send(task)    
    } catch (error) {
        res.status(500).send(error);
    } 
});


module.exports = router