/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/group-exports */
import { toast } from 'react-hot-toast';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorMessages = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde.',
  NOT_FOUND: 'Recurso não encontrado.',
  UNAUTHORIZED: 'Você não tem permissão para realizar esta ação.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  UNKNOWN_ERROR: 'Ocorreu um erro inesperado.',
} as const;

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message.includes('Network Error')) {
      return new AppError(errorMessages.NETWORK_ERROR, 'NETWORK_ERROR');
    }

    if (error.message.includes('404')) {
      return new AppError(errorMessages.NOT_FOUND, 'NOT_FOUND', 404);
    }

    if (error.message.includes('401') || error.message.includes('403')) {
      return new AppError(errorMessages.UNAUTHORIZED, 'UNAUTHORIZED', 401);
    }

    if (error.message.includes('validation')) {
      return new AppError(errorMessages.VALIDATION_ERROR, 'VALIDATION_ERROR', 400);
    }
  }

  return new AppError(errorMessages.UNKNOWN_ERROR, 'UNKNOWN_ERROR');
}

export function showErrorToast(error: unknown): void {
  const appError = handleError(error);
  toast.error(appError.message);
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
