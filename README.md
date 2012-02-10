# VenueWidget

![Final Result](https://github.com/Bakedweb/venue_widget/raw/master/venue_widget.png)

# Requirements


* To use VenueWidget you need last jQuery version from http://code.jquery.com/jquery.min.js
* Put the jquery.min.js file on to HTML document

# How to Install

* Make sure you have jQuery loaded

* You need to set a couple of parameters api_token(your secret api token), account(your account id number) & div_id(the name of div where you draw the table)

* Put the VenueWidget.js file on to HTML document

* The code should look like:

```html
  	<html>
  	  <head>
  			<link href="https://raw.github.com/Bakedweb/venue_widget/master/public/css/styles.css"  rel='stylesheet' type='text/css'/>
  	    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js" charset="utf-8"></script>
  	    <script> 
  	      VenueConfig = new Object();
  	      VenueConfig.api_token = "";  //example '02AFRET3T6A961Q53'
  	      VenueConfig.account = '';  //example '12345'
  	      VenueConfig.div_id = 'venueWidgetMainTable'; //example 'my_div'
  	    </script>
  	    <script src="https://raw.github.com/Bakedweb/venue_widget/master/public/js/VenueWidget.js" charset="utf-8"></script>
  	  </head>
  	  <body>
  		<div id="wrapper">
  			<div id="center_table">
  		  	<div id="selectevent_columnlabelbar">
  					<div id="venueWidgetMainTable"></div>
  			  </div>
  			</div>
  		</div>  
  	</body>
  	</html>
```

# How to update this project

* clone the Git repository for this project from GitHub. (We recommend forking the project first.)
* "rvm use 1.8.7"
* "rvm gemset create widgets-venuedriver-com"
* "rvm rvmrc trust .rvmrc"

