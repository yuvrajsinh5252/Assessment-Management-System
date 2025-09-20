const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'Assessment Management API',
    endpoints: {
      signup: { method: 'POST', path: '/auth/signup' },
      login: { method: 'POST', path: '/auth/login' },
      generateReport: { method: 'POST', path: '/generate-report' },
      listSessions: { method: 'GET', path: '/sessions' },
    },
  });
});

app.use('/auth', authRoutes);
app.use('/', reportRoutes);

app.use('/reports', express.static(path.join(__dirname, '../reports')));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected error occurred' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
