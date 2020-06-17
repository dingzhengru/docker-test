FROM nginx

# mkdir && cd
WORKDIR /qwsd7869/nginx

# 這邊要依據指定的環境(nginx)去放置文件，此環境的 nginx.conf 設置 html 檔位於 /usr/share/nginx/html
# 複製 index.html, nginx.conf(如果沒有要自訂的話，就不用)
# 不過 nginx.conf 中可以設置指定的目錄，所以 html 要放哪主要是根據 conf 檔的設定
# COPY 若是目的地不存在，則會失敗，可以直接設該位置為 WORKDIR ，就會 mkdir & cd 都幫你弄好了
COPY ./nginx.conf /etc/nginx
COPY ./index.html /qwsd7869/nginx

# 查詢此環境的 nginx.conf 究竟放哪裡，結果是 /etc/nginx/nginx.conf
RUN nginx -t

# container 內的 port
EXPOSE 8888

