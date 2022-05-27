import express, { Express } from 'express';
import path from 'path';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import corsOptions from './config/cordOptions';
import { logger } from './middleware/logEvents';
import errorHandler from './middleware/errorHandler';

import root from './routes/root';
import users from './routes/api/users';
import notifications from './routes/api/notifications';

const app: Express = express();
const PORT = process.env.PORT || 3500;

class AppDAO {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.log('Could not connect to database', err);
      } else {
        console.log('Connected to database');
      }
    }); 
  }
}
// express works like a waterfall, therefore higher lines od code are executed before lower lines of code

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:
// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', root);
app.use('/users', users);
app.use('/notifications', notifications);

// app.all applies to all http methods (GET, POST, etc.)
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
