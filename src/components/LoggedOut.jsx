import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {setLoginStatus} from '../store/userSlice'
import { useNavigate } from 'react-router-dom';
export default function LoggedOut() {

    const dispatch = useDispatch()
    const loginStatus = useSelector((state)=> state.user.loginStatus);
    const navigate = useNavigate()
    const darkMode = useSelector((state)=> state.user.darkMode)

     const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-200 text-gray-900';
  
  const cardClasses = darkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';
  
  const inputClasses = darkMode 
    ? 'bg-gray-700 border-gray-600 text-white' 
    : 'bg-white border-gray-300 text-gray-900';


    const handleLogin = ()=>{
        dispatch(setLoginStatus(true));
        navigate('/')
    }

  return (
    <div className={ `${themeClasses} min-h-screen  flex w-full items-center justify-center`}>
        <div className={`flex flex-col  items-center ${cardClasses} gap-4 justify-evenly p-4 rounded-lg border-gray-500 h-[200px] `}>
        <div className='text-[20px] font-semibold' >
            User Logged Out
        </div>
        <div className='text-[16px] font-semibold'>You have been logged out due to inactivity</div>
     
        <button className='bg-green-400/25 cursor-pointer text-green-600 px-4 py-2 rounded-md font-extrabold ' onClick={handleLogin}>Login</button>
        </div>
    </div>
  )
}
