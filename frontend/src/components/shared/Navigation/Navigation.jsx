import { Link, Outlet, useNavigate } from "react-router-dom";
import styles from "./Navigation.module.css";
import { logout } from "../../../http";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import { useEffect, useState } from "react";

const Navigation = () => {
  const brandStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
  };

  const logoText = {
    marginLeft: "10px",
  };

  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state) => state.auth);
  const [sliderMenu, setSliderMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate()

  const logoutUser = async () => {
    try {
      const { data } = await logout();
      dispatch(setAuth({ user: data.user }));
    } catch (err) {
      console.log(err);
    }
  };

  const gotoProfile = () => {
    setSliderMenu(false)
    navigate("/profile")
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [])

  return (
    <div>
      <nav className={`${styles.navbar} container`}>
        <Link style={brandStyle} to={"/"}>
          <img className={styles.logoImg} src="/images/logo.png"></img>
          <span className={styles.logoText} style={logoText}>Talkify</span>
        </Link>
        
        {
          windowWidth > 568 && isAuth && 
            <div className={styles.navRight}>
            <h3>{user?.name}</h3>
            <Link to="/profile">
              <img className={styles.avatar} src={user.avatar ? user.avatar : '/images/monkey-avatar.png'} alt="avatar" />
            </Link>
            <button className="logoutButton" onClick={logoutUser}>
              <img src="/images/logout.png" width="30" height="30" alt="logout" />
            </button>
          </div>
        }

        {
          windowWidth < 568 && isAuth && (
            <>
              <button onClick={() => setSliderMenu(true)} className={styles.humburgerBtn}>&#9776;</button>

              <div className={`${styles.sliderMenu} ${sliderMenu ? styles.open : styles.close}`}>
                <button onClick={() => setSliderMenu(false)} style={{margin: '20px'}} className="close">X</button>

                <div className={styles.userInfo}>
                  <Link onClick={gotoProfile} to="/profile">
                  <img className={styles.avatar} src={user.avatar ? user.avatar : '/images/monkey-avatar.png'} alt="avatar" />
                </Link>
                <h3 className={styles.userName}>{user?.name}</h3>
                
                  <button className={styles.logoutBtn}  onClick={logoutUser}>
                    <span>Logout</span>
                    <img src="/images/logout.png" width="30" height="30" alt="logout" />
                  </button>
                </div>

              </div>
            </>
          )
        }

      </nav>
      <Outlet />
    </div>
  );
};

export default Navigation;
