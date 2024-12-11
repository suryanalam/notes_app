import { Routes, Route } from "react-router-dom";

//middleware
import Authenticate from "./middlewares/Authenticate";

//pages
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import Note from "./pages/Note";
import SharedNote from "./pages/SharedNote";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/share/:link" element={<SharedNote />} />
        <Route element={<Authenticate />}>
          <Route exact path="/" element={<Home />} />
          <Route path="/note/:id" element={<Note />} />
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
