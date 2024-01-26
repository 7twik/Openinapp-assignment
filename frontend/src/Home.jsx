import axios from 'axios';
import React from 'react'
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

const Home = () => {
    const [render, setRender] = React.useState(0);
    const [token,setToken]=React.useState(localStorage.getItem('token'));
    const [date, setDate] = React.useState(new Date());
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [allTasks, setAllTasks] = React.useState([]);
    const [task_id, setTaskId] = React.useState(0);
    const [subTasks, setSubTasks] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [priority, setpriority] = React.useState(0);

    const [open, setOpen] = React.useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

    function handleChangeDate(event) {
        setDate(event.target.value);
    }
    function handleChangeTitle(event) {
        setTitle(event.target.value);
    }
    function handleChangeDesc(event) {
        setDescription(event.target.value);
    }
    React.useEffect(() => {
        console.log(page)
        axios.get('http://localhost:8080/task/all', {
            params: {
                page: page
            },
            headers: {"Authorization" : `Bearer ${token}`}

        }).then((response) => {
            console.log(response);
            setAllTasks(response.data.tasks);
        })
    }, [render])
    function handleSubmit(event) {
        console.log(date, title, description, token);
        axios.post('http://localhost:8080/task/create', {
                date: date,
                title: title,
                description: description,
                user: token
            },
            {
            headers: {"Authorization" : `Bearer ${token}`}
        }).then((response) => {
            console.log(response);
            setRender(render + 1);
        })
        event.preventDefault();
    }


    React.useEffect(() => {
        const token1 = localStorage.getItem('token');
        console.log(token1);
        setToken(token1);
        if(!token1){
            window.location.href = '/signup';
        }
    }, [])
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/signup';
    }
    function handleSubmit2(event) {
        console.log(title, task_id);
        axios.post('http://localhost:8080/subtask/create', {
                title: title,
                task_id: task_id,
        },{
            headers: {"Authorization" : `Bearer ${token}`}
        }).then((response) => {
            console.log(response);
            setRender(render + 1);
        });
        event.preventDefault();
    }
    async function getSubTasks (task_id) {
        await axios.get('http://localhost:8080/subtask/all', {
            params: {
                task_id: task_id
            },
            headers: {"Authorization" : `Bearer ${token}`}
        }).then((response) => {
            setSubTasks(response.data.tasks);
            console.log(response);
            onOpenModal();
        })
    }
    


  return (
    <div>
        <Modal open={open} onClose={onCloseModal} center>
        <h2>Create</h2>
        <input type="text" placeholder="Title" onChange={handleChangeTitle} />
        <button onClick={handleSubmit2}>Create</button>
        <hr/>
        <h2>Subtasks</h2>
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Delete</th>
                    <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                        {(subTasks.length===0||subTasks==null||subTasks==undefined)?<tr>
                                <td colSpan="3">No subtasks</td>
                            </tr>:subTasks.map((subtask,key) => {
                                return (
                                    <tr style={subtask.status==false?{backgroundColor:"red"}:{backgroundColor:"green"}} key={key}>
                                        
                                        <td>{subtask.title}</td>
                                        <td><button onClick={() => {
                                            axios.delete('http://localhost:8080/subtask/delete', {
                                                data: {
                                                    subtask_id: subtask._id,
                                                    task_id: task_id
                                                },
                                                headers: {"Authorization" : `Bearer ${token}`}
                                            }).then((response) => {
                                                console.log(response);
                                                setRender(render + 1);
                                            })
                                        }}>Delete</button></td>
                                        <td><button onClick={() => {
                                            axios.post('http://localhost:8080/subtask/update', {
                                                subtask_id: subtask._id,
                                                task_id: task_id
                                            },{
                                                headers: {"Authorization" : `Bearer ${token}`}
                                            }).then((response) => {
                                                console.log(response);
                                                setRender(render + 1);
                                            })
                                        }}>Done</button></td>
                                    </tr>
                                )
                            })
                        }
                        <tr>
                        </tr>
                    </tbody>
        </table>
      </Modal>
      <input type="text" placeholder="Search" onChange={(event) => {
            setpriority(event.target.value);
        }} />
        <button onClick={
            () => {
                axios.get('http://localhost:8080/task/priority', {
                    params: {
                        priority: priority
                    },
                    headers: {"Authorization" : `Bearer ${token}`}
                }).then((response) => {
                    console.log(response);
                    setAllTasks(response.data.tasks);
                })
            
        }}>SEARCH</button><br/>
        <button onClick={()=>{setRender(render+1)}}>Refresh</button>
        
        <table>
            <thead>
                <tr>
                    <th>Task_id</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Due</th>
                    <th>Status</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {(allTasks.length===0||allTasks==null||allTasks==undefined)?<tr>
                    <td colSpan="7">No tasks</td>
                </tr>:allTasks.map((task,key) => {
                    return (
                        <tr key={key} style={{cursor:"pointer"}} onClick={()=>{
                            setTaskId(task._id);
                            getSubTasks(task._id);
                        }}>
                            <td>{task.task_id}</td>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{task.priority}</td>
                            <td>{task.due_date}</td>
                            <td>{task.status}</td>
                            <td><button onClick={() => {
                                axios.delete('http://localhost:8080/task/delete',{
                                    data: {
                                        task_id: task.task_id,
                                    },
                                    headers: {
                                        "Authorization" : `Bearer ${token}`
                                    }
                                }).then((response) => {
                                    console.log(response);
                                    setRender(render + 1);
                                })
                            }}>Delete</button></td>
                        </tr>
                    )
                })}
                
            </tbody>
        </table>
        <hr />
        <hr />
        <h1>Create Task</h1>
        <input type="text" placeholder="Title" onChange={handleChangeTitle} />
        <input type="text" placeholder="Description" onChange={handleChangeDesc} />
        <input type="date" onChange={handleChangeDate} />
        <button onClick={handleSubmit}>Create</button>
        <hr />
        <Typography>Page: {page}</Typography>
        <Pagination variant="outlined" color="secondary" count={10} page={page} onChange={(event,value)=>{
            console.log(value);
            setPage(value);
            setRender(render+1);
        }} />
        <hr />
        <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Home