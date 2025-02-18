import { useState } from "react"
import Button from "../../../components/shared/Button/Button"
import Card from "../../../components/shared/Card/Card"
import TextInput from "../../../components/shared/TextInput/TextInput"
import { useDispatch, useSelector} from "react-redux"
import { setName } from "../../../store/activateSlice"
import styles from "./StepName.module.css"

const StepName = ({onNext}) => {
  const { name } = useSelector((state) => state.activate)
  const [fullName, setFullname] = useState(name)
  const dispatch = useDispatch()

  function nextStep(){
    if(!fullName){
      return;
    }
    dispatch(setName(fullName))
    onNext()
  }

  return (
    <Card title="What's your full name?" icon="goggle-emoji">
    <TextInput value={fullName} onChange={(e) => setFullname(e.target.value)} />
    <div>
    <p className={styles.paragraph}>
      People use real names at talkify
    </p>
    <div className={styles.actionButtonWrap}>
      <Button onClick={nextStep} text="Next" />
    </div>
    </div>
  </Card>
  )
}

export default StepName
