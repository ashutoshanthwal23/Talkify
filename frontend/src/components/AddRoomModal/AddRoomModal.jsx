import { useRef, useState } from "react";
import styles from "./AddRoomModal.module.css";
import { createRoom as create } from "../../http";
import { useNavigate } from "react-router-dom";

const AddRoomModal = ({ onClose, setRefetchRooms }) => {
  const [roomType, setRoomType] = useState("open");
  const [topic, setTopic] = useState('');
  const navigate = useNavigate()
  
  const roomTypes = [
    {
      id: crypto.randomUUID(),
      type: 'open',
      icon: '/images/globe.png',
      label: "Open"
    },
    // {
    //   id: crypto.randomUUID(),
    //   type: 'social',
    //   icon: '/images/social.png',
    //   label: "Social"
    // },
    {
      id: crypto.randomUUID(),
      type: 'private',
      icon: '/images/lock.png',
      label: "Closed"
    }
  ]

  const createRoom = async () => {
    if(!topic){
      return
    }

    try{
      const { data } = await create({ topic, roomType});
      console.log(data)
      if(data.roomType === "private" || data.roomType === "social"){
        navigate("/profile")
      }
      else{
        setRefetchRooms(prev => !prev)
        onClose(true)
      }
    } catch(err){
      console.log(err)
    }
  }

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.card}>
        
        <button className={styles.closeButton} onClick={onClose}>
          <img src="/images/close.png" />
        </button>

        <div className={styles.header}>
          <h4 style={{ marginTop: "10px", fontWeight: "bold" }}>
            Enter the topic to be discussed
          </h4>
          <input type="text" className={styles.topicInput} value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>

        <div className={styles.roomTypeWrapper}>
          <h4 style={{ fontWeight: "bold" }}>Room types</h4>

          <div className={styles.roomType}>

            {
              roomTypes.map(room => (
                <div 
                key={room.id}
                onClick={() => setRoomType(room.type)} 
                className={`${styles.room} ${roomType === room.type && styles.active}`}>
                  <img src={room.icon} alt={room.type} />
                  <span>{room.label}</span>
                </div>
              ))
            }

          </div>
        </div>

        <div className={styles.startRoomWrapper}>
          <h4 style={{ fontWeight: "bold" }}>Start a room, {roomType === "private" ? "open to few" : "open to everyone"}</h4>

          <button onClick={createRoom} className={styles.startRoomBtn}>
            <img src="/images/celebration.png" />
            <span>Let's Go</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
