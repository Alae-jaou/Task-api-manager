const express = require('express');
require('./db/mongoose');
const Task = require('./db/models/task');
const User = require('./db/models/user');
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');


const app = express();
const port = process.env.PORT || 3000;

//Automaticly parse incomming json to an object to acccess it in request handlers

// app.use((req,res,next) => {
//     res.status(501).send('Server is unvailable')
// })

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);



app.listen(port , () => {
    console.log('Server set on port : '+port);
});

const multer = require('multer');
const upload = multer({
    dest : 'images'
});

app.post('/upload', upload.single('upload') ,(req,res) => { 
    res.send()
}) 