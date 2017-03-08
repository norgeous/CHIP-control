# CHIP control
control CHIP

```
bash <(curl -sL "https://rawgit.com/norgeous/CHIP-control/master/install.sh")
```
installs to `/opt/CHIP-control`


access via: http://[your-chip-ip]:38916/
ex: http://192.168.1.20:38916/

for the graph

* single press the onboard button to shutdown

```
systemc status chip-control
systemc stop chip-control
```

#### development

Setup
```
cd /opt/CHIP-control/source
npm install
npm rebuild node-sass
npm install -g node-gyp
node-gyp rebuild
```

Start the webpack hot server
```
cd /opt/CHIP-control/source
npm start
```
