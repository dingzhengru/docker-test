import express from 'express';
import cors from 'cors';

const port = 50001;

const app = express();
app.use(cors());

app.get('/api/users', (req, res) => {
  const host = req.get('Host');
  const origin = req.get('Origin');
  const referer = req.get('Referer');
  const X_Forwarded_For = req.get('X-Forwarded-For');
  const X_Forwarded_Host = req.get('X-Forwarded-Host');
  console.log(`
    Host: ${host}
    Origin: ${origin}
    Referer: ${referer}
    X-Forwarded-For: ${X_Forwarded_For}
    X-Forwarded-Host: ${X_Forwarded_Host}
  `);
  res.send({ name: 'user01' });
});

app.listen(port, () => {
  console.log(`server-api listening ${port}`);
});
