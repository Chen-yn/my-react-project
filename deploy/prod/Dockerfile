FROM nginx:1.19.1
ARG NGINX_CONF=""

WORKDIR /data/my-react-project

ADD build build

COPY ./deploy/run.sh ./
COPY "${NGINX_CONF}" /etc/nginx/conf.d/default.conf

EXPOSE 80
ENTRYPOINT ["sh", "./run.sh"]