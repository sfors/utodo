FROM node:24 AS base
RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml /app/
COPY tsconfig.json /app/
COPY src/ /app/src/

FROM base AS prod-deps
RUN pnpm install --frozen-lockfile --prod

FROM base AS build
RUN pnpm install --frozen-lockfile
RUN pnpm compile

FROM node:24 AS run

WORKDIR /app

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

RUN ls

EXPOSE 8080

# Start the server
CMD ["node", "dist/index.js"]