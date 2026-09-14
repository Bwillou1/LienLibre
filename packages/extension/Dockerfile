# LienLibre Chrome Extension Package Container (GitHub Packages / GHCR)
FROM alpine:latest
LABEL org.opencontainers.image.title="LienLibre Chrome Extension"
LABEL org.opencontainers.image.description="Extension Chrome officielle LienLibre pour la génération en 1 clic de capsules de partage équitable"
LABEL org.opencontainers.image.source="https://github.com/Bwillou1/LienLibre"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.version="2.5.0"

WORKDIR /extension
COPY dist/*.zip /extension/ || true
COPY extension/ /extension/src/

CMD ["ls", "-la", "/extension"]
