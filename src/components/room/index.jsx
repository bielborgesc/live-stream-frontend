import React, { useState, useEffect } from "react"
import './index.css';

import { Button, Input } from 'antd';
import { Layout, Col, Row, Space } from 'antd';
import { VideoCameraOutlined, WindowsOutlined, AudioOutlined } from "@ant-design/icons";
const { Header, Content, Footer } = Layout;

function RoomComponent() {
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharedOn, setScreenSharedOn] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [mapPeers, setMapPeers] = useState({});

  const [usernameInput, setUsernameInput] = useState('');
  const [showUsernameInput, setShowUsernameInput] = useState(true);
  const [personUsername, setPersonUsername] = useState('');

  const [messageInput, setMessageInput] = useState('');
  const messageList = document.querySelector('#message-list');

  let webSocket;
  var localStream = new MediaStream();

  const constraints = {
    video: true,
    audio: true,
  }

  const onClickMic = () => {
    const audioTracks = localStream.getAudioTracks();
    audioTracks[0].enabled = !audioTracks[0].enabled
    // setMicOn(audioTracks[0].enabled);
  }

  const onClickCamera = () => {
    const videoTracks = localStream.getVideoTracks();
    videoTracks[0].enabled = !videoTracks[0].enabled;
    // setCameraOn(videoTracks[0].enabled);
  }
  
  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      const localVideo = document.getElementById('localVideo')

      localStream = stream;  
      localVideo.srcObject = localStream;
      localVideo.muted = true;
  
      const audioTracks = stream.getAudioTracks();
      const videoTracks = stream.getVideoTracks();
  
      audioTracks[0].enabled = true;
      videoTracks[0].enabled = true;
    })
    .catch(error => {
      console.log("Error accessing media devices: " + error);
    })

  const sendSignal = (action, message) =>{
    const jsonStr = JSON.stringify({
      'peer': usernameInput,
      'action': action,
      'message': message,
    });
  
    webSocket.send(jsonStr)
  }

  const addLocalTracks = (peer) =>{
    localStream.getTracks().forEach(track => {
      peer.addTrack(track, localStream);
    });
  
    return;
  }

  const dcOnMessage = (event) => {
    const message = event.data;

    const li = document.createElement('li');
    li.appendChild(document.createTextNode(message));
    messageList.appendChild(li);
  }

  const createVideo = (peerUsername) => {
    const videoContainer = document.querySelector('#video-container');
  
    const remoteVideo = document.createElement('video');
    remoteVideo.id = peerUsername + '-video';
    remoteVideo.autoplay = true;
    remoteVideo.playsinline = true;
    remoteVideo.className = 'video';

    const videoWrapper = document.createElement('div');
    videoWrapper.appendChild(remoteVideo);
    videoContainer.appendChild(videoWrapper);

    
    return remoteVideo;
  }

  const setOnTrack = (peer, remoteVideo) => {
    const remoteStream = new MediaStream();
    
    remoteVideo.srcObject = remoteStream;
  
    peer.addEventListener('track', async (event) => {
      remoteStream.addTrack(event.track, remoteStream);
    });
  }

  const removeVideo = (video) => {
    const videoWrapper = video.parentNode;
  
    videoWrapper.parentNode.removeChild(videoWrapper);
  }

  const createAnswerer = (offer, peerUsername, receiver_channel_name) => {
    const peer = new RTCPeerConnection(null);

    addLocalTracks(peer);
  
    const dc = peer.createDataChannel('channel');
    
    let remoteVideo = createVideo(peerUsername);
    setOnTrack(peer, remoteVideo);
  
    peer.addEventListener('datachannel', (e) => {
      peer.dc = e.channel;
      peer.dc.addEventListener('open', () => {
        console.log('Connection opened!');
      });
      peer.dc.addEventListener('message', dcOnMessage)
      
      let mapPeers2 = mapPeers
      mapPeers2[peerUsername] = [peer, peer.dc];
      setMapPeers(mapPeers2);
    });
  
    peer.addEventListener('iceconnectionstatechange', () =>{
      const iceconnectionstate = peer.iceConnectionState;
  
      if( iceconnectionstate === 'failed' || iceconnectionstate === 'disconnected' || iceconnectionstate === 'closed' ){
        let mapPeers2 = mapPeers
        delete mapPeers2[peerUsername];
        setMapPeers(mapPeers2);
  
        if(iceconnectionstate === 'closed'){
          peer.close();
        }
  
        removeVideo(remoteVideo)
      }
    })
  
    peer.addEventListener('icecandidate', (event) => {
      if(event.candidate){
        console.log('New ice candidate: ', JSON.stringify(peer.localDescription));
  
        return;
      }
  
      sendSignal('new-answer', {
        'sdp': peer.localDescription,
        'receiver_channel_name': receiver_channel_name,
      });
    });
  
    peer.setRemoteDescription(offer)
      .then(() => {
        console.log('Remote description set successfully for %s.', peerUsername);
  
        return peer.createAnswer();
      })
      .then(a => {
        console.log('Answer created ');
  
        peer.setLocalDescription(a);
      })
  }

  const createOfferer = (peerUsername, receiver_channel_name) => {
    const peer = new RTCPeerConnection(null);
    addLocalTracks(peer);
  
    const dc = peer.createDataChannel('channel');
    dc.onopen = () => {
      console.log('Connection opened!');
    }
    dc.addEventListener('message', dcOnMessage)
  
    const remoteVideo = createVideo(peerUsername);
    setOnTrack(peer, remoteVideo);
    
    let mapPeers2 = mapPeers
    mapPeers2[peerUsername] = [peer, dc];
    setMapPeers(mapPeers2)

    peer.addEventListener('iceconnectionstatechange', () =>{
      const iceconnectionstate = peer.iceConnectionState;
      
      if( iceconnectionstate === 'failed' || iceconnectionstate === 'disconnected' || iceconnectionstate === 'closed' ){
        let mapPeers2 = mapPeers
        delete mapPeers2[peerUsername];
        setMapPeers(mapPeers2)
  
        if(iceconnectionstate === 'closed'){
          peer.close();
        }
  
        removeVideo(remoteVideo)
      }
    })
  
    peer.addEventListener('icecandidate', (event) => {
      if(event.candidate){
        console.log('New ice candidate: ', JSON.stringify(peer.localDescription));
  
        return;
      }
  
      sendSignal('new-offer', {
        'sdp': peer.localDescription,
        'receiver_channel_name': receiver_channel_name,
      });
    });
  
    peer.createOffer()
      .then(o => peer.setLocalDescription(o))
      .then(() => {
        console.log('Local description set successfully!');
      })
  }

  const webSocketOnMessage = (event) => {
    const parsedData = JSON.parse(event.data);
  
    const peerUsername = parsedData['peer'];
    const action = parsedData['action'];
    
    if(usernameInput == peerUsername){
      return;
    }
  
    const receiver_channel_name = parsedData['message']['receiver_channel_name'];
    
    if(action == 'new-peer'){
      createOfferer(peerUsername, receiver_channel_name);
      return;
    }

    if(action == 'new-offer'){
      const offer = parsedData['message']['sdp'];
      createAnswerer(offer, peerUsername, receiver_channel_name);
  
      return;
    }
  
    if(action == 'new-answer'){
      const answer = parsedData['message']['sdp'];
      const peer = mapPeers[peerUsername][0];
  
      peer.setRemoteDescription(answer)
  
      return;
    }
  }

  function getDataChannels(){
    let dataChannels = []; 

    for(let peerUsername in mapPeers){
      let dataChannel = mapPeers[peerUsername][1];
  
      dataChannels.push(dataChannel);
    }
  
    return dataChannels;
  
  }

  const btnJoin = () => {
    const username = usernameInput;

    console.log('username: ' + username);

    if(username === ''){
      return;
    }

    setUsernameInput('');
    setShowUsernameInput(false);
    setPersonUsername(username);

    webSocket = new WebSocket("ws://localhost:8000/")
    
    webSocket.addEventListener('open', (e) => {
      console.log("Connectiion Opened!")
      sendSignal('new-peer', {});
    });

    webSocket.addEventListener('message', webSocketOnMessage);

    webSocket.addEventListener('close', (e) => {
      console.log("Connectiion Closed!")
    });
  
    webSocket.addEventListener('error', (e) => {
      console.log("Error Occurred!")
    });
  }

  const btnSendMessage = () => {
    let message = messageInput;

    let li = document.createElement('li');
    li.appendChild(document.createTextNode('Me: ' + message));
    messageList.appendChild(li);

    const dataChannels = getDataChannels();
    
    message = personUsername + ': ' + message;
    
    for(let index in dataChannels){
      dataChannels[index].send(message);
    }

    setMessageInput('');
  }


  return (
    <Layout className="layout-area">
      <Header className="header-area">
        <div>
          <span className="logo">Fala Ai!</span>
        </div>
        <div>
          <Space.Compact style={{ width: '100%', display: showUsernameInput ? '' : 'none' }}>
            <Input value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} placeholder="Digite seu nome..."/>
            <Button type="primary" onClick={() => btnJoin()}>Entrar</Button>
          </Space.Compact>
          <h3>{personUsername !== '' ? personUsername : ''}</h3>
        </div>
      </Header>
      <Row style={{ height: 'calc(100vh)' }}>
        <Col sm={14} md={16} lg={16} xl={18} className="video-grid">
          <Content className="video-area" id="video-container">
            <div>
              <video id="localVideo" autoPlay></video>
            </div>
          </Content>
          <Footer className="footer-area" style={{ }}>
            <Button
              onClick={() => onClickCamera() }
              style={{
                background: cameraOn ? '' : 'red',
                color: cameraOn ? '' : '#FFF'
              }}>
              <VideoCameraOutlined />
            </Button>
            <Button
              onClick={() => setScreenSharedOn(!screenSharedOn)}
              style={{
                background: screenSharedOn ? '' : '#060212',
                color: screenSharedOn ? '' : '#FFF'
              }}>
              <WindowsOutlined />
            </Button>
            <Button              
              onClick={() => onClickMic()}
              style={{
                background: micOn ? '' : 'red',
                color: micOn ? '' : '#FFF'
              }}>
              <AudioOutlined />
            </Button>
            {/* Fala Ai! ©2023 Created by Jackson & Gabriel */}
          </Footer>
        </Col>
        <Col sm={10} md={8} lg={8} xl={6}>
          <Content className="chat-area">
            <div className="chat" id="message-list"></div>
            <div className="new-text-area">
              <Space.Compact style={{ width: '100%' }}>
                <Input value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Digite..." />
                <Button type="primary" onClick={() => btnSendMessage()}>Enviar</Button>
              </Space.Compact>
            </div>
          </Content>
        </Col>
      </Row>
    </Layout>
  )
}

export default RoomComponent;