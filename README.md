# Contractor dashboard

Contractor dashboard is an electron app designed to ease a contractor's routine tasks such as:
- sending invoices / timesheets to agents / clients (DONE)
- replying with templated responses to emails (TBD)

It's based on React / Redux and a NodeJS / Express API.

## TOC

[Requirements](#requirements)  
[Installation](#installation)  
[Configuration](#configuration)  
[Main technologies](#main-technologies)  
[Next feature](#next-feature)  
[Comments](#comments)  
[Screenshots](#screenshots)  

## Requirements

- Ubuntu / MacOS / Windows 10 with bash
- Google Client ID (from Google Console API)
- Google Client secret (from Google Console API)
- Gmail API enabled

## Installation

- Clone the repo
- Run `npm install` in the project's directory
- Use `npm start` to start the application

## Configuration

You'll need a Client ID and secret from an app created with Google Console API.  
The steps to create one are detailed in the screenshot below:  
<img width="200px" src="https://github.com/efidiles/contractor-dashboard/raw/docs/steps.jpg" alt="Steps to generate Google client ID and secret">

## Main technologies

- React
- Redux
- Electron
- Material UI
- NodeJS
- Express
- Webpack
- etc

## Next feature

- Reply to emails with templated responses

## TODO

- Add tooling for release packaging
- Fix and refactor tests
- Take third party libraries outside of the bundle (such as React, Redux etc.)

## Comments

- The project has only been tested on Ubuntu

## Screenshots

**The app**  
<img width="200px" src="https://github.com/efidiles/contractor-dashboard/raw/docs/screenshots/app.png" alt="The app">

---
The app configuration screen  
<img width="200px" src="https://github.com/efidiles/contractor-dashboard/raw/docs/screenshots/app-config.png" alt="The app configuration screen">

---
The agent email config  
<img width="200px" src="https://github.com/efidiles/contractor-dashboard/raw/docs/screenshots/agent-email-config.png" alt="The agent email config">
