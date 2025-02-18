import { useNavigate } from "react-router-dom"
import styles from "./RoomCard.module.css"
import Button from "../shared/Button/Button";
import { useState } from "react";
import { deleteRoom, encryptData } from "../../http";
import { useSelector } from "react-redux";
import { toastError, toastSuccess } from "../Toast";

const RoomCard = ({room, onDelete}) => {
  const navigate = useNavigate();
  const [linkModal, setLinkModal] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const ownerId = useSelector((state) => state.auth.user.id)


  const generateLink = async (roomId) => {
    const link = `room/${roomId}`;
    const {data: { encryptedData }} = await encryptData({text: link});
    setInviteLink(encryptedData);
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteLink);
  }

  const handleDeleteRoom = async (roomId) => {
    if(!roomId){
      return;
    }
    try{
      await deleteRoom(roomId);
      onDelete(prev => !prev);
      toastSuccess("deleted");
    } catch(err){
      console.log(err);
      toastError("delete failed")
    }
  }

  return (
    <>
    <div className={styles.card} >
      <div onClick={() => navigate(`/room/${room.id}`)}>
      <h3 className={styles.topic}>{room.topic}</h3>

      <div className={`${styles.speakers} ${room.speakers.length === 1 && styles.singleSpeaker}`}>

            <div className={styles.avatars}>
              {
                room.speakers.map(speaker => (
                  <img key={speaker.id} src={speaker.avatar} alt="avatar" />
                ))
              }
            </div>

        <div className={styles.names}>
          {
            room.speakers.map(speaker => (
              <div key={speaker.id} className={styles.nameWrapper}>
                <span>{speaker.name}</span>
                <img src="/images/chat-bubble.png" />
              </div>
            ))
          }
        </div>
      </div>

      <div className={styles.totalPeople}>
        <span>{room.totalPeople}</span>
        <img src="/images/user-icon.png" alt="user" />
      </div>

      </div>


        <div className={styles.actions}>
          {
            room?.ownerId.id === ownerId && room.roomType === "private" && (
              <button className={styles.inviteBtn} onClick={() => setLinkModal(true)}>Invite others</button>
            )
          }
          {
            room?.ownerId?.id === ownerId && (
              <button onClick={() => handleDeleteRoom(room.id)} className={styles.deleteBtn}>
                <img src="/images/delete.png" alt="delete-icon" />
              </button>
            )
          }
        </div>
    
    </div>

    {
      linkModal && (
        <div className={styles.inviteContainer}>
          <div className={styles.inviteContent}>
          <button onClick={() => setLinkModal(false)} className={styles.closeBtn}>X</button>

            <button className={styles.linkBtn} onClick={() => generateLink(room.id)}>click to generate Link</button>
            {
              inviteLink && (
                <div className={styles.copyLink}>
                  <span className={styles.inviteSpanContent} style={{wordBreak: "break-word"}}>{inviteLink}</span>
                  <button onClick={copyLink}>copy</button>
                  <span className={styles.shareLink}>share this link to others</span>
              </div>
              )
            }
          </div>
        </div>
      ) 
    }
    </>
  )
}

export default RoomCard
