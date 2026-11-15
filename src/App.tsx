import "./App.css";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <div className="site-shell">
      <Header />
      <AppRoutes />
      <Footer />
    </div>
  );
}

export default App;
