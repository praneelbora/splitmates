import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/register";
import Groups from "./pages/groups";
import Friends from "./pages/friends";
import AddExpense from "./pages/addExpense";
import { useAuth } from "./context/authContext";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/groups" /> : <Login />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/groups" /> : <Register />}
      />
      <Route
        path="/groups"
        element={
          <PrivateRoute>
            <Groups />
          </PrivateRoute>
        }
      />
      <Route
        path="/friends"
        element={
          <PrivateRoute>
            <Friends />
          </PrivateRoute>
        }
      /><Route
        path="/add-expense"
        element={
          <PrivateRoute>
            <AddExpense />
          </PrivateRoute>
        }
      />
      <Route
        path="/"
        element={<Navigate to={token ? "/groups" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
