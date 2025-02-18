import { useDispatch, useSelector } from "react-redux"
import Button from "../../../components/shared/Button/Button"
import Card from "../../../components/shared/Card/Card"
import styles from "./StepAvatar.module.css"
import { useEffect, useState } from "react"
import { setAvatar } from "../../../store/activateSlice"
import { activate } from "../../../http"
import { setAuth } from "../../../store/authSlice"
import Loader from "../../../components/shared/Loader/Loader"

const StepAvatar = ({onNext}) => {
  const { name, avatar } = useSelector((state) => state.activate)
  const [image, setImage] = useState("/images/monkey-avatar.png")
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const [uploadImage, setUploadImage] = useState(null);

  function captureImage(e){
    const file = e.target.files[0];
    setUploadImage(file)
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      dispatch(setAvatar(reader.result))
    }
    reader.readAsDataURL(file)
  }

  async function submit(){
    if(!name || !uploadImage){
      return
    }

    setLoading(true);

    try{
      const formData = new FormData();
      formData.append("name", name);
      formData.append("avatar", uploadImage)
      
      const {data} = await activate(formData);
      if(data.auth){
        dispatch(setAuth({ user: data.user }))
      }
    } catch(err){
      console.log(err)
    } finally{
      setLoading(false)
    }
  }



  if(loading){
    return <Loader message="Activation in progress..." />
  }

  return (
    <Card title={`Hey ${name}`} icon="monkey-emoji">
      <p className={styles.subHeading}>How's this photo</p>
      <div className={styles.avatarWrapper}>
        <img className={styles.avatarImage} src={image} alt="avatar" />
      </div>
      <div>
        <input id="avatarInput" type="file" className={styles.avatarInput} onChange={captureImage} />
        <label htmlFor="avatarInput" className={styles.avatarLabel}>Choose a different photo</label>
      </div>
    <div>

      <Button onClick={submit} text="Next" />
    </div>
  </Card>
  )
}

export default StepAvatar
