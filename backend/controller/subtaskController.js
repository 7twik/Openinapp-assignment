const SubTask = require("../model/subTaskSchema.js");
const Task = require("../model/taskSchema.js");
const create=async(req,res)=>{
    try{
        const {title,task_id}=req.body;
        
        const newTask=await SubTask.create({task_id:task_id,title:title,status:false});
        console.log("Task created")
        const allstatus=await SubTask.find({task_id:task_id});
        const falsestatus=await SubTask.find({task_id:task_id,status:false});
        const truestatus=await SubTask.find({task_id:task_id,status:true});
        if(falsestatus.length==0)
        {
            const task=await Task.updateOne({_id:task_id},{status:"DONE"});
        }
        else if((allstatus.length-truestatus.length)!=0)
        {
            const task=await Task.updateOne({_id:task_id},{status:"IN PROGRESS"});
        }
        else
        {
            const task=await Task.updateOne({_id:task_id},{status:"TODO"});
        }
        res.status(200).json({message:"task created",task:newTask});
    }catch(error)
    {
        console.log(error);
    }
}
const get=async(req,res)=>{
    try{
        const {task_id}=req.query;
        console.log(req.params);
        const tasks=await SubTask.find({task_id:task_id});
        console.log("tasks",tasks);
        res.status(200).json({message:"tasks",tasks:tasks});
    }catch(error)
    {
        console.log(error);
    }
}
const update=async(req,res)=>{
    try{
        const {subtask_id,task_id}=req.body;
        const tasks=await SubTask.updateOne({_id:subtask_id},{status:true});
        console.log("UPDATE",tasks);
        const falsestatus=await SubTask.find({_id:task_id,status:false});
        const truestatus=await SubTask.find({_id:task_id,status:true});
        if(falsestatus.length==0)
        {
            const task=await Task.updateOne({_id:task_id},{status:"DONE"});
        }
        else if(truestatus.length!=0)
        {
            const task=await Task.updateOne({_id:task_id},{status:"IN PROGRESS"});
        }
        res.status(200).json({message:"tasks",tasks:tasks});
    }catch(error)
    {
        console.log(error);
    }
}

const deleteTask = async (req, res) => {
    try{
        const {task_id,subtask_id}=req.body;
        console.log(req.body);
        const tasks=await SubTask.deleteOne({_id:subtask_id});
        console.log("Task deleted")
        const falsestatus=await SubTask.find({task_id:task_id,status:false});
        const truestatus=await SubTask.find({task_id:task_id,status:true});
        if(falsestatus.length==0)
        {
            const task=await Task.updateOne({_id:task_id},{status:"DONE"});
        }
        else if(truestatus.length!=0)
        {
            const task=await Task.updateOne({_id:task_id},{status:"IN PROGRESS"});
        }
        else{
            const task=await Task.updateOne({_id:task_id},{status:"TODO"});
        }
        res.status(200).json({message:"tasks",tasks:tasks});
    }
    catch(error)
    {
        console.log(error);
    }
}


module.exports={create,get,update,deleteTask};