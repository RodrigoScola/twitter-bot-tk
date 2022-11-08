FROM ubuntu
COPY . /app
WORKDIR /app
ENV PORT 8000
CMD pocketbase serve --http=0.0.0.0:${PORT} --debug next start
EXPOSE 8000