import express from 'express';
import cors from 'cors';

const port = 50001;
const app = express();

app.use(cors());
app.use(express.static('./'));

app.listen(port, () => {
  console.log('listening on port', port);
});
