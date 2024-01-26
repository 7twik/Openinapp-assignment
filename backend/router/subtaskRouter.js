const express = require('express');
const router = express.Router();
const auth=require('../middleware/auth');
const {create,get,update,deleteTask} = require('../controller/subtaskController');

// Define routes for tasks
router.get('/all', auth, get);
router.post('/create', auth, create);
router.delete('/delete', auth, deleteTask);
router.post('/update', auth, update);

module.exports = router;
