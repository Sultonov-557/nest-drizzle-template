######### Build #########
FROM node:18-alpine3.17 as build
WORKDIR /home/template-api/
COPY . .
RUN yarn install --silent && yarn build

######### Production #########
FROM node:18-alpine3.17
COPY --from=build /home/template-api/package.json package.json
COPY --from=build /home/template-api/yarn.lock yarn.lock
COPY --from=build /home/template-api/dist ./dist
COPY --from=build /home/template-api/node_modules node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
