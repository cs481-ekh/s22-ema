#!/usr/bin/env node
const express = require('express');
const schedule = require('node-schedule');
const admin = require("firebase-admin");

const credentials = require("./ema-ramen-firebase-adminsdk-7lvc1-45079796ab.json");

admin.initializeApp({
    credential: admin.credential.cert(credentials),
    databaseURL: "https://ema-ramen-default-rtdb.firebaseio.com",
});

const app = express()

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

/*
JSON FORMAT THAT I JUST CAME UP WITH
{
    topic:
    url:
    title:
    message:
    year: 
    month:
    day:
    hour:
    minute:
}
*/

//simple hello world extention 
app.get('/', (req, res) => {
    res.send('Hello World!')
  })

//function is waiting for a post request on what I assume is localhost:3000
//this should come with a JSON string containing information
app.post('/test', (req, res) => {
    //just printing out the body
    console.log(req.body)
    //getting the body out of the JSON
    const r = req.body
    //gets a date out of the JSON
    const date = new Date(req.body.year, req.body.month-1, req.body.day, req.body.hour, req.body.minute, 0)
    //This takes in a date and waits for the date/time before executing the secend half of the input in this case the send function.
    const job = schedule.scheduleJob(date, function(x) {sendNotif(x.topic, x.url, x.title, x.message)}.bind(null, r));

    //returns a notification if sucessful
    res.send("Success\n")
})


//I assume this is just listing for a post request on localhost:3000 only about 80% sure
app.listen(3000, () => {
    console.log(`App listening at http://localhost:3000`)
  })

//this function sends the message
function sendNotif(topic, url, title, body) {

    const message = {
        data: {
            url: url
        },
        topic: topic,
        notification: {
            title: title,
            body: body,
        },
    };


    //this takes in the firebase login and then sends the message with the preformated message created above, then has differnt console logs depending on outcome.
    admin.messaging()
        .send(message)
        .then((response) => {
            console.log("Successfully sent message:", response);
        })
        .catch((error) => {
            console.log("Error sending message:", error);
        });
}
