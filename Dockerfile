FROM node:24-alpine AS dependencies

WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

FROM node:24-alpine AS runtime

ENV NODE_ENV=production
ENV STATIC_DIR=/app/frontend
WORKDIR /app/backend

COPY --from=dependencies /app/backend/node_modules ./node_modules
COPY backend/package.json ./
COPY backend/src ./src
COPY frontend/index.html frontend/app.js frontend/styles.css frontend/pizzip.min.js frontend/docxtemplater.js /app/frontend/
COPY frontend/src /app/frontend/src

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "src/server.js"]
