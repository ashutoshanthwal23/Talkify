import React from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";

const Home = () => {

  const signInLinkStyle = {
    color: 'rgb(35, 35, 211)',
    fontWeight: 'bold',
    textDecoration: 'none',
    marginLeft: '10px'
  }

  const navigate = useNavigate()

  const startRegister = () => {
    navigate("/authenticate")
  }



  return (
    <div className={styles.cardWrapper}>
      <Card title="Welcome to Talkify" icon="logo">

        <p className={styles.text}>
        Welcome to Talkify, the place where you can meet new people and have spontaneous, real-time voice conversations with strangers from around the world.
        </p>
        <div>
          <Button onClick={startRegister} text="Let's Go" />
        </div>
        <div className={styles.signinWrapper}>
          {/* <span className={styles.hasInvite}>Have an invite text?</span> */}
          {/* <Link to={"/login"} style={signInLinkStyle}>Sign in</Link> */}
        </div>
      </Card>
    </div>
  );
};

export default Home;
