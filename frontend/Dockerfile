FROM node:24 AS build
RUN npm install -g pnpm

WORKDIR /build
COPY package.json pnpm-lock.yaml /build/
RUN pnpm install --frozen-lockfile

# Copy source files
COPY vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json /build/
COPY index.html /build/
COPY src/ /build/src/
RUN pnpm run build

FROM nginx AS run

COPY --from=build /build/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start the server
CMD ["nginx", "-g", "daemon off;"]