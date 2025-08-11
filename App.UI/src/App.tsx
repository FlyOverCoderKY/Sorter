
import SortingVisualizer from './components/SortingVisualizer';
import AppHeader from './components/AppHeader';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      {(theme) => (
        <div className="App" data-theme={theme.resolvedAppearance}>
          <AppHeader
            title="Sorting Algorithm Visualizer"
            subtitle="Watch different sorting algorithms in action and learn how they work"
          />
          <SortingVisualizer />
          <Footer />
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;