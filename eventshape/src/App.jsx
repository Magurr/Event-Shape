import "./App.css";
import Event from "./components/Event";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login"; // Login bileşeninizin doğru yolunu kontrol edin
import User from "./components/User";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        {/* Diğer rotalarınızı buraya ekleyin */}
      </Routes>
    </Router>
  );
}

export default App;
