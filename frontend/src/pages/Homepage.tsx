import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css'

export default function Homepage() {
  const navigate=useNavigate()
  const token =localStorage.getItem("token");
  
  
  
  
  if(!token){
    useEffect(()=>{
      alert("You are not logged in ")

      navigate("/signup")
    })
  }
  return (
    <>

    <div >
      <h1 className='flex justify-center text-2xl text-blue-900'>Welcome to AI Fiannce Management </h1>
      
    </div>
    </>
  )
}
