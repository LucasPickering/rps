# Build the Django static assets
FROM lucaspickering/rps-api:latest as django-builder
RUN ./manage.py collectstatic --no-input

# Build the JS artifact
FROM lucaspickering/rps-webapp:latest as js-builder
ARG REACT_APP_GOOGLE_CLIENT_ID
RUN env REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID npm run build && rm build/static/js/*.map

# Build the static file image
FROM alpine:latest
WORKDIR /app/static
COPY --from=django-builder /app/api/static/ static/
COPY --from=js-builder /app/webapp/build/ .
