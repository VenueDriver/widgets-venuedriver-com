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
          VenueDriverWidgetConfig = new Object();
          VenueDriverWidgetConfig.api_token = "";  //example '02AFRET3T6A961Q53'
          VenueDriverWidgetConfig.account = '';  //example '12345'
          VenueDriverWidgetConfig.div_id = 'venueWidgetMainTable'; //example 'my_div'
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
* Install RVM from [the RVM web site](http://beginrescueend.com/)
* Use RVM to install Ruby 1.8.7 with ```rvm install 1.8.7```
* Tell RVM to use that Ruby with ```rvm use --create 1.8.7@widgets-venuedriver-com```
* Tell RVM to trust the .rvmrc file in the future with ```rvm rvmrc trust .rvmrc```
* Install Qt.  Information on how to install can be found at the [jasmine-headless-webkit](http://johnbintz.github.com/jasmine-headless-webkit/) site.
* Install the project's gems into the gemset with ```bundle install```


# How to run the tests on this project

## Headless

* Run the Jasmine specs using jasmine-headless-webkit with ```jasmine-headless-webkit```.  You should see results that look something like: ```PASS: 9 tests, 0 failures, 0.025 secs.```

## Interactive

* You can run Jasmine as a web server so that you can use Chrome or Safari or Firebug for Javascript debugging, with ```rake jasmine```.  Then navigate to [http://localhost:8888](http://localhost:8888) to run the specs.

## RSpec

* This project doesn't actually have any RSpec spec.  (yet?)  So don't worry about that.


# How to deploy updates.

The JavaScript code that third-party sites embed is hosted on Amazon S3.  To deploy an update to S3:

* Obtain the current aws.yml file with the token and secret key for the S3 account, and store it in config/aws.yml
* Run the deployment Rake task with ```rake deploy```