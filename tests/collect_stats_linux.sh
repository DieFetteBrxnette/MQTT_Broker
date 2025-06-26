#!/bin/bash

SYSFILE="system_stats.csv"
DOCKERFILE="docker_stats.csv"
CONTAINER="mqtt-broker"

if [ ! -f "$SYSFILE" ]; then
    echo "Timestamp,CPU_Load,Free_Mem_KB,Total_Mem_KB,Free_Disk_KB" > "$SYSFILE"
fi
if [ ! -f "$DOCKERFILE" ]; then
    echo "Timestamp,Docker_Name,Container_CPU,Container_Mem,Container_NetIO,Container_BlockIO" > "$DOCKERFILE"
fi

end=$((SECONDS+600)) # 10 minutes

while [ $SECONDS -lt $end ]; do
    datetime=$(date '+%Y-%m-%d %H:%M:%S')
    cpu=$(top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}')
    mem_total=$(grep MemTotal /proc/meminfo | awk '{print $2}')
    mem_free=$(grep MemAvailable /proc/meminfo | awk '{print $2}')
    disk_free=$(df --output=avail / | tail -1)
    echo "$datetime,$cpu,$mem_free,$mem_total,$disk_free" >> "$SYSFILE"

    dockerstats=$(sudo docker stats --no-stream --format "{{.Name}},{{.CPUPerc}},{{.MemUsage}},{{.NetIO}},{{.BlockIO}}" $CONTAINER)
    if [ -n "$dockerstats" ]; then
        echo "$datetime,$dockerstats" >> "$DOCKERFILE"
    else
        echo "$datetime,,,,," >> "$DOCKERFILE"
    fi

    sleep 5
done