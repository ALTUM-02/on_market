import AppRoutes from "./routes/AppRoutes";
import { AppProvider } from "./store";

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;