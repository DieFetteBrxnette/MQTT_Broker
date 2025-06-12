# Start with the official Node-RED image
FROM nodered/node-red:latest

# Change work dir
WORKDIR /usr/src/node-red

# Copy Configuration files
COPY ./node-red_settings.js .
COPY ./data/flows.json .

# Copy local Node modules
COPY ./tocaro-nodes ./packages/tocaro-nodes
RUN npm install ./packages/tocaro-nodes