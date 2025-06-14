/* eslint-disable indent */
import { type ReactNode, createContext, useEffect, useReducer } from 'react';

interface Production {
  id: string;
  name: string;
  description?: string;
}

interface ProductionState {
  productions: Production[];
  selectedProduction: Production | null;
  isLoading: boolean;
  error: string | null;
}

type ProductionAction =
  | { type: 'SET_PRODUCTIONS'; payload: Production[] }
  | { type: 'SELECT_PRODUCTION'; payload: Production }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const COOKIE_NAME = 'selected_production';
const COOKIE_OPTIONS = {
  path: '/',
  secure: true,
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60,
};

const loadState = (): ProductionState => {
  try {
    const cookies = document.cookie.split(';');
    const selectedProductionCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${COOKIE_NAME}=`),
    );

    if (selectedProductionCookie) {
      const selectedProduction = JSON.parse(
        decodeURIComponent(selectedProductionCookie.split('=')[1]),
      );
      return {
        productions: [],
        selectedProduction,
        isLoading: false,
        error: null,
      };
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading production state:', error);
  }
  return {
    productions: [],
    selectedProduction: null,
    isLoading: false,
    error: null,
  };
};

const initialState: ProductionState = loadState();

function productionReducer(state: ProductionState, action: ProductionAction): ProductionState {
  let newState: ProductionState;

  switch (action.type) {
    case 'SET_PRODUCTIONS':
      newState = {
        ...state,
        productions: action.payload,
        error: null,
      };
      break;
    case 'SELECT_PRODUCTION':
      newState = {
        ...state,
        selectedProduction: action.payload,
      };
      if (action.payload) {
        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(action.payload))}; ${Object.entries(
          COOKIE_OPTIONS,
        )
          .map(([key, value]) => `${key}=${value}`)
          .join('; ')}`;
      } else {
        document.cookie = `${COOKIE_NAME}=; ${Object.entries({ ...COOKIE_OPTIONS, maxAge: 0 })
          .map(([key, value]) => `${key}=${value}`)
          .join('; ')}`;
      }
      break;
    case 'SET_LOADING':
      newState = {
        ...state,
        isLoading: action.payload,
      };
      break;
    case 'SET_ERROR':
      newState = {
        ...state,
        error: action.payload,
        isLoading: false,
      };
      break;
    default:
      return state;
  }

  return newState;
}

interface ProductionContextType extends ProductionState {
  selectProduction: (production: Production) => void;
  fetchProductions: () => Promise<void>;
  deselectProduction: () => void;
}

const ProductionContext = createContext<ProductionContextType | undefined>(undefined);

function ProductionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(productionReducer, initialState);

  const fetchProductions = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${import.meta.env.VITE_API_URL}/productions`);

      if (!response.ok) {
        throw new Error('Failed to fetch productions');
      }

      const data = await response.json();
      dispatch({ type: 'SET_PRODUCTIONS', payload: data });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const selectProduction = (production: Production) => {
    dispatch({ type: 'SELECT_PRODUCTION', payload: production });
  };
  const deselectProduction = () => {
    dispatch({ type: 'SELECT_PRODUCTION', payload: initialState.productions[0] });
  };

  useEffect(() => {
    fetchProductions();

    window.addEventListener('storage', () => {
      fetchProductions();
    });
  }, []);

  return (
    <ProductionContext.Provider
      value={{
        ...state,
        selectProduction,
        deselectProduction,
        fetchProductions,
      }}
    >
      {children}
    </ProductionContext.Provider>
  );
}

export { ProductionProvider, ProductionContext };
