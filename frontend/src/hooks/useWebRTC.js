import { useCallback, useEffect, useRef } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import {socketInit} from "../sockets"
import { ACTIONS } from "../actions";
import freeice from "freeice"

const users = [];

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback(users);
  const audioElements = useRef({});
  const localMediaStream = useRef();
  const connections = useRef({});
  const socket = useRef(null);
  const clientsRef = useRef([])

  const addNewClients = useCallback((newClient, cb) => {
    const lookingFor = clients.find((client) => client.id === newClient.id);
    if(lookingFor === undefined){
      setClients((existingClients) => [...existingClients, newClient], cb)
    }

  }, [clients, setClients])

  useEffect(() => {
    clientsRef.current = clients
  }, [clients])


  useEffect(() => {
    const initChat = async () => {
      socket.current = socketInit();
      await captureMedia();
      addNewClients({...user, muted: true}, () => {
        const localElement = audioElements.current[user.id];
        if(localElement){
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current
        }        
      })

    //   socket.current.on(ACTIONS.MUTE_INFO, ({ userId, isMute }) => {
    //     handleSetMute(isMute, userId);
    // });
      socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
      socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
      socket.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
      socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);
      socket.current.on(ACTIONS.ANSWER_SDP, handleSdpAnswer);
      socket.current.on(ACTIONS.MUTE, ({ userId }) => {
          handleSetMute(true, userId);
      });
      socket.current.on(ACTIONS.UN_MUTE, ({ userId }) => {
          handleSetMute(false, userId);
      });
      socket.current.emit(ACTIONS.JOIN, {
          roomId,
          user,
      });


      async function captureMedia() {
        try{
         localMediaStream.current = await navigator.mediaDevices.getUserMedia({
           audio: true
         });
        } catch(err){
         console.log(err);
        }
       }

       async function handleNewPeer({peerId, createOffer, user: remoteUser}) {
        if(peerId in connections.current){
          return console.warn(`you are already connected with ${peerId} (${user.name})`)
        }
  
        connections.current[peerId] = new RTCPeerConnection({
          iceServers: freeice()
        });
  
        // handle ice candidate
        connections.current[peerId].onicecandidate = (event) => {
          socket.current.emit(ACTIONS.RELAY_ICE, {
            peerId,
            icecandidate: event.candidate
          })
        }
  
        // handle ontrack on this connection
        connections.current[peerId].ontrack = ({streams: [remoteStream]}) => {
          addNewClients({...remoteUser, muted: true}, () => {
         // get current users mute info
            // const currentUser = clientsRef.current.find(
            //     (client) => client.id === user.id
            // );
            // if (currentUser) {
            //     socket.current.emit(ACTIONS.MUTE_INFO, {
            //         userId: user.id,
            //         roomId,
            //         isMute: currentUser.muted,
            //     });
            // }
            if(audioElements.current[remoteUser.id]){
              audioElements.current[remoteUser.id].srcObject = remoteStream;
            }
  
            else{
              let isSettled = false;
              let intervalId = setInterval(() => {
                if(audioElements.current[remoteUser.id]){
                  audioElements.current[remoteUser.id].srcObject = remoteStream;
                }
  
                if(isSettled){
                  clearInterval(intervalId);
                }
              }, 1000)
            }
          })
        }
  
        // add local track to remote connections
        localMediaStream.current.getTracks().forEach(track => {
          connections.current[peerId].addTrack(track, localMediaStream.current)
        })
  
        // create offer
        if(createOffer){
          const offer = await connections.current[peerId].createOffer();
          await connections.current[peerId].setLocalDescription(offer);
  
          socket.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: offer
          })
        }
      }

      async function handleRemovePeer({peerId, userId}) {
        if(connections.current[peerId]){
          connections.current[peerId].close();
        }
  
        delete connections.current[peerId]
        delete audioElements.current[peerId]
        setClients(clients => clients.filter(client => client.id !== userId))
      }

      async function handleIceCandidate({peerId, icecandidate}){
        if(icecandidate){
          connections.current[peerId]?.addIceCandidate(icecandidate);
        }
      }

      async function handleSdpAnswer({peerId, sessionDescription}){
        const answer = new RTCSessionDescription(sessionDescription);
        await connections.current[peerId]?.setRemoteDescription(answer);
      }

      async function handleRemoteSdp({peerId, sessionDescription: remoteSessionDescription}){
        const offer = new RTCSessionDescription(remoteSessionDescription);
        await connections.current[peerId]?.setRemoteDescription(offer);
        
        // create the answer
        const answer = await connections.current[peerId].createAnswer();
        await connections.current[peerId]?.setLocalDescription(answer);
  
        socket.current.emit(ACTIONS.ANSWER_SDP, {
          peerId,
          sessionDescription: answer
        })
  
      }
  
      async function handleSetMute(isMute, userId){
        const clientIdx = clientsRef.current.map(client => client.id).indexOf(userId);
        if(clientIdx > -1){
          const connectedClients = [...clientsRef.current];
          connectedClients[clientIdx].muted = isMute;
          setClients(connectedClients)
        }
      }
    }

    initChat();
    
    return () => {
      if(localMediaStream.current){
        localMediaStream.current.getTracks().forEach(track => track.stop());
      }
      socket.current.emit(ACTIONS.LEAVE, {roomId, user})

      socket.current.off(ACTIONS.MUTE);
      socket.current.off(ACTIONS.UN_MUTE);
      socket.current.off(ACTIONS.ADD_PEER);
      socket.current.off(ACTIONS.REMOVE_PEER);
      socket.current.off(ACTIONS.ANSWER_SDP);
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    }
  }, [])


  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance
  }

    const handleMute = (isMute, userId) => {
    let isSettled = false;

    const intervalId = setInterval(() => {
      if(localMediaStream.current){
        localMediaStream.current.getTracks()[0].enabled = !isMute;
  
        if(isMute){
          socket.current.emit(ACTIONS.MUTE, {userId, roomId})
        }
        else{
          socket.current.emit(ACTIONS.UN_MUTE, {userId, roomId})
        }

        isSettled = true;
      }

      if(isSettled){
        clearInterval(intervalId)
      }
    }, 200)

  }

  return { clients, provideRef, handleMute }
  
}

