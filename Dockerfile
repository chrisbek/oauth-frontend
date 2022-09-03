FROM node:16.16.0 as devimage
LABEL maintainer="christopher bekos"
WORKDIR /app
COPY . ./
RUN yarn install
RUN yarn run build

FROM node:16.16.0 as production
WORKDIR /
COPY --from=devimage /app/public public/
COPY --from=devimage /app/server server/
RUN yarn init --yes && yarn add express@4.17.0 && yarn add serve-favicon@2.5.0
EXPOSE 3000
CMD ["node", "server/server.js"]