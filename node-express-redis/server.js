import express from 'express';
import cors from 'cors';
import redis from 'redis';

const port = process.env.PORT || 50001;
const app = express();
let redisHostname = 'localhost';

if (process.env.NODE_ENV == 'production') {
  redisHostname = 'redis';
}

const redisClient = redis.createClient({ host: redisHostname });

redisClient.on('error', error => {
  console.error(error);
});

// 測試 redis
// redisClient.del('count') 官方文件沒寫到，但有此方法
// redisClient.get('count', (error, reply) => {
//   console.log('count:', reply)
//   if (reply == null) {
//     redisClient.set('count', 0);
//   } else {
//     redisClient.set('count', ++reply);
//   }
//   console.log('count:', reply)
//   redisClient.quit();
// });

app.use(cors());
app.use(express.static('.'));

app.get('/count', (req, res, next) => {
  redisClient.get('count', (error, reply) => {
    if (reply == null) {
      redisClient.set('count', 0);
    } else {
      redisClient.set('count', ++reply);
    }
    res.json({ count: reply });
  });
});

app.listen(port, () => {
  console.log(process.env.NODE_ENV, process.env.PORT);
  console.log('listening on port', port);
});
