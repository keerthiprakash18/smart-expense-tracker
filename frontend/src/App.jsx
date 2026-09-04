import "./App.css";
import Navbar from "./components/layout/Navbar";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <AppRouter />
      </div>
    </AuthProvider>
  );
}

export default App;