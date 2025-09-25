import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import "./App.css";
import {AuthProvider} from "./AuthContext";
import Login from "./pages/Login.tsx";
import Overview from "./pages/Overview.tsx";
import RouteProvider from "./router/RouteProvider.tsx";
import NotFound from "./pages/NotFound.tsx";
import RequireAuth from "./RequireAuth.tsx";
import Profile from "./pages/Profile.tsx";

const queryClient = new QueryClient()

function App() {
  const routes = {
    default: <NotFound/>,
    "/": <RequireAuth><Overview/></RequireAuth>,
    "/profile": <RequireAuth><Profile/></RequireAuth>,
    "/login": <Login/>
  }
  return (
    <div className="bg-linear-to-br font-mono from-indigo-900 to-indigo-950 min-h-screen p-2">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouteProvider {...routes}/>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  )
}

export default App
