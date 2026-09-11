import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './pages/Dashboard';
import { TransactionsPage } from './pages/TransactionsPage';
import { NotesPage } from './pages/NotesPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gastos" element={<TransactionsPage type="expense" title="Gastos" />} />
          <Route path="/ingresos" element={<TransactionsPage type="income" title="Ingresos" />} />
          <Route path="/notas" element={<NotesPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
