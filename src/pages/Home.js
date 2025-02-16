import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const handleEnter = (e) => {
    if (e.code === 'Enter') {
      joinRoom();
    }
  };
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Sucessfully Created a New Room');
  };
  const joinRoom = () => {
    if (!roomId || !username) {
      return toast.error('All Fields Required');
    }
    navigate(`editor/${roomId}`, {
      state: {
        username,
      },
    });
  };
  return (
    <div className='homePageWrapper'>
      <div className='formWrapper'>
        <img
          className='homePageLogo'
          src='/code-sync.png'
          alt='Coding image'
        />
        <h4 className='mainLabel'>Invitation Room ID</h4>
        <div className='inputGroup'>
          <input
            className='inputBox'
            placeholder='ROOM ID'
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
            value={roomId}
            onKeyUp={handleEnter}
          />
          <input
            className='inputBox'
            placeholder='USERNAME'
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
            onKeyUp={handleEnter}
          />
          <button
            className='btn joinBtn'
            onClick={joinRoom}
          >
            Join
          </button>
          <span className='createInfo'>
            If you don't have an invite, create &nbsp;
            <a
              onClick={createNewRoom}
              href=''
              className='createNewBtn'
            >
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built with 💚 by &nbsp;
          <a
            target='_blank'
            href='https://vemula-karthik-portfolio.vercel.app'
          >
            Karthik
          </a>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
