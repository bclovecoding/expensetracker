# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base

WORKDIR /app

FROM base AS build

# Install packages needed to build node modules
# RUN apt-get update -qq && \
#  apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY package.json bun.lockb ./
RUN bun install --ci

# Install web node modules
COPY web/package.json web/bun.lockb ./web/
RUN cd web && bun install --ci

# Copy application code
COPY . .

# Change to web and build web app
WORKDIR /app/web
RUN bun run build

# Remove all file from web except dist folder
RUN find . -mindepth 1 ! -regex '^./dist\(/.*\)?' -delete

# Final stage for app image
FROM base
WORKDIR /app
#Copy built application
COPY --from=build /app ./

# run the app
# USER bun
EXPOSE 3000
ENTRYPOINT [ "bun", "run", "start" ]