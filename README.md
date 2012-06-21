# Venue Driver AccountEventsWidget

This is a jQuery JavaScript widget for displaying a list of upcoming Venue Driver events from a given account, with
ticket-purchase buttons. This widget is intended to be added to a client's web site.

![Final Result](https://github.com/VenueDriver/widgets-venuedriver-com/raw/master/public/images/examples/AccountEventsWidget.png)


# Requirements

* To use VenueWidget you need last jQuery version from http://code.jquery.com/jquery.min.js
* Put the jquery.min.js file on to HTML document


# How to install the AccountEventsWidget in your web site for your venue

* Make sure you have jQuery loaded

* You need to set a couple of parameters api_token(your api token), account(your account id number) & div_id(the name of div where you want the table to be drawn)

* Put the AccountEventsWidget.js file on to HTML document

* The code should look like:

```html
    <html>
      <head>
        <link href="http://widgets.venuedriver.com/css/styles.css"  rel='stylesheet' type='text/css'/>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js" charset="utf-8"></script>
        <script> 
          VenueDriverWidgetConfig = new Object();
          VenueDriverWidgetConfig.api_token = "";  //example '02AFRET3T6A961Q53'
          VenueDriverWidgetConfig.account = '';  //example '12345'
          VenueDriverWidgetConfig.div_id = 'venueWidgetMainTable'; //example 'my_div'
        </script>
        <script src="http://widgets.venuedriver.com/js/AccountEventsWidget.js" charset="utf-8"></script>
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


# How to update this project (only for developers of the widgets.venuedriver.com project)

* clone the Git repository for this project from GitHub. (We recommend forking the project first.)
* Install RVM from [the RVM web site](http://beginrescueend.com/)
* Use RVM to install Ruby 1.8.7 with ```rvm install 1.8.7```
* Tell RVM to use that Ruby with ```rvm use --create 1.8.7@widgets-venuedriver-com```
* Tell RVM to trust the .rvmrc file in the future with ```rvm rvmrc trust .rvmrc```
* Install Qt.  Information on how to install can be found at the [jasmine-headless-webkit](http://johnbintz.github.com/jasmine-headless-webkit/) site.
* Install the gem bundler with ```gem install bundler```
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

## Calendar Widget Protype

# Example

* To begin, here is an exmaple of what your markup should look like

```html
<html>
  <head>
    <title>Calendar demo</title>
    <!--This css is for demonstration purposes, and is not required-->
    <!--This css only works for webkit browsers at the moment, has been tested on chrome-->
    <link href= "http://widgets.venuedriver.com/css/styles.css"  rel='stylesheet' type='text/css'/>
    <!--These are required by the Calendar Widget-->
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js" charset="utf-8"></script>
    <script src="http://widgets.venuedriver.com/js/lib/date.js"s charset="utf-8"></script>
    <!--Finally, include the calendar widget code-->
    <script src="http://widgets.venuedriver.com/js/CalendarEventsWidget.js" charset="utf-8"></script>
  </head>
  <body>
    <!--This is the div where the calendar will reside-->
    <div id='calendar-location'>
    </div>
    <script id='install here'>
      //Your installation code goes here
      $('#calendar-location').AccountCalendar({account_id:1})
    </script> 
  </body>
</html>
```

# Installation Requirements

* You will need a div to place calendar. The example uses '#calendar-location'

* You will need the id of the Account or Venue that the calendar will get events from.

* There are two plugins: AccountCalendar and VenueCalendar - one requires am account_id and the other requires a venue_id

* For an account calendar, use the AccountCalendar plugin ```$('#calendar-location').AccountCalendar({account_id:12})```

* For a venue calendar, use the VenueCalendar plugin ```$('#calendar-location').VenueCalendar({venue_id:42})```

* The plugins are otherwise identical

* The basic installation is finished.

# Calendar Options

* By default, the calendar starts on 'Monday'. This can be changed with the first_day parameter ```$('#calendar-location').AccountCalendar({account_id:12,first_day:Thursday})```

* The calendar defaults to Sunday if the first_day parameter is mispelled ```$('#calendar-location').AccountCalendar({account_id:12,first_day:Thurday})``` will default to Sunday

* (under development- this feature may look akward at the moment) The calendar currently shows the date number for each day of the calendar at the top of its cell. This can be changed by setting the day_bottom parameter to true ```$('#calendar-location').AccountCalendar({account_id:12,day_bottom:true})```

 
