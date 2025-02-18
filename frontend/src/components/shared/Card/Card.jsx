import React from 'react'
import styles from "./Card.module.css"

const Card = ({title, icon, children}) => {
  return (
    <div className={styles.card}>
      <div className={styles.headingwrapper}>
        {icon && <img src={`/images/${icon}.png`} />}
        {title && <h1 className={styles.heading}>{title}</h1>}
      </div>
      {children}
    
  </div>
  )
}

export default Card
