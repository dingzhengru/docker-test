# docker rmi -f $(docker images -a -q)
docker rm -vf reverse-proxy
docker build --no-cache -t qwsd7869/reverse-proxy .
docker run -d -it -p 3000:3000 --name reverse-proxy qwsd7869/reverse-proxy