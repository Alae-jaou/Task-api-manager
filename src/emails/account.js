const sgMail = require('@sendgrid/mail');

// const sendGridAPIKey = ;

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to : email,
        from : 'jaouani123alae@gmail.com',
        subject : 'Welcome to the app',
        text : `Hello ${name} to our website`
    })   
}

const  sendGoodByEmail = (email , name)=> {
    sgMail.send({
        to:email, 
        from : 'jaouani123alae@gmail.com',
        subject : 'Canceling Mail',
        text : `Wish you will be back soon ${name} `
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodByEmail
}
                               