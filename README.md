# CHIP control
control CHIP


#### Install
```
bash <(curl -sL "https://rawgit.com/norgeous/CHIP-control/master/install.sh")
```
Installs the files to `/opt/CHIP-control` and sets up a systemd.


#### Access
* http://[your-chip-ip]:38916/
* http://192.168.1.20:38916/
Use above for the graph, the socket io server runs on port 38917.
A single press the onboard button to shutdown.
```
systemctl status chip-control
systemctl stop chip-control
```

#### Development

Setup
```
cd /opt/CHIP-control/source
npm install
npm rebuild node-sass
```

Start the webpack hot server
```
cd /opt/CHIP-control/source
npm start
```
