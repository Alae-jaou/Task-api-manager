const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task'); 

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    age :  {
        type : Number, 
        default : 0, 
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positif'); 
            }
        }
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique:true,
        lowercase:true,
        validate(email) {
            if(!validator.isEmail(email))
                throw new Error('Email is invalid');
        }
    }, 
    password : {
        type : String, 
        required : true, 
        trim : true,
        validate(value) {
            if (value.toLowerCase().includes('password') || value.length < 6)
                throw new Error('Your password doesn\'t does not respect all requirements');
        }
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }], 
    avatar : {
        type : Buffer
    }
}, {
    timestamps : true
})

userSchema.virtual('tasks' , {
    ref: 'Task',
    localField : '_id',
    foreignField : 'owner'
})

// delete user task when user is deleted
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({owner : user._id })
    next()
})


// accessible by the instences
userSchema.methods.generateAuthToken = async function () {
    user = this;
    const token = jwt.sign({_id : user._id.toString()} , process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token
}

userSchema.methods.toJSON = function() {
    const user = this
    userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// accessible by the model
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error('Inable to login');
    }
    const isMatch = await bcrypt.compare(password , user.password);
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user;
}

// Hash the plain text password before saving 
userSchema.pre('save' , async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8);
    }
    next()
})

const User = mongoose.model('User' ,userSchema );

module.exports = User 