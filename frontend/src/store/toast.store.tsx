import { create } from 'zustand';
import toast from 'react-hot-toast';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import InfoIcon from '@mui/icons-material/InfoOutline';
import React from 'react';
import { colors } from '@/shared/styles/colors';

export type ToastType = 'success' | 'error' | 'info';

interface ToastStore {
  showToast: (message: string, type: ToastType) => void;
}

let toastId: string | null = null;

export const useToastStore = create<ToastStore>(() => ({
  showToast: (message: string, type: ToastType) => {
    const commonStyles: React.CSSProperties = {
      fontSize: '14px',
      padding: '10px',
      borderRadius: '8px',
    };

    const successStyle: React.CSSProperties = {
      ...commonStyles,
      backgroundColor: `${colors.white}`,
      color: `${colors.graphite}`,
    };

    const errorStyle: React.CSSProperties = {
      ...commonStyles,
      backgroundColor: `${colors.error}`,
      color: `${colors.white}`,
    };

    const infoStyle: React.CSSProperties = {
      ...commonStyles,
      backgroundColor: `${colors.gray}`,
      color: `${colors.white}`,
    };

    const newToastId = `${type}-${Date.now()}`;
    const successTestId = `toast-${newToastId}`;

    if (toastId) {
      toast.dismiss(toastId);
    }

    const duration = 5000;
    const renderMessage = <span>{message}</span>;

    switch (type) {
      case 'success':
        toastId = toast.success(
          <span data-testid={successTestId}>{renderMessage}</span>,
          {
            style: successStyle,
            id: newToastId,
            duration,
            icon: <CheckIcon style={{ marginRight: '-4px' }} />,
          },
        );
        break;
      case 'error':
        toastId = toast.error(
          <span data-testid="toast-error">{renderMessage}</span>,
          {
            style: errorStyle,
            id: newToastId,
            duration,
            icon: <ErrorIcon style={{ marginRight: '-4px' }} />,
          },
        );
        break;
      case 'info':
        toastId = toast(<span data-testid="toast-info">{renderMessage}</span>, {
          style: infoStyle,
          id: newToastId,
          duration,
          icon: <InfoIcon style={{ marginRight: '-4px' }} />,
        });
        break;
      default:
        break;
    }
  },
}));
