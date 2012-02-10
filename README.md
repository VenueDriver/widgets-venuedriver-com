# VenueWidget

![Final Result](https://github.com/Bakedweb/venue_widget/raw/master/venue_widget.png)


# Requirements

* To use VenueWidget you need last jQuery version from http://code.jquery.com/jquery.min.js
* Put the jquery.min.js file on to HTML document


# How to install the VenueWidget in your web site for your venue

* Make sure you have jQuery loaded

* You need to set a couple of parameters api_token(your api token), account(your account id number) & div_id(the name of div where you draw the table)

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


# How to update this project (only for developers of the VenueWidget project)

* clone the Git repository for this project from GitHub. (We recommend forking the project first.)
* ```rvm use 1.8.7```
* ```rvm gemset create widgets-venuedriver-com```
* ```rvm rvmrc trust .rvmrc```


# How to run the tests on this project

* Install RVM.
* Use RVM to install Ruby 1.8.7 with ```rvm install 1.8.7```
* Tell RVM to use that Ruby with ```rvm use 1.8.7```
* Use RVM to create a gemset with ```rvm gemset create widgets-venuedriver-com```
* Tell RVM to use that gemset with ```rvm gemset use widgets-venuedriver-com```
* Tell RVM to trust the .rvmrc file with ```rvm rvmrc trust .rvmrc```
* Install the project's gems into the gemset with ```bundle install```

* ? - How to run Jasmine?  Hugo's Jasmine runner just doesn't work.
* ? - How to run the RSpec integration spec?  There is no 'rake spec' task for this project.


# How to deploy updates.

The JavaScript code that third-party sites embed is hosted on Amazon S3.  To deploy an update to S3:

* Obtain the current aws.yml file with the token and secret key for the S3 account, and store it in config/aws.yml
* Run the deployment Rake task with ```rake deploy```