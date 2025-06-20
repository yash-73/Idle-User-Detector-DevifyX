import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Clock, CirclePause, CirclePlay, Moon, Sun } from 'lucide-react';

import notification_sound from './assets/notification_sound.wav'

import UserSettings from './components/UserSettings'
import WarningWindow from './components/WarningWindow'

import {
  setTimeoutDuration,
  toggleSound,
  toggleDarkMode,
  setLoginStatus,
} from './store/userSlice';
import LoggedOut from './components/LoggedOut';

function App() {
  const dispatch = useDispatch();

 

  
  const timeoutDuration = useSelector((state) => state.user.timeoutDuration);
  const soundEnabled = useSelector((state) => state.user.soundEnabled);
  const darkMode = useSelector((state) => state.user.darkMode);
  const loginStatus =useSelector((state)=> state.user.loginStatus);
  
  const [warningWindow, setWarningWindow] = useState(false);
  const [stopListener, setStopListener] = useState(false);
  
  const [lastActivity, setLastActivity] = useState(new Date(Date.now()));
  const [openSettings, setOpenSettings] = useState(true);
  const [passTime, setPassTime] = useState(timeoutDuration * 60);

  const intervalRef = useRef(null);

  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

  const lastActTime = {
    hours: lastActivity.getHours().toString().padStart(2, '0'),
    minutes: lastActivity.getMinutes().toString().padStart(2, '0'),
    seconds: lastActivity.getSeconds().toString().padStart(2, '0'),
  };

   const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-200 text-gray-900';
  
  const cardClasses = darkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';
  
  const inputClasses = darkMode 
    ? 'bg-gray-700 border-gray-600 text-white' 
    : 'bg-white border-gray-300 text-gray-900';

   
  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setPassTime((prev) => {
        if (prev <= 0) {
          setWarningWindow(true);
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopInterval = useCallback(() => {
    setStopListener(true);
    clearInterval(intervalRef.current);
  }, []);

  const resetTimer = useCallback(() => {
    const seconds = timeoutDuration * 60;
    setPassTime(seconds);
    setWarningWindow(false);
    setLastActivity(new Date(Date.now()));
    startInterval();
  }, [timeoutDuration, startInterval]);

  const handleActivity = useCallback(() => {
    if (!stopListener) {
      resetTimer();
    }
  }, [stopListener, resetTimer]);

  const resumeDetection = useCallback(() => {
    setStopListener(false);
    startInterval();
  }, [startInterval]);

 
  const handleTimeoutChange = useCallback((newDuration) => {
    dispatch(setTimeoutDuration(newDuration));
    setPassTime(newDuration * 60);
    setWarningWindow(false);
    setLastActivity(new Date(Date.now()));
    if (!stopListener) {
      startInterval();
    }
  }, [dispatch, startInterval, stopListener]);

  
  const handleSoundToggle = useCallback(() => {
    dispatch(toggleSound());
  }, [dispatch]);


  const handleDarkModeToggle = useCallback(() => {
    dispatch(toggleDarkMode());
  }, [dispatch]);

 
  useEffect(() => {
    setPassTime(timeoutDuration * 60);
  }, [timeoutDuration]);


  useEffect(() => {
    if (!stopListener) {
      events.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });
      startInterval();
    } else {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(intervalRef.current);
    }

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(intervalRef.current);
    };
  }, [handleActivity, startInterval, stopListener]);

useEffect(()=>{
  if (warningWindow && soundEnabled) {
            const audio = new Audio(notification_sound);
            audio.play();
          }
},[warningWindow, soundEnabled])





  return loginStatus ? (
    <div className={`min-h-screen p-4 flex flex-col items-center transition-colors duration-300 ${themeClasses}`}>
      <div className='w-[60%] flex flex-row items-center relative justify-between'>
        <h1 className=' justify-between text-center font-semibold text-[30px] m-4 text-[rgb(70,70,200)]'>
          Idle User Detector
        </h1>
        <button className='absolute right-0 cursor-pointer' onClick={handleDarkModeToggle}>
          {darkMode ? <Sun /> : <Moon />}
        </button>
      </div>

      <div className='w-[80%] max-md:w-full
       rounded-xl text-center font-semibold text-[18px] flex flex-col 
      justify-start items-center p-4'>

        <div className={`${cardClasses} w-[80%] max-md:w-full  border-[1px] rounded-md text-left p-4 font-medium m-4`}>
          Welcome, User
        </div>

        <div className={`${cardClasses} w-[80%] max-md:w-full justify-between p-4 items-center text-[16px] rounded-lg  border-[1px] flex flex-col font-light`}>
          <div className='text-[20px] flex flex-row items-center gap-2 self-start font-medium mb-4'>
            <Clock />
            <p>Status</p>
          </div>

          <div className='flex flex-col w-full gap-2 max-md:text-[15px]'>
            <div className='flex flex-row justify-between w-full'>
              <p>User status</p>
              <p className={`${loginStatus ? 'text-green-600 bg-green-400/25' : 'text-red-500 bg-red-500/25'} rounded-xl px-2 font-semibold`}>
                {loginStatus ? 'Logged In' : 'Logged Out'}
              </p>
            </div>

            <div className='flex flex-row w-full justify-between'>
              <p>Last Activity</p>
              <p>{`${lastActTime.hours} : ${lastActTime.minutes} : ${lastActTime.seconds}`}</p>
            </div>

            <div className='flex flex-row w-full justify-between'>
              <p>Remaining Time</p>
              <p>{`${Math.floor(passTime / 60)}m ${passTime % 60}s`}</p>
            </div>

            <div className='flex flex-row justify-between'>
              <p>Detection</p>
              {!stopListener ?
                <button onClick={stopInterval}
                  className='focus:outline-none md:text-[15px] cursor-pointer flex flex-row justify-evenly px-2 items-center text-green-600 font-semibold bg-green-400/25 rounded-xl'>
                  <CirclePause className='h-[80%]' />
                  <p>Pause Detection</p>
                </button> :

                <button onClick={resumeDetection}
                  className='focus:outline-none text-[15px] cursor-pointer flex flex-row justify-evenly px-2 items-center text-gray-600 font-semibold bg-gray-500/25 rounded-xl'>
                  <CirclePlay className='h-[80%]' />
                  <p>Resume Detection</p>
                </button>
              }
            </div>
          </div>
        </div>

        {openSettings && <UserSettings
        themeClasses={themeClasses}
        cardClasses={cardClasses}
        inputClasses={inputClasses}
          timeoutDuration={timeoutDuration}
          handleTimeoutChange={handleTimeoutChange}
          soundEnabled={soundEnabled}
          setSoundEnabled={handleSoundToggle}
          darkMode={darkMode}
          setDarkMode={handleDarkModeToggle}
        />}
      </div>

      {warningWindow && <WarningWindow 
      themeClasses={themeClasses}
      cardClasses={cardClasses}
      inputClasses={inputClasses}
        onContinue={resetTimer}

        onLogout={() => {
          setLoginStatus(false);
          setWarningWindow(false);
          setStopListener(true);
        }}
      />}
    </div>
  ) : (
    <LoggedOut/>
  );
}

export default App;