#!/bin/sh
cp /jffs2/resolv.conf /etc
#mkdir /media/mmcblk0p1
#mount /dev/mmcblk0p1  /media/mmcblk0p1 
#swapon /dev/mmcblk0p2
export HOME=/media/mmcblk0p1/home/root
export PATH=/media/mmcblk0p1/node-v6.11.3-linux-armv7l/bin:$PATH
export NODE_PATH=/media/mmcblk0p1/node-v6.11.3-linux-armv7l/bin
cd $HOME/.node-red/
node-red flows_ATOP.json &
