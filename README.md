
# Fight Againt COVID:

## Authors and Developers:
* Akansha Vaish
* Bob Tian 
* Danica Walton
* Dollina Dodani
* Nicholas Tin

## Basic Idea:
It is uncontroversial to say that the ongoing COVID-19 pandemic has changed the way that our society functions. As COVID-19 continues to soar globally, only a few countries have the infrastructure to take charge of such a crisis. Some countries have larger and robust health care systems, and yet, some are unable to supply basic medical resources such as hospital beds, oxygen cylinders, Personal Protective Equipment (PPE), blood, and plasma for donation. 

## Technologies Used:
* Node.js
* MongoDB

## How to Run the Application:
* Clone this repository.
* Now go inside the root folder and do `npm install` (to install all the required packages).
* Make a new .env file in the root repository.
* Add a variable SESSION_SECRET and assign it to anything for instance:
	* SECRET=To Be Filled
	* EMAIL=fightagainstcovidproject@gmail.com
	* PASSWORD="PLEASE GET PASSWORD FROM DISCORD CHANNEL"
	* GEOCODE_PROVIDER=google
	* GOOGLE_API_KEY="PLEASE GET KEY FROM DISCORD CHANNEL"
* Make sure that your Mongo Server is up and running on your local host.
* Right now, we are using localhost mongo but we will be using the db. We can also use MONGO_URL in .env file. Then the file will the url mentioned up there for mongo.
* To Start the app, run :
	* `npm run start` - It will run the basic node application without the auto start feature.
	* `npm run dev` - It will run the node app with nodemon i.e. the app will automatically restart when you will make any kind of change.

## Current Endpoints:
* GET / : Home. If not logged in, user will be redirected to login page.
* GET /login : LOGIN page will be displayed.
* POST /login : Post request will be send to server to log the user in on the backend
* GET /register : REGISTERATION page will be displayed.
* POST /register : Post request will be sent to server to register the user in the backend.
