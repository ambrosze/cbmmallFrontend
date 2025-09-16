import { useEffect, useState } from 'react'

const useNetworkStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const updateNetworkStatus = (): void => {
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine)
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', updateNetworkStatus)
      window.addEventListener('offline', updateNetworkStatus)

      // Cleanup event listeners on component unmount
      return () => {
        window.removeEventListener('online', updateNetworkStatus)
        window.removeEventListener('offline', updateNetworkStatus)
      }
    }
  }, [])

  return isOnline
}

export default useNetworkStatus
