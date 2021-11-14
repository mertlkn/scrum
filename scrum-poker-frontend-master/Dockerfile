FROM nginx:1.16.0-alpine
COPY dist/deploy /usr/share/nginx/html
# Copy the nginx configuration template to the nginx config directory & Substitute the environment variables and generate the final config
COPY nginx/default.template /etc/nginx/conf.d/default.template
CMD envsubst < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'