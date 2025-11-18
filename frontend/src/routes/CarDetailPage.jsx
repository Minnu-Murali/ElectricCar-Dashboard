import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`${API_BASE}/cars/${id}`);
        setCar(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCar();
  }, [id]);

  if (!car) {
    return <Typography>Loading...</Typography>;
  }

  const fields = [
    'Brand',
    'Model',
    'AccelSec',
    'TopSpeed_KmH',
    'Range_Km',
    'Efficiency_WhKm',
    'FastCharge_KmH',
    'RapidCharge',
    'PowerTrain',
    'PlugType',
    'BodyStyle',
    'Segment',
    'Seats',
    'PriceEuro',
    'Date',
  ];

  return (
    <Box>
      <Button variant="outlined" sx={{
        mb: 2,
    borderColor: '#223046f3',
    color: '#223046f3',
    '&:hover': {
      borderColor: '#223046f3',
      backgroundColor: 'rgba(34,48,70,0.08)', 
    },
  }} onClick={() => navigate(-1)}>
        Back
      </Button>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Car Detail 
        </Typography>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field}>
  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontStyle: 'italic' }}>
    {field}
  </Typography>

  <Typography variant="body1">
    {car[field]}
  </Typography>
</Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default CarDetailPage;
