/*************************************************************************************** 
* This is an example code for explan how to set or get ssid,psk,key_mgmt 
* This program will create/read/modify "sta.ini", and parse ini into "wpa.conf" 
* After getting "wpa.conf" we can use this file connect to wi-fi. 
*  
* There are some notices as follows: 
* 1. SSID length must be between 1 and 32 characters. SSID with space character is not allowed in this API. 
* 2. PSK  length must be between 8 and 63 characters. PSK with space character is not allowed in this API. 
* 3. If key_mgmt is disable ,then PSK can not be set. 
*  
****************************************************************************************/ 
 
#include <stdio.h> 
#include <stdlib.h> 
#include <string.h> 
#include <unistd.h> 
 
#include "iniparser.h" 
#include "atop_libwl.h" 
 
#define __SSID "atop802.11x" 
#define __PASSWORD "atop3352" 
 
int main(int argc, char *argv[]) 
{	 
	char mySSID[16]; 
	char myPass[16]; 
	char buf[2][32]; 
	int i = 0; 
	FILE *fp; 
	printf("starting wifi...\n"); 
	if(argc < 2) 
	{ 
		printf("Use default configurations\n"); 
		sprintf(mySSID, "%s", __SSID); 
		sprintf(myPass, "%s", __PASSWORD); 
	} 
	else if(argc < 3) 
	{ 
		if(strcmp(argv[1], "-r") == 0) 
		{ 
			printf("Use configuration file wificonfig\n"); 
			fp = fopen("/jffs2/wificonfig", "r"); 
			if(fp == NULL) 
			{	 
				printf("fopen() failed, check wificonfig file!\n"); 
				return(1); 
			} 
			while(fgets(buf[i], 16, fp) != NULL) 
			{ 
				//printf("buf: %s\n", buf[i]); 
				i = i + 1; 
			} 
			sprintf(mySSID, buf[0]); 
			sprintf(myPass, buf[1]); 
			//printf("buf0= %s\n", buf[0]); 
			//printf("buf1= %s\n", buf[1]); 
			fclose(fp); 
		} 
		else if(strcmp(argv[1], "-f") == 0) 
		{ 
			printf("SSID: "); 
			scanf("%s", &mySSID); 
			printf("PASSWORD: "); 
			scanf("%s", &myPass); 
		} 
		else 
		{ 
			printf("Use default configurations\n"); 
			sprintf(mySSID,"%s", __SSID); 
			sprintf(myPass, "%s",  __PASSWORD); 
		} 
	} 
	else 
	{ 
		sprintf(mySSID,"%s", argv[1]); 
		sprintf(myPass, "%s", argv[2]); 
	} 
	//printf("Connecting to %s(password: %s)...\n", mySSID, myPass); 
 
	/******************************************** 
	* Create/modify a default sta.ini file 
	********************************************* 
	* void create_default_ini_file(); 
	* 
	*********************************************/ 
	create_default_ini_file(); 
	 
	/******************************************** 
	* Set & Get SSID 
	********************************************* 
    * SSID length must be between 1 and 32  
    * SSID with space character is not allowed in this API 
    * 
    * int set_ssid(char **ssid_name); 
    * int get_ssid(char **ssid); 
	*  
	*********************************************/ 
    char *ssid_set = mySSID; 
	char *ssid_get; 
 
	set_ssid(&ssid_set); 
	get_ssid(&ssid_get); 
	printf("ssid_get = %s\n", ssid_get); 
	free(ssid_get); 
 
	/******************************************** 
	* Set & Get key_mgmt 
	********************************************* 
	* 0:disable  
	* 1:WPA-PSK  
	* 2:WPA2-PSK  
	* 
	* int set_key_mgmt(int mode); 
	* int get_key_mgmt(char **key_mgmt); 
	*  
	*********************************************/ 
	  
    int key_mgmt_set = 1; 
	char *key_mgmt_get; 
 
	set_key_mgmt(key_mgmt_set); 
	get_key_mgmt(&key_mgmt_get); 
	printf("key_mgmt_get = %s\n", key_mgmt_get); 
	free(key_mgmt_get); 
 
 
	/******************************************** 
	* Set & Get PSK 
	********************************************* 
	* PSK length must be between 8 and 63  
	* PSK with space character is not allowed in this API 
	* 
	* int set_psk(char **psk_name); 
	* int get_psk(char **psk); 
	*  
	*********************************************/ 
    char *psk_set = myPass; 
	char *psk_get; 
 
	set_psk(&psk_set); 
	get_psk(&psk_get); 
	printf("psk_get = %s\n", psk_get); 
	free(psk_get); 
 
	/******************************************** 
	* Parse ini into config format 
	********************************************* 
	* int parse_setting(); 
	* 
	*********************************************/ 
	parse_setting(); 
 
	/******************************************** 
	* Connect to wi-fi by wpa.conf 
	********************************************* 
	* void run_connection(); 
	* 
	*********************************************/ 
	run_connection(); 
	system("dhclient -v -r wlan0"); 
	system("dhclient -v wlan0"); 
	return(0); 
} 
