import React from "react";
import { Routes,Route } from "react-router-dom";
import Homepage from './pages/Homepage.tsx'
import Signup from "./pages/Signup.tsx";
import Signin from "./pages/Signin.tsx";
import Profile  from './pages/Profile.tsx'

export default function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/signin" element={<Signin/>}/>
      <Route path="/profile" element={<Profile/>}/>


    </Routes>
    </>
  );
}
