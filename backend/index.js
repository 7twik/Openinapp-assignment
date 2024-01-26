const express = require('express');
const app = express();
const port = 8080;

require("./db/conn");
const cors = require("cors");
const cron = require('node-cron');
const fs = require('fs');
const User = require("./model/userSchema");
const Task = require("./model/taskSchema");
app.use(express.json());
app.use(cors());
app.get('/', async(req, res) => {
     res.send("Hello World");                 
});
const hello=async(phone)=>{
    try{
        console.log("phone",phone)
        const accountSid = 'AC452d23b9e7cbc6d82a690d4a41a6a19b';
        const authToken = '39f0a96afc0dbe65dae0a37830e3c0fa';
        const client = require('twilio')(accountSid, authToken);
        const call = await client.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml', // TwiML URL or TwiML string for the call
            to: phone, // Replace with the recipient's phone number
            from: '+12407477054', // Replace with your Twilio phone number
          });
      
          console.log(`Call SID: ${call.sid}`);
         
    }
    catch(error)
    {
        console.log(error);
    }
}

cron.schedule('0 0 * * *', () => {
    async function update() {
        const tasks = await Task.updateMany({},{$inc:{priority:-1}});
        
        console.log("tasks",tasks)
        const user = await User.updateMany({},{$inc:{priority:-1}});
        console.log("user",user)
        const users = await User.find({priority:{$eq:0}});
        console.log("users",users)
        const users1 = await User.find({priority:{$lte:-1}});
        users.forEach(async (user) => {
            hello(user.number);
        });
        
        users1.forEach(async (user) => {
            
            const taskss = await Task.find({ user: user.user, status: { $in: ["TODO", "IN_PROGRESS"] }, priority: { $gt: -1 } })
            .sort({ priority: 1 });

            const lowestPriority = taskss.length > 0 ? taskss[0].priority : -1;
            await User.updateOne({ user: user.user }, { priority: lowestPriority });

        });
       
    }
    update();
    // Add your task logic here
  });

app.use("/api", require("./router/router"));
app.use("/user", require("./router/userRouter"));
app.use("/task", require("./router/taskRouter"));
app.use("/subtask", require("./router/subtaskRouter"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
