# Build the JS artifact
FROM node:10-alpine as builder
WORKDIR /app/webapp
ADD . .
RUN npm install && npm run build

# Build the static file image
FROM alpine:latest
WORKDIR /app/static
COPY --from=builder /app/webapp/build/ .
