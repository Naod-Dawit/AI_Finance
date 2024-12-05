import React from "react";
import { Routes,Route } from "react-router-dom";
import Expenses from './pages/Expenses.tsx'
import Signup from "./pages/Signup.tsx";
import Signin from "./pages/Signin.tsx";
import Profile  from './pages/Profile.tsx'
import Homepage from './pages/Homepage.tsx'
import Terms from './assets/Terms.tsx'
import About from "./assets/About.tsx"


export default function App() {
  return (
    <>
    <Routes>
      <Route path="/" element ={<Homepage/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/signin" element={<Signin/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/expenses" element={<Expenses/>}/>
      <Route path="/terms" element={<Terms/>}/>
      <Route path='/about' element={<About/>}/>



    </Routes>
    </>
  );
}
