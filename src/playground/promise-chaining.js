require('../db/mongoose');
const User = require('../db/models/user');

// User.findOneAndUpdate({ _id :'5f885a8ed2e32a07bcd915b4'} , {email : 'newmail@gmail.Com'})
// .then((res) => {
//     console.log(res)
//     return User.countDocuments({name : 'Alae'} ).then((count) => {
//         console.log(count)
//     });
// }).catch((e) => {
//     console.log('Error occured  : ' , e);
// })

const findDocumentAndUpdate = async (id , email) => {
    const user = await User.findByIdAndUpdate(id , email);
     const count = await User.countDocuments('Alae');
    return count
}

findDocumentAndUpdate('5f885a8ed2e32a07bcd915b4'  , {email :'AlaeEddine@amina.Com'})
.then((res) => {
    console.log(res);
}).catch((e) => {
    console.log('Error ',e)
    
})