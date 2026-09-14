# LienLibre Android App Package Container (GitHub Packages / GHCR)
FROM alpine:latest
LABEL org.opencontainers.image.title="LienLibre Android App"
LABEL org.opencontainers.image.description="Application Android native pour LienLibre avec Jetpack Compose, Material 3 et On-Device Edge AI"
LABEL org.opencontainers.image.source="https://github.com/Bwillou1/LienLibre"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.version="2.5.0"

WORKDIR /app
COPY android/ /app/android/

CMD ["ls", "-la", "/app"]
