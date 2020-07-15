FROM nginx

# mkdir && cd
WORKDIR /nginx/html

# nginx.conf 決定了 html 的位置，所以 html 要放哪主要是根據 conf 檔的設定
# nginx.conf 
# COPY 若是目的地不存在，則會失敗，可以直接設該位置為 WORKDIR ，就會 mkdir & cd 都幫你弄好了
COPY ./nginx.conf /etc/nginx
COPY ./index.html /nginx/html

# /qwsd7869/nginx 是設在 nginx.conf 中的

# 查詢 nginx.conf 究竟放哪裡，結果是 /etc/nginx/nginx.conf
RUN nginx -t

# container 內的 port
EXPOSE 3000