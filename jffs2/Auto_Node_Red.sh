#!/bin/sh

MountDir=/media
DirName=mmcblk0p1
Ext2Name=mmcblk0p1
SwapName=mmcblk0p2
NodeRedMain=node-v6.11.3-linux-armv7l
UserNode=home_root_node-red
ServerIP=10.0.50.101
 
 # Format partition
read -p "Format partition ? (Y/N): " yn
if [ "${yn}" == "Y" ] || [ "${yn}" == "y" ]; then
	echo " Format partition ... "
	mke2fs /dev/${Ext2Name}
	mkswap /dev/${SwapName}
fi

# Mount SD card and extract node-red files
if [ -d "${MountDir}/${DirName}" ]; then
	echo " make dir already! "
else
	mkdir ${MountDir}/${DirName}
fi

if ! mount /dev/${Ext2Name} ${MountDir}/${DirName}; then
	echo " Mount Error !"
	exit 1
else
	swapon /dev/${SwapName}
fi

echo "*************************************************************************"
echo "************************* mount and swapon done *************************"

# tar Node-Red main program
cd ${MountDir}/${DirName}

if [ -d "${NodeRedMain}" ]; then
	echo " tar Node-Red main program already! "
	break;

elif [ -f "${NodeRedMain}.tar.bz2" ]; then
	echo " tar Node-Red main program ..."
	tar xf ${NodeRedMain}.tar.bz2

else
	echo " download & tar Node-Red main program ..."
	tftp -gr ${NodeRedMain}.tar.bz2 ${ServerIP};
	tar xf ${NodeRedMain}.tar.bz2
fi

echo "******************** tar Node-Red main program done *********************"

# tar user-defined node 
if [ -d "${MountDir}/${DirName}/home" ]; then
	echo " make home dir already! "
	cd ${MountDir}/${DirName}/home
else
	mkdir ${MountDir}/${DirName}/home
	cd ${MountDir}/${DirName}/home
fi

if [ -d "root" ]; then
	echo " tar user-defined node already! "
	break;

elif [ -f "${UserNode}.tar.bz2" ]; then
	echo " tar user-defined node ..."
	tar xf ${UserNode}.tar.bz2

else
	echo " download & tar user-defined node ..."
	tftp -gr ${UserNode}.tar.bz2 ${ServerIP};
	tar xf ${UserNode}.tar.bz2
fi

echo "********************* tar user-defined node done ************************"
# Setup environmental parameters
export HOME=${MountDir}/${DirName}/home/root
export PATH=${MountDir}/${DirName}/${NodeRedMain}/bin:$PATH
export NODE_PATH=${MountDir}/${DirName}/${NodeRedMain}/bin

echo "****************** Setup environmental parameters done *******************"
# Run node-red server demo profile
cd ${MountDir}/${DirName}/home/root/.node-red/
npm config set strict-ssl false
node-red flows_ATOP.json &
echo "********************** Starting install Node-Red *************************"
