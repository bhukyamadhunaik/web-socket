import React, { useState, useRef, useEffect } from 'react';
import {
  useLocation,
  useParams,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room Id has been copied');
    } catch (err) {
      toast.error('Failed to copy Room Id');
      console.log(err);
    }
  };

  const leaveRoom = () => {
    navigate('/');
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      const handleErrors = (err) => {
        console.log('Socket Error: ', err);
        toast.error('Socket connection falied, try again later');
        navigate('/');
      };

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
          }
          setClients(clients);

          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        console.log(`${username} left the room`);
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };

    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  if (!location.state) {
    return <Navigate to='/' />;
  }

  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img
              className='logoImage'
              src='/code-sync.png'
              alt='Logo'
            />
          </div>
          <h3>Connected</h3>
          <div className='clientsList'>
            {clients.map((c) => (
              <Client
                key={c.socketId}
                username={c.username}
              />
            ))}
          </div>
        </div>
        <button
          className='btn copyBtn'
          onClick={copyRoomId}
        >
          Copy Room ID
        </button>
        <button
          className='btn leaveBtn'
          onClick={leaveRoom}
        >
          Leave
        </button>
      </div>
      <div className='editorWrap'>
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => (codeRef.current = code)}
        />
      </div>
    </div>
  );
};

export default EditorPage;
