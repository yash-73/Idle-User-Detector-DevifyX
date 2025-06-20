import {useEffect, useState, useRef, useCallback} from 'react'
import {Settings} from 'lucide-react'
import {Moon, Sun,  Volume2, VolumeX, ChevronDown, ChevronUp, Globe, Bell } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setLanguage, setWarningMessage } from '../store/userSlice';
import { useTranslation } from 'react-i18next';

function UserSettings  ({ 
  themeClasses,
  cardClasses,
  inputClasses,
  timeoutDuration, 
  handleTimeoutChange, 
  soundEnabled, 
  setSoundEnabled,
  darkMode,
  setDarkMode,
  warningMessage: warningMessageProp,
  language: languageProp
}) {
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [language, setLanguageState] = useState(languageProp || 'English');
  const [warningMessage, setWarningMessageState] = useState(warningMessageProp || 'Your session will expire due to inactivity');
  const settingsRef = useRef(null);

  useEffect(() => {
    setLanguageState(languageProp || 'English');
  }, [languageProp]);
  useEffect(() => {
    setWarningMessageState(warningMessageProp || 'Your session will expire due to inactivity');
  }, [warningMessageProp]);

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSaveSettings = () => {
    setIsExpanded(false);
    dispatch(setLanguage(language));
    dispatch(setWarningMessage(warningMessage));
    if (language === 'Hindi') {
      i18n.changeLanguage('hi');
    } else {
      i18n.changeLanguage('en');
    }
  };

  return (
    <div 
      ref={settingsRef}
      className={`
        ${cardClasses}
        transition-colors duration-300
        w-[80%] max-md:w-full justify-between p-4 m-4 gap-4 items-center text-[16px] rounded-lg border-[1px] flex flex-col font-light `}
    >
    
      <div className='flex flex-row items-center justify-between w-full'>
        <div className='text-[20px] flex flex-row items-center gap-2 font-medium'>
          <Settings />
          <p>{t('settings')}</p>
        </div>
        <button 
          onClick={handleExpandToggle}
          className={`${themeClasses} cursor-pointer p-1 rounded-full transition-all duration-200 transform hover:scale-110`}
        >
          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
            <ChevronDown />
          </div>
        </button>
      </div>

  
      <div className='flex flex-col items-start w-full gap-4'>
        <div className='flex flex-col items-start w-full'>
          <p className='font-semibold m-4'>{t('timeout_duration')}</p>
          <select
            onChange={(e) => handleTimeoutChange(Number(e.target.value))}
            className={`${inputClasses}  w-full p-2 border-2 outline-none rounded-md`}
            value={timeoutDuration}
          >
            <option value={0.25} >{t('15_seconds')}</option>
            <option value={0.5} >{t('30_seconds')}</option>
            <option value={1}>{t('1_minute')}</option>
            <option value={5}>{t('5_minutes')}</option>
            <option value={10}>{t('10_minutes')}</option>
            <option value={15}>{t('15_minutes')}</option>
            <option value={30}>{t('30_minutes')}</option>
          </select>
        </div>

        <div className='flex flex-row w-full justify-between items-center'>
          <div className=' flex font-semibold items-center'>
            <Bell className='h-4 mr-2'/>
            <p>{t('enable_notifications_sound')}</p>
          </div>
          <button className='cursor-pointer' onClick={() => setSoundEnabled((prev) => !prev)}>
            {soundEnabled ?
              <Volume2 className='text-blue-500' />
              : <VolumeX className='text-gray-500' />
            }
          </button>
        </div>

      
        <div 
          className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className='w-full flex flex-col gap-4 pt-4 border-t '>
  
            <div className='flex flex-col items-start w-full'>
              <div className='flex flex-row items-center gap-2 mb-2'>
                <Globe className='w-4 h-4' />
                <p className='font-semibold'>{t('language')}</p>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguageState(e.target.value)}
                className={`${inputClasses} w-full p-2 border-2 outline-none  rounded-md`}
                aria-label={t('language')}
              >
                <option value="English">{t('english')}</option>
                <option value="Hindi">{t('hindi')}</option>
              </select>
            </div>

    
            <div className='flex flex-row w-full justify-between items-center'>
              <div className='flex flex-row items-center gap-2'>
                <Moon className='w-4 h-4' /> 
              <span className='font-semibold'>{t('dark_mode')}</span>
              </div>
              <button 
                className='cursor-pointer p-1  rounded-full relative'
                onClick={() => setDarkMode(!darkMode)}
              >
                  <div className={`w-12 h-6 rounded-full flex items-center  px-1 transition-all duration-300 ${darkMode ? 'bg-blue-500' : 'bg-gray-400'}  `}>
                    <div className={`w-4 h-4 bg-white  rounded-full transition-all absolute duration-300 ${darkMode ? 'translate-x-[150%]' : 'translate-x-0' }`}></div>
                  </div>   
              </button>
            </div>

            <div className='flex flex-col items-start w-full'>
              <p className='font-semibold mb-2'>{t('warning_message')}</p>
              <textarea 
                className={`${cardClasses} font-medium text-[15px] w-full outline-none border-[1px] rounded-lg p-2 min-h-[80px] resize-none transition-all duration-200  focus:shadow-sm`}
                placeholder={t('session_expire_inactivity')}
                value={warningMessage}
                onChange={(e) => setWarningMessageState(e.target.value)}
              />
            </div>

            {/* Save Settings Button */}
            <div className='flex justify-end w-full pt-2'>
              <button 
                onClick={handleSaveSettings}
                className='cursor-pointer px-6 m-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transform hover:scale-105'
              >
                {t('save_settings')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;