module.exports = {
  apps: {
    "name": "spotify",
    "script": "./index.mjs",
    "cwd": "./",
    "env":{
      DOMAIN:'http://127.0.0.1:10092',
      // DOMAIN:'http://82.156.51.38:10092',
      PORT:'10092'
    }
  }
};
