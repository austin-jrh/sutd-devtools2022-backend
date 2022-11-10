#!/bin/bash

docker stop sutd-backend
yes y | docker image prune -a
docker build -t sutd-backend .
docker run -dp 3001:3001 --rm --name sutd-backend sutd-backend