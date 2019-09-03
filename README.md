# SYSTEMD-SERVICIFY

## Description

Easily run a nodejs script as systemd service

## Installation

`npm install -g systemd-servicify`

## Usage

`servicify [options] [entrypoint]`

for example

`servicify -s my-app app.js`

will create and start a service called **my-app.service**, owned by current user that runs **app.js** script.

Service is created under */etc/systemd/system* directory