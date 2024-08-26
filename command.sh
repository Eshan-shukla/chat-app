#!/bin/bash 

node serverFiles/servers/server.js &
server_pid=$!

node serverFiles/servers/chatSession.js &
chat_pid=$!