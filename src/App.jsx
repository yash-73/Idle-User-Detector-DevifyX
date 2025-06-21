import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Clock, CirclePause, CirclePlay, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {setTimeoutDuration, toggleSound, toggleDarkMode, setLoginStatus,} from './store/userSlice';

import notification_sound from './assets/notification_sound.wav'

import UserSettings from './components/UserSettings'
import WarningWindow from './components/WarningWindow'
import LoggedOut from './components/LoggedOut';
import './i18n';


function App() {
  const dispatch = useDispatch();

 
  const { t, i18n } = useTranslation();

  //global states 
  const language = useSelector((state) => state.user.language);
  const timeoutDuration = useSelector((state) => state.user.timeoutDuration);
  const soundEnabled = useSelector((state) => state.user.soundEnabled);
  const darkMode = useSelector((state) => state.user.darkMode);
  const loginStatus =useSelector((state)=> state.user.loginStatus);
  
  //for rendering warning prompt
  const [warningWindow, setWarningWindow] = useState(false);

  //to stop the timer 
  const [stopListener, setStopListener] = useState(false);
  
  //to record last known activity
  const [lastActivity, setLastActivity] = useState(new Date(Date.now()));

  const [openSettings, setOpenSettings] = useState(true);

  //to render how much time is left before warning window pops up
  const [passTime, setPassTime] = useState(timeoutDuration * 60);

  //to refer to the timer function
  const intervalRef = useRef(null);

  //events that can be considered as activity
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];


  //extracting hours, minutes and seconds for displaying last activity time
  const lastActTime = {
    hours: lastActivity.getHours().toString().padStart(2, '0'),
    minutes: lastActivity.getMinutes().toString().padStart(2, '0'),
    seconds: lastActivity.getSeconds().toString().padStart(2, '0'),
  };


  //css for dark and light mode
   const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-200 text-gray-900';
  
  const cardClasses = darkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';
  
  const inputClasses = darkMode 
    ? 'bg-gray-700 border-gray-600 text-white' 
    : 'bg-white border-gray-300 text-gray-900';

   
  //Timer function
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

  //Function to stop timer
  const stopInterval = useCallback(() => {
    setStopListener(true);
    clearInterval(intervalRef.current);
  }, []);


  //reset the timer when any activity is encountered
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


  //listen to each event for activity
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

  //Play alert sound as warning window pops up
useEffect(()=>{
  if (warningWindow && soundEnabled) {
            const audio = new Audio(notification_sound);
            audio.play();
          }
},[warningWindow, soundEnabled])


//apply persisted language 
useEffect(() => {
  if (language === 'Hindi') {
    i18n.changeLanguage('hi');
  } else {
    i18n.changeLanguage('en');
  }
}, [language, i18n]);

  return loginStatus ? (
    <div className={`min-h-screen p-4 flex flex-col items-center transition-colors duration-300 ${themeClasses}`} role="main" aria-label="Idle User Detector Main Content">
      <div className='w-[60%] max-md:w-full flex flex-row items-center relative justify-between' aria-label="Header">
        <h1 className=' justify-between text-center font-semibold text-[30px] m-4 text-[rgb(70,70,200)]' id="main-title">
          {t('app_title')}
        </h1>
        <button className=' cursor-pointer' aria-label='Toggle dark mode' onClick={handleDarkModeToggle}>
          {darkMode ? <Sun aria-label="Light mode icon" /> : <Moon aria-label="Dark mode icon" />}
        </button>
      </div>

      <div className='w-[80%] max-md:w-full rounded-xl text-center font-semibold text-[18px] flex flex-col justify-start items-center p-4' aria-label="Main Card Area">

        <div className={`${cardClasses} w-[80%] max-md:w-full  border-[1px] rounded-md text-left p-4 font-medium m-4`} aria-label="Welcome Card">
          {t('welcome')}
        </div>

        <div className={`${cardClasses} w-[80%] max-md:w-full justify-between p-4 items-center text-[16px] rounded-lg  border-[1px] flex flex-col font-light`} aria-label="Status Card">
          <div className='text-[20px] flex flex-row items-center gap-2 self-start font-medium mb-4'>
            <Clock aria-label="Clock Icon" />
            <p>{t('status')}</p>
          </div>

          <div className='flex flex-col w-full gap-2 max-md:text-[15px]'>
            <div className='flex flex-row justify-between w-full'>
              <p>{t('user_status')}</p>
              <p className={`${loginStatus ? 'text-green-600 bg-green-400/25' : 'text-red-500 bg-red-500/25'} rounded-xl px-2 font-semibold`} aria-label={loginStatus ? t('user_is_logged_in') : t('user_is_logged_out')}>
                {loginStatus ? t('logged_in') : t('logged_out')}
              </p>
            </div>

            <div className='flex flex-row w-full justify-between'>
              <p>{t('last_activity')}</p>
              <p aria-label={t('last_activity_time', { time: `${lastActTime.hours}:${lastActTime.minutes}:${lastActTime.seconds}` })}>{`${lastActTime.hours} : ${lastActTime.minutes} : ${lastActTime.seconds}`}</p>
            </div>

            <div className='flex flex-row w-full justify-between'>
              <p>{t('remaining_time')}</p>
              <p aria-label={t('remaining_time_aria', { minutes: Math.floor(passTime / 60), seconds: passTime % 60 })}>{`${Math.floor(passTime / 60)}m ${passTime % 60}s`}</p>
            </div>

            <div className='flex flex-row justify-between'>
              <p>{t('detection')}</p>
              {!stopListener ?
                <button onClick={stopInterval}
                  className='focus:outline-none md:text-[15px] cursor-pointer flex flex-row justify-evenly px-2 items-center text-green-600 font-semibold bg-green-400/25 rounded-xl'
                  aria-label={t('pause_detection')}>
                  <CirclePause className='h-[80%]' aria-label="Pause Icon" />
                  <p>{t('pause_detection')}</p>
                </button> :

                <button onClick={resumeDetection}
                  className='focus:outline-none text-[15px] cursor-pointer flex flex-row justify-evenly px-2 items-center text-gray-600 font-semibold bg-gray-500/25 rounded-xl'
                  aria-label={t('resume_detection')}>
                  <CirclePlay className='h-[80%]' aria-label="Play Icon" />
                  <p>{t('resume_detection')}</p>
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