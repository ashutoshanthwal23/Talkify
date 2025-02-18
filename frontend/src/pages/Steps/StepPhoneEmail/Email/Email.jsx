import { useState } from "react";
import Button from "../../../../components/shared/Button/Button";
import Card from "../../../../components/shared/Card/Card";
import TextInput from "../../../../components/shared/TextInput/TextInput";
import styles from "../StepPhoneEmail.module.css"
import { useDispatch } from "react-redux";
import { setOtp } from "../../../../store/authSlice";
import { sendOtp } from "../../../../http";

const Email = ({onNext}) => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch()

  const submit = async () => {
    if(!email){
      return
    }

    const { data } = await sendOtp({email})
    dispatch(setOtp({email: data.email, hash: data.hash}))
    console.log(data)
    onNext()
  }

  return (
    <Card title="Enter your email id" icon="email-emoji">
      <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
      <div>
      <div className={styles.actionButtonWrap}>
        <Button onClick={submit} text="Next" />
      </div>
      {/* <p className={styles.bottomParagraph}>
        By entering your number, you're agreeing to our terms of services and Privacy Policy.
      </p> */}
      </div>
    </Card>
  );
};

export default Email;
