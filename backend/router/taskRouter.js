const express = require('express');
const router = express.Router();
const auth=require('../middleware/auth');
const {createTask,getTask,deleteTask,findbypriority} = require('../controller/taskController');

// Define routes for tasks
router.get('/all', auth, getTask);
router.post('/create', auth, createTask);
router.delete('/delete', auth, deleteTask);
router.get('/priority',auth, findbypriority)

module.exports = router;
