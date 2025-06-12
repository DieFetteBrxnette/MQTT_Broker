# Starte mit dem offiziellen Node-RED Image
FROM nodered/node-red:latest

# Wechsle ins Arbeitsverzeichnis
WORKDIR /usr/src/node-red

# Kopiere die Konfigurationsdateien von ihren korrekten Speicherorten
COPY ./node-red_settings.js .
COPY ./data/flows.json .

# Kopiere und installiere dein lokales Node-Paket
COPY ./tocaro-nodes ./packages/tocaro-nodes
RUN npm install ./packages/tocaro-nodes