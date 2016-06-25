# iot-house-registry

[![Build Status](https://travis-ci.org/freeuni-sdp/iot-house-registry.svg?branch=master)](https://travis-ci.org/freeuni-sdp/iot-house-registry)
[![Code Climate](https://codeclimate.com/github/freeuni-sdp/iot-house-registry/badges/gpa.svg)](https://codeclimate.com/github/freeuni-sdp/iot-house-registry)
[![Issue Count](https://codeclimate.com/github/freeuni-sdp/iot-house-registry/badges/issue_count.svg)](https://codeclimate.com/github/freeuni-sdp/iot-house-registry)

ინახავს სახლების შესახებ ინფორმაციას

| | |
|------|-----|
|apiary|http://docs.iothouseregistry.apiary.io/|
|heroku|https://iot-house-registry.herokuapp.com/houses|

### setup

```bash
$ export TABLE_NAME=iothouseregistry
$ export PARTITION_KEY=partitionkey
$ export STORAGE_NAME=<storage_name>
$ export STORAGE_KEY=<storage_key>
$ npm install
```
When you run locally either remove newrelic dependency from `app.js` or set newrelic system vars.

### run

```bash
$ node app.js
```
