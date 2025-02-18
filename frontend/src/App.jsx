import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navigation from "./components/shared/Navigation/Navigation";
import './App.css'
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Authenticate from "./pages/Authenticate/Authenticate";
import Rooms from "./pages/Rooms/Rooms";
import Activate from "./pages/Activate/Activate"
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";
import Loader from "./components/shared/Loader/Loader";
import Room from "./pages/Room/Room";
import Profile from "./components/Profile/Profile";


function App() {

  const { loading } = useLoadingWithRefresh()

  return (
    loading ? <Loader message="Loading please wait..." />
    :
    <BrowserRouter>
      <Routes>
        <Route element={<Navigation />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<GuestRoute />}>
            <Route path="/authenticate" element={<Authenticate />} />
          </Route>

          <Route element={<SemiprotectedRoute />}>
            <Route path="/activate" element={<Activate />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/rooms" element={<Rooms />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/room/:id" element={<Room />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />}></Route>
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );  
}


const GuestRoute = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return (
    isAuth ? <Navigate to="/rooms" /> : <Outlet />
  )
}

const SemiprotectedRoute = () => {
  const { isAuth, user } = useSelector((state) => state.auth)

  return (
    !isAuth ? <Navigate to="/" /> : user.activated ? <Navigate to="/rooms" /> : <Outlet />
  )
}


const ProtectedRoute = () => {
  const { isAuth, user } = useSelector((state) => state.auth)

  return(
    !isAuth ?
     <Navigate to="/" />
    :
    isAuth && !user.activated ?
    <Navigate to="/activate" />
    :
    <Outlet />
  )
  }


export default App;
