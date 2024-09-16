#!/bin/bash 

sudo docker start mongodb

node /home/eshan/chat-app/serverFiles/servers/server.js &         #paused here (below commands do not execute)

node /home/eshan/chat-app/serverFiles/servers/chatSession.js &

node /home/eshan/my-profile/server.js &

ngrok start --all
