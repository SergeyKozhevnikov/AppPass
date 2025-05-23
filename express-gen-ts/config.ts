import path from 'path';
import dotenv from 'dotenv';
import moduleAlias from 'module-alias';

// Configure "dotenv"
const result2 = dotenv.config({
  path: path.join(__dirname, './.env'),
});
if (result2.error) {
  throw result2.error;
}

// Configure moduleAlias
if (__filename.endsWith('js')) {
  moduleAlias.addAlias('@src', __dirname + '/dist');
}
