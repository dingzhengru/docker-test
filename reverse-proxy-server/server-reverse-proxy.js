import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const port = 3000;
const targetHost = 'http://api.caza7.re888show.com';
// const proxyOptions = {
//   // 詳細設置
//   target: targetHost, // target host
//   changeOrigin: true, // needed for virtual hosted sites
//   ws: true, // proxy websockets
//   pathRewrite: {
//     '^/api/old-path': '/api/new-path', // rewrite path
//     '^/api/remove/path': '/path', // remove base path
//   },
//   router: {
//     // when request.headers.host == 'dev.localhost:3000',
//     // override target 'http://www.example.org' to 'http://localhost:8000'
//     'dev.localhost:3000': 'http://localhost:8000',
//   },
// };

const apiProxy = createProxyMiddleware('/api', { target: targetHost, changeOrigin: true });

const app = express();
app.use(cors());
app.use(apiProxy);
app.use(express.static('.'));

app.listen(port, () => {
  console.log(`server-reverse-proxy listening ${port}`);
});
