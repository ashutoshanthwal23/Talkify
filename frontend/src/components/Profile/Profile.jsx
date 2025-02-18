import { useEffect, useState } from "react";
import { getProfile } from "../../http";
import styles from "./Profile.module.css"
import RoomCard from "../RoomCard/RoomCard";

const Profile = () => {

  const [rooms, setRooms] = useState([]);
  const [refetchRooms, setRefetchRooms] = useState(false)

  useEffect(() => {
    const allRooms = async () => {
      try{
        const { data } = await getProfile();
        setRooms(data)

      } catch(err){
        console.log(err)
      }
    }
    allRooms()
    
  }, [refetchRooms])


  return (
    <div className={styles.rooms}>
      <h1 className={styles.roomsh1}>All Rooms</h1>
      
    <div className={styles.roomList}>
    {
      rooms.map((room) => (
        <RoomCard key={room.id} room={room} onDelete={setRefetchRooms} />
      ))
    }

  </div>
    </div>
  )
}

export default Profile;