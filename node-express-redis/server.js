import express from 'express';
import cors from 'cors';
import redis from 'redis';

const port = 50001;
const app = express();

const redisClient = redis.createClient({ host: 'redis' });

redisClient.on('error', error => {
  console.log('redis: GET ERROR');
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
  console.log('listening on port', port);
});
