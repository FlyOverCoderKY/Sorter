
import SortingVisualizer from './components/SortingVisualizer';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      {(theme) => (
        <div className="App" data-theme={theme.resolvedAppearance}>
          <SortingVisualizer />
          <Footer />
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;