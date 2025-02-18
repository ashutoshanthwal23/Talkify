import { toast } from 'react-toastify';

const toastOptions = {
  position: "top-center",
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  style: {marginTop: "50px", }
  }

  
export const toastError = (msg) => {
  toast.error(msg, toastOptions);
}

export const toastSuccess = (msg) => {
  toast.success(msg, toastOptions);
}

