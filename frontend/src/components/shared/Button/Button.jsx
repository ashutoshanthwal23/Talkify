import React from "react";
import styles from "./Button.module.css";

const Button = ({text, onClick, ...props}) => {
  return (
    <button onClick={onClick} className={`${styles.button}`} {...props}>
      <span>{text}</span>
      <img src="/images/arrow-forward.png" alt="arrow" className={styles.arrow} />
    </button>
  );
};

export default Button;
