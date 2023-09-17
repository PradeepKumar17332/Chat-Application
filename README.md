# Real-Time Chat Application with Angular and Express.js

A real-time chat application built using Angular and Express.js.

## Table of Contents

- [Real-Time Chat Application with Angular and Express.js](#real-time-chat-application-with-angular-and-expressjs)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Setting Up the Project](#setting-up-the-project)
    - [Running the Application](#running-the-application)
    - [Deploying the Application](#deploying-the-application)

## Introduction

This project is a real-time chat application that allows users to chat in real-time using websockets. It's built using Angular for the frontend and Express.js for the backend. Users can send and receive messages in real-time.

## Features

- Real-time messaging using websockets.
- Angular frontend with a user-friendly chat interface.
- Express.js backend server to handle real-time communication.

## Getting Started

Follow these steps to set up and run the chat application on your local machine.

### Prerequisites

Before you begin, make sure you have the following prerequisites installed on your system:

1. Node.js and npm (Node Package Manager): You can download and install them from the official website at https://nodejs.org/.

### Setting Up the Project

1. To set-up frontend go to the 'forntend' directory and run below command to install required dependencies.
    ```bash
    cd frontend
    npm install
2. To set-up backend go to the 'backend' directory and run below command to install required dependencies.
    ```bash
    cd backend
    npm install
### Running the Application
1. To start angular project, go in the frontend directory and run below command to run frontend server. It will run on http://localhost:4200/ by default. You can change port if you want.
    ```bash
    cd frontend
    ng serve
2. To start express project, go in the backend directory and run below command to run frontend server. It will run on http://localhost:3000/. You can change port if you want.
    ```bash
    cd backend
    node app.js
### Deploying the Application
To deploy your chat application, you can use platforms like Heroku, AWS, or any other hosting service of your choice. Make sure to configure your deployment settings according to the platform you choose.
