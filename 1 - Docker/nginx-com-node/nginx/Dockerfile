FROM nginx:1.27.0-alpine3.19

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
CMD envsubst '${NODE_APP_PORT}' < /etc/nginx/conf.d/nginx.conf > /etc/nginx/nginx.conf && nginx -g 'daemon off;'

