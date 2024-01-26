import React from 'react'
import axios from 'axios'
const Signup = () => {
    const user = React.useRef()
    const pass = React.useRef()
    const number = React.useRef()
    const submit = async() => {
        console.log(user.current.value, pass.current.value, number.current.value);
        
        await axios.post('http://localhost:8080/user/register', {
            user: user.current.value,
            pass: pass.current.value,
            number: number.current.value
        }).then((response) => {
            console.log(response);
        })
    }
  return (
    <div>
        <h1>Signup</h1>
        <input placeholder="user" type="text" ref={user} />
        <input placeholder="password" type="text" ref={pass} />
        <input placeholder="enter number with +91 no spaces" type="text" ref={number} />
        <button onClick={submit}>Submit</button>
    </div>
  )
}

export default Signup