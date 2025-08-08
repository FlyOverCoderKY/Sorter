
import SortingVisualizer from './components/SortingVisualizer';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      {(theme) => (
        <div className="App" data-theme={theme.resolvedAppearance}>
          <SortingVisualizer />
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;