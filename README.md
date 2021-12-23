# azbouki-base-app
<br>  

## Initial run preparation
*** 
>'**npm install**' in the project folder;

>in '**/src**' folder create the config file 'config.ts' based on the 'config.sample.ts' file, and update the DB credentials as appropriate;

<br>

## Start Scripts
*** 
>'**npm start**' - starts the server (public + API);

>'**npm run dev**' - starts the server in development mode, listening to changes in ejs, js, ts, scss files and applying them;

>'**npm run test**' - runs all tests in /test folder;

>'**npm run lint**' - runs the ESLint linter on the project folders

<br>

## Public part (Landing page)
*** 
>Public router - '**/src/routes/index.ts**'

>Public controller - '**/src/controllers/HomeController.ts**'

>Menu items configuration - '**/src/shared/constants.ts**' - **MENU** constant

>EJS template files - '**/src/views**'

>SCSS style files - '**/scss**'

<br>

## API
*** 
> located in '**/src/api**' folder;

<br>

## Error Handling
*** 
> located in '**/src/errors**' folder;

<br>

## Shared files
*** 
> located in '**/src/shared**' folder;
>- '**/enums**' - for all enum objects, which are shared among API and public part;
>- '**constants.ts**' - for all constants, which are shared among API and public part

<br>

## Build files
*** 
> located in '**/dist**' folder;

<br>
