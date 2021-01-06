# OpenCMMS_frontend

![example workflow name](https://github.com/Open-CMMS/openCMMS_frontend/workflows/master/badge.svg)   ![example workflow branch](https://github.com/Open-CMMS/openCMMS_frontend/workflows/dev/badge.svg)    ![GitHub license](https://img.shields.io/github/license/Open-CMMS/openCMMS_frontend)  ![GitHub contributors](https://img.shields.io/github/contributors/Open-CMMS/openCMMS_frontend)


The aim of this project is to enable any company to manage the maintenance of its equipment in a simple way.

We thus propose an interface which works with the backend API located here : 

Thanks to both projects you will be able to manage the users with different levels of rights but also to create new groups with specific rights.

You also can create equipment types as well as equipments with attributes such as brand, capacity, etc ...

Finally, you can also add dataproviders which will allow you to automatically retrieve values from your equipment in order to update its attributes in the database.

# Installing the project

In this part we will explain how to install this project. The installation process has been tested with Debian 10 container, nodejs version 10.19 and npm version 6.14.4. Everything has been developped with Angular 9. Make sure you have enough RAM memory (2GB should do the trick)

First you have to download the project and put in in a specific directory, in our example we put the project in `/home/cmms/frontend/`

Make sure you have all your packages up to date : `sudo apt-get update` and that you are on the project folder, here `/home/cmms/frontend`

## Install dependencies

In order to build the project you have to install all the required packages.
* Install NodeJS : `sudo apt install nodejs`
* Install NPM : `sudo apt install npm`
* Install Angular CLI globally : `sudo npm install -g @angular/cli`
* Install all the required packages (run this command from the project folder) : `npm i`

## Edit configuration

If you make the website accessible from the Internet, you must change the base_url of the project. To do so you have to edit the file `nano src/environments/environment.prod.ts` and edit the `baseUrl` param with your website's address.
If you just want to see the project and run it locally you don't need to edit this configuration file.

## Run the project

In order to run the project locally you should go to the project folder and run the commande `ng serve`. The project will then be accessible from 127.0.0.1:4200.

To run the project on a website, you must build the project. To do so, go to the project folder and run `ng build --prod --build-optimizer --output-hashing=all`. This command will create a dist folder. You have to copy the content of the `dist/open-cmms` folder to the folder accessible from the internet. If you follow the tutorial from the OpenCMMS_backend project it's the `/var/www/openCMMS/` folder that you must create.
