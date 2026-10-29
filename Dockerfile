FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y ffmpeg python3-pip curl nodejs npm
RUN pip3 install yt-dlp --break-system-packages

WORKDIR /app
COPY server.js .
RUN npm install express

EXPOSE 10000
CMD ["node", "server.js"]
