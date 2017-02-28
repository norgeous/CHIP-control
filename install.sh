#!/bin/bash

# must run as ROOT
if [[ $EUID -ne 0 ]]; then
  echo "This script must be run as root" 1>&2
  exit 1
fi

if (whiptail --title "CHIP-control install" --yesno "Install CHIP-control?" 15 46) then

  # install git
  if ! which git >/dev/null; then
    apt install -y git
  fi

  # install node
  if ! which node >/dev/null; then
    echo "nodejs is not installed!"
    bash <(curl -sL "https://rawgit.com/norgeous/CHIP-customiser/master/scripts/install_nodejs.sh")
  fi

  bash <(curl -sL "https://rawgit.com/norgeous/CHIP-customiser/master/scripts/configure_status_led.sh")

  # clone this repo
  rm -r "/root/CHIP-control/"
  cd "/root/"
  git clone "https://github.com/norgeous/CHIP-control.git"
  cd "/root/CHIP-control/"
  sudo npm install # needs sudo, even as root

  # chip-control.service
  mv "/root/CHIP-control/chip-control.service" "/etc/systemd/system/chip-control.service"
  systemctl enable chip-control
  systemctl restart chip-control

fi
