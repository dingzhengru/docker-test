# docker-test

測試 docker 的專案

## Image 與 Container

**container 是 image 運行的 instance**，像是 object 是 class 的 instance

### docker get started

```bash
docker build -t <container-name> <目標目錄>
docker run -d --name <指定 container 一個名稱> -p 外部port:內部port <container-name>
```

## Dockerfile

- 要把環境跟程式碼包成一個 image，需要一個 Dockerfile 檔案來撰寫打包的流程
- 參考文章: https://ppt.cc/fX6LEx

### FROM

- 這裡要填入的是 Base image，就是你的基底環境
- 可以在 https://hub.docker.com/search?q=&type=image 找對應的環境
- node 範例: node:lts, node:lts-slim, node:lts-alpine, node:12.18.0

`FROM node:lts`

### WORKDIR

指定當前工作目錄，等同於`cd`，不過目錄不存在的話，會幫你創建

`WORKDIR: /`

### 安裝所需的檔案

- 利用 COPY 與 RUN 來安裝你的專案
- COPY <複製目標> <目的地>
- RUN <指令>，可用 && 相隔 ex: `RUN npm install && npm cache clean --force`

```
COPY package.json /
RUN npm install
```

### 設定忽略的檔案

- 建立 .dockerignore 檔案，寫入要忽略的檔案或目錄 ex: node_modules/

### 聲明運行時容器提供的服務端口

寫這行指令的功用是要讓開發者能夠快速得知此專案在容器內所運行的端口，執行 images 時並不會因為這個聲明應用就會開啟這個端口的服務

`EXPOSE 8080`

### 設定預設指令

當 image 跑起來時要執行的指令

`CMD [ "npm", "start" ]`

## Build

建立 image
`docker build -t 專案名稱 .`

## Run

執行 image

- -d : 背景執行
- -h : 自訂 host name
- -i : 進入互動模式
- -p : 設定要對外開啟的 port 號 mapping，前者是外部，後者是內部
- -u : 設定 username
- --name : 自訂 docker container 的名稱
- -v : 設定從外部掛載資源到 container 中。

```
docker run -d --name <container-name> -p <port>:<port> <專案名稱>
docker run -d --name docker-test-container -p 50001:50001 docker-test
```

## 指令

### build

### run

### image
- 參考: https://docs.docker.com/engine/reference/commandline/image/
- 查看，`docker image ls` 或 `docker image ls -a`
- 刪除，`docker image rm <image-id>` 或強制刪除 `docker image rm -f <image-id>`
### images
- 參考: https://docs.docker.com/engine/reference/commandline/images/
- 查看，`docker images` 或 `docker images -a`
- 刪除全部: `docker rmi -f $(docker images -a -q)`，後面的語法是迭代器，建議先刪除全部的 container 後再執行

### container
- 參考: https://docs.docker.com/engine/reference/commandline/container/
- 參考: https://docs.docker.com/engine/reference/commandline/container_ls/
- 查看，`docker container ls` 或 `docker container ls -a`
- 刪除全部: `docker rm -vf $(docker ps -a -q)` 或 `docker rm -vf $(docker container ls -a -q)`，後面的語法是迭代器