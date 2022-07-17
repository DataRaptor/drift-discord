import { toast } from 'react-toastify'

export const triggerToast = (message: string) => {
  toast(message, {
    position: 'bottom-right',
    autoClose: 7000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}
