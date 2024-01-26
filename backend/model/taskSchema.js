const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    task_id:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    due_date:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    priority:{
        type: Number,
        required:true
    }
});


module.exports = mongoose.model("task", taskSchema);

