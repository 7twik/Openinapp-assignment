import React,{ useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import Home from './Home'

function App() {
  const [data,setData]=React.useState(localStorage.getItem('token'));
  const setHeader = (token) => {
      localStorage.setItem('token', token);
      setData(token);
  }

  return (
    <>
      <Routes>
          {data && <Route path="/" element={<Home />}/> }  
          {!data &&  <Route path="/" element={<Login header={setHeader} />}/>}
          {!data &&  <Route path="/signup" element={<Signup />}/>}
        </Routes>
    </>
  )
}

export default App
