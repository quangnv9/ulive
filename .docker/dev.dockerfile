FROM quay.io/vmoteam/pm2:14.14.0-alpine
LABEL author="ductn1@vmodev.com"

RUN mkdir -p /home/dashboard
WORKDIR /home/dashboard

COPY server ./server
COPY ecosystem-dev.config.js ./
RUN cd server && yarn install
COPY build ./build

EXPOSE 3000

ENTRYPOINT [ "pm2-runtime","start","ecosystem-dev.config.js" ]
