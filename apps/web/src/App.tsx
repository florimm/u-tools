import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ToolsPage from './pages/ToolsPage';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ToolsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
