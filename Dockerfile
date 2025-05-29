FROM node:18-alpine AS builder
WORKDIR /app

COPY app/package.json ./
RUN yarn install --frozen-lockfile --production

FROM node:18-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/browser /app/frontend
RUN npm install -g serve

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY app ./app

COPY --from=frontend /app/frontend /app/frontend

RUN ls -la node_modules/express node_modules/mongoose

EXPOSE 4501 4200

COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/bin/sh", "/start.sh"]