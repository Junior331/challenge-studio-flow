import { Toast } from './components/atoms';
import { ProductionProvider } from './contexts/production';
import { ScenesProvider } from './contexts/scenes';
import Routes from './routes';
import './styles/global.css';

function App() {
  return (
    <ProductionProvider>
      <ScenesProvider>
        <Routes />
        <Toast />
      </ScenesProvider>
    </ProductionProvider>
  );
}

export default App;
