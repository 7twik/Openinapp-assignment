const Task = require("../model/taskSchema");
const User = require("../model/userSchema");
const createTask = async (req, res) => {
    try {
        const { title, description, date } = req.body;
        const task_id = await Task.countDocuments({ user: req.user.user }) + 1;

        const currentDate = new Date();
        const datee=new Date(date);
        const timeDiff = datee.getTime() - currentDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const priority = daysDiff > 0 ? daysDiff : 0;

        const newTask = await Task.create({
            task_id: task_id,
            title: title,
            description: description,
            due_date: date,
            user: req.user.user,
            status: "TODO",
            priority: priority
        });

        const tasks = await Task.find({ user: req.user.user, status: { $in: ["TODO", "IN_PROGRESS"] }, priority: { $gt: -1 } })
            .sort({ priority: 1 });

        const lowestPriority = tasks.length > 0 ? tasks[0].priority : -1;
        await User.updateOne({ user: req.user.user }, { priority: lowestPriority });

        
        console.log("Task created");
        res.status(200).json({ message: "task created", task: newTask });
    } catch (error) {
        console.log(error);
    }
};

const getTask = async (req, res) => {
    try {
        console.log(req.user);
        console.log(req.query)
        const page = req.query.page || 1;        
        const perPage = 3; 

        const tasks = await Task.find({ user: req.user.user })
            .sort({ priority: 1 })
            .skip((page - 1) * perPage) 
            .limit(perPage); 

        res.status(200).json({ message: "tasks", tasks: tasks });
    } catch (error) {
        console.log(error);
    }
};

const findbypriority = async (req, res) => {
    try {
        const { priority } = req.query;
        console.log(req.query);
        const tasks = await Task.find({ user: req.user.user, priority: priority });
        console.log("priority tasks", tasks);
        res.status(200).json({ message: "tasks", tasks: tasks });
    } catch (error) {
        console.log(error);
    }
};

const deleteTask = async (req, res) => {
    try{
        const {task_id}=req.body;
        console.log(req.body);
        const tasks=await Task.deleteOne({user:req.user.user,task_id:task_id});
        console.log("Task deleted")

        
        const tasks2 = await Task.find({ user: req.user.user, status: { $in: ["TODO", "IN_PROGRESS"] }, priority: { $gt: -1 } })
            .sort({ priority: 1 });

        const lowestPriority = tasks.length > 0 ? tasks[0].priority : -1;
        await User.updateOne({ user: req.user.user }, { priority: lowestPriority });


        res.status(200).json({message:"tasks",tasks:tasks});
    }
    catch(error)
    {
        console.log(error);
    }
}

module.exports = {createTask,getTask,deleteTask,findbypriority};