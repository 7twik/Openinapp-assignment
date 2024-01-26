const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
    task_id:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },
}, { timestamps: true });


module.exports = mongoose.model("subtask", subtaskSchema);

