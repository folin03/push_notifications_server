import { CorsOptions } from 'cors';
import { builtinModules } from 'module';

const whitelist = ['http://127.0.0.1:5500', 'http://localhost:3500'];
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin as string) !== -1 || !origin) {
      // take out !origin if not used locally
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

export = corsOptions;
