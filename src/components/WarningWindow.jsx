import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function WarningWindow({ onContinue, onLogout, themeClasses, cardClasses, inputClasses }) {
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate()
  const { t } = useTranslation();

  const warningMessage = useSelector((state) => state.user.warningMessage)
  useEffect(() => {
    if (countdown <= 0) {
      if (onLogout){
         onLogout();
         navigate('/timeout')
      }
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onLogout]);

  return (
    <div className={`fixed inset-0 ${themeClasses} backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50`}>
      <div className={`${cardClasses} p-6 rounded-lg shadow-lg max-w-md w-full mx-4`}>
        <h2 className="text-xl font-bold mb-4 text-center text-red-600">{t('session_timeout_warning')}</h2>
        <p className="mb-4 text-center">{warningMessage}</p>
        <p className="mb-4 text-center text-lg font-semibold">{t('logging_out_in')} <span className="text-red-500">{countdown} {t('seconds')}</span></p>
        
      </div>
    </div>
  );
}
