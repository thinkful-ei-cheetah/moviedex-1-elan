'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const movies = require('./movies.json');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if(!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});


app.get('/movies', (req, res) => {
  const { genre, country, avg_vote } = req.query;
  const vote = parseFloat(avg_vote);
  let output = movies;
  if(genre) {
    output = output.filter(movie => {
      return movie.genre.toLowerCase().includes(genre.toLowerCase());
    });
  }

  if(country) {
    output = output.filter(movie => {
      return movie.country.toLowerCase().includes(country.toLowerCase());
    });
  }

  if(avg_vote) {
    output = output.filter(movie => {
      return movie.avg_vote >= vote;
    });
  }
  
  res.send(output);
});

const PORT = 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));