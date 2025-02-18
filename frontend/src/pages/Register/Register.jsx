import React, { useState } from 'react'
import styles from "./Register.module.css"
import StepPhoneEmail from "../Steps/StepPhoneEmail/StepPhoneEmail"
import StepAvatar from "../Steps/StepAvatar/StepAvatar"
import StepName from "../Steps/StepName/StepName"
import StepOtp from "../Steps/StepOtp/StepOtp"
import StepUsername from "../Steps/StepUsername/StepUsername"

const steps = {
  1: StepPhoneEmail,
  2: StepOtp,
  3: StepName,
  4: StepAvatar,
  5: StepUsername
}

const Register = () => {
  const [step, setStep] = useState(1);
  const Step = steps[step]

const onNext = () => {
  setStep(step + 1)
}

  return (
    <div>
      <div>
        <Step onNext={onNext} />
      </div>
    </div>
  )
}

export default Register
