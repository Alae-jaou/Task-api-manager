require('../db/mongoose');
const Task = require('../db/models/task');

// Task.findOneAndDelete({_id : '5f89ced4d4cad91a5ce33071'}).then((res) => {
//     console.log(res);
//     return Task.countDocuments({completed : false} ).then((res) => {
//         console.log(res)
//     });
// }).catch((e) => {
//     console.log('Error : ' , e)
// });

const deleteTask = async (id , completed) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed});
    return count
}

deleteTask('5f885d821feab5117447ea78' , false)
.then((res) => {
    console.log(res)
}).catch(() => {
    console.log('Error' ,e)
})