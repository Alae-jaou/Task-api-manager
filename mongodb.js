
const {MongoClient , ObjectID} = require('mongodb');

// const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://alae:alae@cluster0.coj8z.mongodb.net/alae?retryWrites=true&w=majority";
const dataBaseName = 'task-manager';

MongoClient.connect(uri , {useNewUrlParser : true , useUnifiedTopology: true} , (error , client) => {
    if(error) {
        return console.log('Unable to connect');
    }
    const db = client.db(dataBaseName);
    // db.collection('users').updateOne(
    //     {
    //         _id : ObjectID('5f84cc337dc27904c885e5f0')
    //     } , {
    //         $set:{
    //             name : 'Amina'
    //         } 
    //     })
    // .then((res)=> console.log(res))
    // .catch((err) => console.log(err))
    db.collection('tasks').updateMany(
        {Completed : false} , 
        {
            $set : {
                Completed : true
            }
        }
    ).then((res) => console.log(res))
    .catch((err) => console.log('error'))

 //   client.close();
});



















    // db.collection('users').insertOne({
    //     name:'Alae',
    //     age:'22'
    // } , (error , results) => {
    //     if (error) {
    //         return console.log('Unable to insert user');
    //     }
    //     console.log(results.ops);
    // });

//     db.collection('tasks').insertMany([
//         {
//             Description:'Task one',
//             Completed :false
//         },{
//             Description:'Task two',
//             Completed :true
//         },{
//             Description:'Task three',
//             Completed :false
//         }
//     ] , (error , result) => {
//         if (error) {
//             return console.log('Error occured on inserting many files');
//         }
//         console.log(result.ops);
//     });
    
// })


// Info
/*
MongoDb uses GUID (GLOBALY UNIQUE ID), they have been designed with an algorithm without 
needing the server to determine what the next value is.

switching from auto_increm to GUID allow MongoDB to achieve one of the main goals whitch is 
the ability to scale well in a distributed system

So we have multiple db servers running insted of one allowing us to handl heavy trafic.
With GIUD, there is no change to have ID collusion across those databases server contray to SQL db.
in witch we can had a user with ID in one db server and other user in other db server and we can defenetly 
run to an issu where those Id conflit, in Mongo we don't run into that problem 

*/