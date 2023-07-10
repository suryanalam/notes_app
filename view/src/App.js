import React from "react";
import { Routes, Route } from "react-router-dom";

import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home/Home";
import AddCard from "./components/Add Card/AddCard";
import UpdateCard from "./components/Update Card/UpdateCard";
import PrivateRoutes from "./PrivateRoutes";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route exact path="/" element={<Home />} />
          <Route path="/addTask" element={<AddCard />} />
          <Route path="/updateTask" element={<UpdateCard />} />
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
