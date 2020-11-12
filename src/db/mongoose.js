const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL , {
    useNewUrlParser : true ,
    useUnifiedTopology: true,
    useFindAndModify : false
}).then((e)=> console.log('connected')).catch(()=> console.log('error'));

//================================================================================================




// task.save().then(() => console.log(task))
// .catch((e) => console.log('Error' ,e))