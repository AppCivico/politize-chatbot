FROM node:16-alpine3.11

WORKDIR /home/node/app
COPY . /home/node/app/

RUN npm install

COPY ./cron/conversation-timeout-cron /etc/cron.d/conversation-timeout-cron
RUN chmod 0644 /etc/cron.d/conversation-timeout-cron
RUN crontab /etc/cron.d/conversation-timeout-cron
RUN touch /var/log/cron.log

USER node
CMD "npm" "start"


