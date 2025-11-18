const express = require('express');
const cors = require('cors');
require('dotenv').config();

const carsRoutes = require('./routes/cars');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'BMW Aptitude Test API is running' });
});

app.use('/api/cars', carsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
