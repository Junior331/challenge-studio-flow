/* eslint-disable indent */
import { createContext, useEffect, useReducer } from 'react';
import { type ReactNode } from 'react';

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

const initialState: ProductionState = {
  productions: [],
  selectedProduction: null,
  isLoading: false,
  error: null,
};

function productionReducer(state: ProductionState, action: ProductionAction): ProductionState {
  switch (action.type) {
    case 'SET_PRODUCTIONS':
      return {
        ...state,
        productions: action.payload,
        error: null,
      };
    case 'SELECT_PRODUCTION':
      return {
        ...state,
        selectedProduction: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
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
