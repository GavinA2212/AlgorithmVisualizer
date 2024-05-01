import './App.css';
import SortingVisualizer from './components/SortingVisualizer/SortingVisualizer';
import Navbar from './components/Navbar/Navbar';
import PathfindingVisualizer from './components/PathfindingVisualizer/PathfindingVisualizer';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/sort' element={<SortingVisualizer />} />
          <Route path='/pathfinder' element={<PathfindingVisualizer />} />
          <Route path="*" element={<SortingVisualizer />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;
