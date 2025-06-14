import { ProductionProvider } from './contexts/production';
import { ScenesProvider } from './contexts/scenes';
import Routes from './routes';
import './styles/global.css';

function App() {
  return (
    <ProductionProvider>
      <ScenesProvider>
        <Routes />
      </ScenesProvider>
    </ProductionProvider>
  );
}

export default App;
