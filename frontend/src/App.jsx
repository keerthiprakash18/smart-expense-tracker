import "./App.css";
import Navbar from "./components/layout/Navbar";
import Register from "./pages/Register";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Register />
    </div>
  );
}

export default App;