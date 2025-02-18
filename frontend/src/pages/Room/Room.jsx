import styles from "./Room.module.css"
import { useWebRTC } from "../../hooks/useWebRTC"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { getRoom } from "../../http"

const Room = () => {
  const { id: roomID } = useParams();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [room, setRoom] = useState(null)

  const { clients, provideRef, handleMute } = useWebRTC(roomID, user)
  const [isMute, setMute] = useState(true)


  const handleMuteClick = (clientId) => {
    if(clientId !== user.id) return;
    setMute(prev => !prev)
  }

  useEffect(() => {
    handleMute(isMute, user.id)
  }, [isMute])

  const handleManualLeave = () => {
    navigate("/rooms")
  }

  useEffect(() => {
    const fetchRoom = async () => {
      const { data } = await getRoom(roomID);
      setRoom(data)
    }
    fetchRoom()
  }, [roomID])

  return (
    <div>
      <div className="container">
        <button onClick={handleManualLeave} className={styles.goBack}>
          <img src="/images/arrow-left.png" alt="arrow-left" />
          <span>All voice rooms</span>
        </button>
      </div>

      <div className={styles.clientWrap}>
        <div className={styles.header}>
          <h2 className={styles.topic}>{room?.topic}</h2>
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <img src="/images/palm.png" alt="palm-icon" />
            </button>
            <button className={styles.actionBtn} onClick={handleManualLeave}>
              <img src="/images/win.png" alt="win-icon" />
              <span>Leave quietly</span>
            </button>
          </div>
        </div>

        <div className={styles.clientsList}>
        {
          clients.map(client => {
            return (
              <div key={client.id} className={styles.client}>
                <div className={styles.userHead} >
                  <audio 
                  ref={(instance) => provideRef(instance, client.id)}
                  autoPlay>
                  </audio>
                  <img className={styles.avatar} src={client.avatar} alt="avatar" />
                  <button onClick={() => handleMuteClick(client.id)} className={styles.micWrapper}>
                    {
                      client.muted ? <img src="/images/mic-mute.png" alt="mic-mute-icon" /> : <img src="/images/mic.png" alt="mic-icon" />
                    }
                  </button>
                </div>
                <h4 className={styles.clientName}>{client.name}</h4>
              </div>
            )
          })
      }
        </div>
        </div>
     
    </div>
  )
}

export default Room
