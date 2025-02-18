import { useEffect, useState } from 'react'
import styles from "./Rooms.module.css"
import RoomCard from '../../components/RoomCard/RoomCard'
import AddRoomModal from '../../components/AddRoomModal/AddRoomModal'
import { getAllRooms } from '../../http'


const Rooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([])
  const [searchTopic, setSearchTopic] = useState("");
  const [refetchRooms, setRefetchRooms] = useState(false);


  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await getAllRooms();
      setRooms(data)
    }
    fetchRooms()
  }, [refetchRooms])

  const filteredRooms = rooms.filter(room => room.topic.includes(searchTopic));

  return (
    <>
    { showModal && <AddRoomModal setRefetchRooms={setRefetchRooms} onClose={() => setShowModal(false)} /> }

    <div className='container'>
      <div className={styles.roomsHeader}>
        <div className={styles.left}>
          <span className={styles.heading}>All voice rooms</span>
          <div className={styles.searchBox}>
            <img src='/images/search-icon.png' alt='search' className={styles.searchIcon} />
            <input type='text' className={styles.searchInput} onChange={(e) => setSearchTopic(e.target.value)} />
          </div>
        </div>
        <div className={styles.right}>
          <button className={styles.addRoomBtn} onClick={() => setShowModal(true)}>
            <img src='/images/add-room-icon.png' alt='' />
            <span>Start a room</span>
          </button>
        </div>
      </div>

      <div className={styles.roomList}>
        {
          filteredRooms.reverse().map((room) => (
            <RoomCard key={room.id} room={room} onDelete={setRefetchRooms} />
          ))
        }

      </div>
    </div>
    </>
   
  )
}

export default Rooms
