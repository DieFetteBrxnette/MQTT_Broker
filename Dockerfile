FROM nodered/node-red:latest

# Switch to root user for installation
USER root

# Add Alpine community repository and install Mosquitto
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache mosquitto mosquitto-clients

# Create Mosquitto user and directories
RUN mkdir -p /var/log/mosquitto && \
    addgroup -S mosquitto 2>/dev/null || true && \
    adduser -S -G mosquitto mosquitto 2>/dev/null || true

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

# Copy configurations
COPY mosquitto.conf /etc/mosquitto/mosquitto.conf
COPY node-red_settings.js /data/settings.js
RUN mkdir -p /etc/mosquitto && \
    chown -R mosquitto:mosquitto /etc/mosquitto && \
    chown -R mosquitto:mosquitto /var/log/mosquitto

# Copy flows if there are any
COPY data/flows.json /data/flows.json
RUN chown -R node-red:node-red /data

# Copy start scripts
COPY start_mosquitto_linux.sh /start_mosquitto_linux.sh
COPY start.sh /start.sh
RUN chmod +x /start.sh /start_mosquitto_linux.sh

# Switch back to node-red user
USER node-red

# Expose ports for Node-RED and Mosquitto
EXPOSE 1880 1883 9001

# Use the startup script as entrypoint
ENTRYPOINT ["/start.sh"]