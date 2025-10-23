# ベースイメージとしてDebianの最新版を使用
FROM debian:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    nginx \
    openssh-server \
    curl \
    procps \
    sudo

RUN curl -fsSL https://deb.sources.google.com/setup_lts.x | bash - \
    && apt-get install -y nodejs

# --- SSH設定 ---
# PermitRootLoginのみを有効にし、ポートはデフォルトの22番のままにする
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN mkdir -p /var/run/sshd

# --- Nginx設定 ---
RUN rm /etc/nginx/sites-enabled/default
COPY default.conf /etc/nginx/sites-available/default
RUN ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

# --- Webコンテンツ配置 ---
RUN mkdir -p /opt/app

# --- ユーザー設定 ---
RUN echo "root:root" | chpasswd

# --- ポート開放 ---
# ★★★ここを変更★★★
# コンテナが内部で開放するポートを指定
EXPOSE 8888
EXPOSE 22
# ★★★ここまで変更★★★

# --- コンテナ起動時に実行するコマンド ---
CMD service nginx start && /usr/sbin/sshd -D