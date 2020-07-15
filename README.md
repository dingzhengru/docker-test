# docker-test <!-- omit in toc -->

測試 docker 的專案

## Image 與 Container <!-- omit in toc -->

**container 是 image 運行的 instance**，像是 object 是 class 的 instance

- [Dockerfile](#dockerfile)
  - [FROM](#from)
  - [WORKDIR](#workdir)
  - [安裝所需的檔案](#安裝所需的檔案)
  - [設定忽略的檔案](#設定忽略的檔案)
  - [聲明運行時容器提供的服務端口](#聲明運行時容器提供的服務端口)
  - [設定預設指令](#設定預設指令)
  - [Build](#build)
  - [Run](#run)
  - [COPY 與 ADD 的差別](#copy-與-add-的差別)
- [Docker Compose](#docker-compose)
- [Dockerfile 其他參數](#dockerfile-其他參數)
  - [ENV](#env)
  - [ARG](#arg)
  - [MAINTAINER](#maintainer)
  - [LABEL](#label)
  - [ENTRYPOINT](#entrypoint)
  - [VOLUME](#volume)
  - [USER](#user)
  - [ONBUILD](#onbuild)
- [指令](#指令)
  - [image](#image)
  - [images](#images)
  - [container](#container)
- [實做筆記](#實做筆記)
  - [reverse-proxy-server](#reverse-proxy-server)
    - [resolver 錯誤](#resolver-錯誤)
    - [nginx 的跨網域設定](#nginx-的跨網域設定)
    - [設定多個網域至 Access-Control-Allow-Origin](#設定多個網域至-access-control-allow-origin)

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

### Build

建立 image

`docker build -t 專案名稱 .`

- -t : image 名字:image 版本： 自訂 image 名字跟版本，若沒輸入版本則為預設值 latest
- . : Dockerfile 的路徑

### Run

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

### COPY 與 ADD 的差別

參考: https://stackoverflow.com/a/26125419，Same as 'ADD', but without the tar and remote URL handling.  
簡單來說，COPY 做的事情跟 ADD 一樣，但 COPY 不能處理 tar 與 url

## Docker Compose

跟 Dockerfile 的差異，參考文章: https://blog.techbridge.cc/2018/09/07/docker-compose-tutorial-intro/  
Docker Compose 執行多個 container，利用 docker-compose.yml 描述 Service 之間的關係，
Dockerfile 是用來描述映像檔（image）的文件

執行 compose `docker-compose up -d`

範例檔案 與 說明

```yaml
version: '3' # 目前使用的版本，可以參考官網：
services: # services 關鍵字後面列出 web, redis 兩項專案中的服務
  web: # service 可以自己取名
    build: . # Build 在同一資料夾的 Dockerfile（描述 Image 要組成的 yaml 檔案）成 container
    environment: # 設定環境參數
      NODE_ENV: production
    ports: # 外部露出開放的 port 對應到 docker container 的 port
      - '5000:5000'
    volumes: # 要從本地資料夾 mount 掛載進去的資料
      - .:/code # 把當前資料夾 mount 掛載進去 container，這樣你可以直接在本地端專案資料夾改動檔案，container 裡面的檔案也會更動也不用重新 build image
    links: # 可以將服務定義別名，，預設網路是全服務都會連結在一起的，若不設定別名，可以不用填寫此設定
      - 'redis:database' # 這樣在此服務連結 redis 就會從 redis.createClient({ host: 'redis' }) => redis.createClient({ host: 'database' })
  redis:
    image: redis # 從 redis image build 出 container
```

## Dockerfile 其他參數

參考文章: https://www.jinnsblog.com/2018/12/docker-dockerfile-guide.html

### ENV

設定環境變數 `ENV key value`

```
ENV NODE_ENV production
ENV PORT 50001
```

### ARG

設定在建置映像檔時可傳入的參數，即定義變數名稱以及變數的預設值
ARG 和 ENV 的功能類似，都可以設定變數，但是 ARG 設定的值是供 build 映像檔時使用
在 Container 中是無法使用這些變數的

```Dockerfile
# 可選擇是否設定預設值，Param2 的預設值為 development
ARG Param1
ARG Param2=development

# 使用變數
ENV NODE_ENV ${Param2}
```

```bash
# 設定 Param2 為 production => ENV NODE_ENV production
docker build --build-arg Param2=production -t qwsd7869/test .
```

### MAINTAINER

映像檔維護者，把它想成是作者即可，格式為`MAINTAINER name`

```dockerfile
MAINTAINER John 或
MAINTAINER john@myemail.com 或
MAINTAINER John john@myemail.com
```

### LABEL

設定映像檔的 Metadata 資訊，例如：作者、EMail、映像檔的說明等，`LABEL key=value`

```dockerfile
# 單行，空白隔開；也可以多行
LABEL description="這是LABEL的範例" version="1.0" owner=""
```

### ENTRYPOINT

和 CMD 一樣，用來設定映像檔啟動 Container 時要執行的指令，但不同的是，ENTRYPOINT 一定會被執行，而不會有像 CMD 覆蓋的情況發生，用法跟 CMD 一樣

### VOLUME

建立本機或來自其他容器的掛載點，要特別注意的是使用 VOLUME 來定義掛載點時，是無法指定本機對應的目錄的，對應到哪個目錄是自動產生，我們可以透過 docker inspect 來查詢目錄資訊。  
**掛載也可以於 docker-compose.yml 設定**

```
VOLUME ["/demo1","/demo2"] 或
VOLUME /var/log /var/db
```

### USER

指定運行 Container 時的用戶名稱或 UID，在定義了 USER 後，則 Dockerfile 中的 RUN、CMD、ENTRYPOINT 等指令便會以 USER 指定的用戶來執行，前提條件是該用戶必需是已存在的，否則指定會失敗

```dockerfile
# 指定用戶名稱
USER tester

# 或使用UID來指定
USER 1000
```

### ONBUILD

若這個映像檔是作為其他映像檔的基底時，便需要定義 ONBUILD 指令，ONBUILD 後面接的指令在自建的映像檔中不會被執行，只有當這個映像檔是作為其他映像檔的基底時才會被觸發

```dockerfile
# 以下指令作為其他映像檔的基底時才會執行
ONBUILD ADD . /home/tmp
ONBUILD RUN mkdir -p /home/demo/docker
```

## 指令

### image

- 參考: https://docs.docker.com/engine/reference/commandline/image/
- 查看，`docker image ls` 或 `docker image ls -a`
- 刪除，`docker image rm <image-id>` 或強制刪除 `docker image rm -f <image-id>`

### images

- 參考: https://docs.docker.com/engine/reference/commandline/images/
- 查看，`docker images` 或 `docker images -a`
- 刪除全部: `docker rmi -f $(docker images -a -q)`，後面的語法是迭代器，建議先刪除全部的 container 後再執行
- 刪除狀態為 dangling 的 image: `docker rmi $(docker images --filter "dangling=true" -q)`

### container

- 參考: https://docs.docker.com/engine/reference/commandline/container/
- 參考: https://docs.docker.com/engine/reference/commandline/container_ls/
- 查看，`docker container ls` 或 `docker container ls -a`
- 刪除全部: `docker rm -vf $(docker ps -a -q)` 或 `docker rm -vf $(docker container ls -a -q)`，後面的語法是迭代器

## 實做筆記

### reverse-proxy-server

測試反代理伺服器至 docker 裡運行，server 使用 nginx

#### resolver 錯誤

至 nginx.conf 的 http 裡設定 resolver 即可，設定的 dns 位址可用 cat /etc/resolv.conf 查看

```
http {
    resolver 192.168.65.1;
}
```

#### nginx 的跨網域設定

- 參考: https://enable-cors.org/server_nginx.html
- 不用直接照抄下來，不過建議保留以下判斷

```
if ($request_method = 'OPTIONS') {
    return 204;
}
```

#### 設定多個網域至 Access-Control-Allow-Origin

- 參考: https://stackoverflow.com/a/36649003/5134658

```
location / {
    if ($http_origin ~* "^https?://(website.com|www.website.com)$") {
        add_header Access-Control-Allow-Origin "$http_origin";
    }
}
```
