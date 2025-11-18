import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import Layout from './components/Layout';
import DataGridPage from './routes/DataGridPage';
import CarDetailPage from './routes/CarDetailPage';

const App = () => {
  return (
    <>
      <CssBaseline />
      <Layout>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<DataGridPage />} />
            <Route path="/cars/:id" element={<CarDetailPage />} />
          </Routes>
        </Container>
      </Layout>
    </>
  );
};

export default App;
