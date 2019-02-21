FROM node:10-alpine

RUN apk --update --no-cache add \
git && \
git clone https://github.com/maji-KY/slack-to-esa.git && \
cd slack-to-esa && \
yarn --frozen-lockfile --non-interactive && yarn build && yarn install --pure-lockfile --non-interactive --production && \
yarn cache clean && \
cd .. && \
mv slack-to-esa/scripts .  && \
mv slack-to-esa/node_modules . && \
mv slack-to-esa/package.json . && \
rm -rf slack-to-esa && \
apk del --purge \
git

ENTRYPOINT ["yarn", "hubot", "--adapter", "slack"]
CMD []
