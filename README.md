# Trade-Risk-Insight-UI

## Overview

This project is a React application that provides a user interface for the Trade-Risk-Insight project. It is built using the Risk Protect AI React template, which is a modern and responsive design system.

## Features

- User authentication
- Dashboard with various charts and graphs
- Risk analysis and insights
- Data visualization

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/ai-edge-innova/trade-risk-insight-ui.git
   cd trade-risk-insight-ui
   ```


2. **Build the Docker Image:**

Build the Docker image using the following command:

```bash

docker build -t react-app .
```
Replace your-react-app with a suitable image name.
Run the Docker Container:

3. **Build the Docker Image:**
Run the Docker container using the following command:

```bash
docker run -p 3002:3002 -d react-app

```

This maps port 3000 on your local machine to port 3000 in the Docker container.

Access Your React Application:

Open your web browser and navigate to **http://localhost:3002** to view your React application running inside a Docker container.

### Customization

If your React app uses a different port, update the **EXPOSE** and **docker run** commands accordingly.

Modify the Dockerfile to suit your specific project structure and dependencies.

Consider using a **.dockerignore** file to exclude unnecessary files and directories from being copied into the Docker image.

### Additional Resources

- [Docker Documentation](https://docs.docker.com/get-docker/)
- [React Documentation](https://react.dev/)

