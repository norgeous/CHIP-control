#!/bin/bash

# must run as ROOT
if [[ $EUID -ne 0 ]]; then
  echo "This script must be run as root" 1>&2
  exit 1
fi

if (whiptail --title "CHIP-control install" --yesno "Install CHIP-control?" 15 46) then

  # if no git, install git
  if ! which git >/dev/null; then
    apt install -y git
  fi

  # if no node, install node
  if ! which node >/dev/null; then
    bash <(curl -sL "https://rawgit.com/norgeous/CHIP-customiser/master/scripts/install_nodejs.sh")
  fi

  # if no statusled, install statusled
  if ! which statusled >/dev/null; then
    bash <(curl -sL "https://rawgit.com/norgeous/CHIP-customiser/master/scripts/configure_status_led.sh")
  fi

  # clone this repo
  rm -r "/opt/CHIP-control/"
  cd "/opt/"
  git clone "https://github.com/norgeous/CHIP-control.git"
  cd "/opt/CHIP-control/"
  sudo npm install # needs sudo, even as root

  # chip-control.service
  cp "/opt/CHIP-control/chip-control.service" "/etc/systemd/system/chip-control.service"
  systemctl enable chip-control
  systemctl restart chip-control

fi
