import { Routes, Route } from "react-router-dom";

//pages
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import AddCard from "./components/AddCard";
import UpdateCard from "./components/UpdateCard";

//middleware
import Authenticate from "./middlewares/Authenticate";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Authenticate />}>
          <Route exact path="/" element={<Home />} />
          <Route path="/addTask" element={<AddCard />} />
          <Route path="/updateTask" element={<UpdateCard />} />
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
