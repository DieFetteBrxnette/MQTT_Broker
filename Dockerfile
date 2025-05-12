FROM nodered/node-red:latest

# Switch to root user for installation
USER root

# Set working dir
WORKDIR /usr/src/node-red

# Copy package.json & package-lock.json
COPY package*.json ./

# Install node_modules with correct permissions
RUN npm install && \
    chown -R node-red:node-red /usr/src/node-red

# Copy local nodes
COPY tocaro-nodes /data/node_modules/tocaro-nodes
RUN chown -R node-red:node-red /data/node_modules

# Copy flows if there are any
COPY data/flows.json /data/flows.json
RUN chown -R node-red:node-red /data

# Switch back to node-red user
USER node-red

# Expose port 1880 for Node-Red
EXPOSE 1880