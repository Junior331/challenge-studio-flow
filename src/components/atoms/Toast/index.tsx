import { Toaster } from 'react-hot-toast';

export function Toast() {
  return (
    <Toaster
      position='top-right'
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          duration: 3000,
          style: {
            background: '#22c55e',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#ef4444',
          },
        },
      }}
    />
  );
}
