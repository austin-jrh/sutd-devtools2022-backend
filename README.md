# Typing Test

Link to site: http://student-4.sutdacademytools.net (Hopefully its up)

### Link to frontend repository: https://github.com/austin-jrh/sutd-devtools2022

---

### Table of Contents 
- [Features](#features)
- [Technical Stack](#technical-stack)
  - [Front-end](#front-end)
  - [Back-end](#back-end)
- [Demo](#demo)
- [Setup](#setup)
- [Security Vulnerability](#security-vulnerability)

## Features
![image](https://user-images.githubusercontent.com/87303121/201081692-7c6622a9-7ad2-471d-80d3-4e2a1f590a7b.png)
Typing Test is a simple typing test app where you can measure your typing speed.

Features are:
- User Profile
  - Register, Login, Edit Display Name, Persistent User using `localStorage`.
- Typing Test
  - Generate Random words, Custom user defined words, (scuffed) WPM calculation, saving of high score to logged in user.

## Technical Stack
### Front-end

[Link to repository](https://github.com/austin-jrh/sutd-devtools2022)

Using:
- Vue.js (MVVM framework)
- Element+ (UI framework)
- random-words (NPM library)
- Google Fonts (Roboto Mono and Inconsolata)

### Back-end
Using:
- Node.js (runtime environment)
- Express (web application framework)
- Sqlite (database)
- Docker (Container)
- NGINX (Reverse proxy)

## Demo

## Setup
1. Clone the repository. 
```
git clone https://github.com/austin-jrh/sutd-devtools2022-backend.git
```

2. Install Docker
```
# Install Docker packages
sudo apt-get update
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
    
# Add docker official gpg key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Setup docker repo
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install docker engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
 
# Start the service
sudo service docker start

# Run docker without sudo,
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker 
docker ps 
```

3. Navigate to path where the `Dockerfile` exist.
```
ls # you should be in the Dockerfile directory
```

4. Run `run.sh` to build and run Dockerfile.
```
./run.sh
```

5. Verify if the Docker container is running.
```
docker ps
```

6. Install NGINX
```
sudo apt-get update
sudo apt-get install nginx
```

7. Configure NGINX
```
sudo nano /etc/nginx/sites-available/default
```

8. Add the following code to `default` file
```
server {
  listen 80;
  server_name student-4.sutdacademytools.net;
  location / {
    proxy_pass http://localhost:8080;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;

  }

  location /profiles {
    proxy_pass http://localhost:3001;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;

  }

  location /tests {
    proxy_pass http://localhost:3001;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;

  }
}
```

9. Start NGINX
```
sudo service nginx start
```

## Security Vulnerability
### SQL Injection attack with crafted form inputs (login)
### Modifying the database without authorization (change highscore)
### Access to profiles
