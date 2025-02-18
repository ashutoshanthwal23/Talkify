import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";

export function useLoadingWithRefresh(){
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()

  useEffect(() => {
    ( async () => {
        try{
          const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/refresh`, {
            withCredentials: true
          })

          dispatch(setAuth({ user: data.user }))
          setLoading(false)

        } catch(err){
          console.log(err)
          setLoading(false)
        }

    })()
  }, [])

  return { loading }
}