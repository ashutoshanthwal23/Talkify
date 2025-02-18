import React, { useState } from 'react'
import StepName from '../Steps/StepName/StepName'
import StepAvatar from '../Steps/StepAvatar/StepAvatar'
import styles from "./Activate.module.css"

const steps = {
  1: StepName,
  2: StepAvatar
}

const Activate = () => {
  const [step, setStep] = useState(1)
  const Component = steps[step]

  return (
    <div className={styles.cardWrapper}>
      <Component onNext={() => setStep(prev => prev + 1)} />
    </div>
  )
}

export default Activate
