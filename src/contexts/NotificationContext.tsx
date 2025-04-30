import { createContext, useContext, ReactNode } from 'react';
import toast, { Toast } from 'react-hot-toast';

interface NotificationContextType {
  showSuccess: (message: string) => Toast;
  showError: (message: string) => Toast;
  showInfo: (message: string) => Toast;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const showSuccess = (message: string) => {
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
    });
  };

  const showError = (message: string) => {
    return toast.error(message, {
      duration: 5000,
      position: 'top-right',
    });
  };

  const showInfo = (message: string) => {
    return toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: '📢',
    });
  };

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}