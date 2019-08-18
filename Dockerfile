# Build the Django static assets
FROM lucaspickering/rps-api:latest as django-builder
RUN ./manage.py collectstatic --no-input

# Build the JS artifact
FROM node:10-alpine as js-builder
WORKDIR /app/webapp
COPY webapp/ .
RUN npm install && npm run build

# Build the static file image
FROM alpine:latest
WORKDIR /app/static
COPY --from=django-builder /app/api/static/ static/
COPY --from=js-builder /app/webapp/build/ .
