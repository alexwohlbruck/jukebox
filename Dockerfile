FROM node:22-bookworm-slim

RUN apt-get -o Acquire::Check-Date=false update \
    && apt-get install -y --no-install-recommends ffmpeg python3-pip \
    # Nightly, not stable: YouTube changes extraction faster than yt-dlp cuts
    # releases, and the stable channel lags far enough behind that every modern
    # video 403s. Rebuild the image when playback starts failing.
    && pip3 install --no-cache-dir --break-system-packages --pre -U 'yt-dlp[default]' 'bgutil-ytdlp-pot-provider==1.3.1' \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY public ./public

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "src/index.js"]
