const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const routes = require('./routes');
const bodyParser = require('body-parser');
const path = require('path')
require('dotenv').config();
const cors = require('cors');

// Connection to DB
const uri = process.env.URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connected');
});

app.use(cors());
// app.use(express.static('uploads'));
// app.use(express.static('build/index.html'));
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

//project Route
app.use('/project', routes.projectRoutes);

app.get('*', (req, res) => {
  // res.sendFile(__dirname + '/build/index.html');
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log('App is listetning on PORT', PORT);
});
