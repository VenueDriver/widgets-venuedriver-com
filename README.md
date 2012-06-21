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

# Installing the Calendar

* To begin, you will need your html to look like this

```html
<html>
  <head>
    <title>Calendar demo</title>
    <link href= "http://widgets.venuedriver.com/css/styles.css"  rel='stylesheet' type='text/css'/>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js" charset="utf-8"></script>
    <script src="http://widgets.venuedriver.com/js/lib/date.js"s charset="utf-8"></script>
    <script src="http://widgets.venuedriver.com/js/CalendarEventsWidget.js" charset="utf-8"></script>
    <script>
      //your instllation code goes here
    </script>
  </head>
  <body>
    <div id='cal-test'>
    </div> 
    <table border='1' class='clone-me' style="display:none">
      <tr class='calendar-title-row'>
        <th class='title-cell' colspan='7'>
          <span class='calendar-title title'></span>
          <span class ='navigation-group'>
            <button class='prev-month change-month' >Previous Month</button>
            <span class='month-title title'> </span>
            <button class='next-month change-month'>Next Month</button>
          </span>
        </th>
      </tr>    
      <tr class ='day-title-row'>
        <th class='day-1'></th>
        <th class='day-2'></th>
        <th class='day-3'></th>
        <th class='day-4'></th>
        <th class='day-5'></th>
        <th class='day-6'></th>
        <th class='day-7'></th>
      </tr>      
      <tr class='row1'>
        <td class='rc11'></td>
        <td class='rc12'></td>
        <td class='rc13'></td>
        <td class='rc14'></td>
        <td class='rc15'></td>
        <td class='rc16'></td>
        <td class='rc17'></td>
      </tr>
      <tr class='row2'>
        <td class='rc21'></td>
        <td class='rc22'></td>
        <td class='rc23'></td>
        <td class='rc24'></td>
        <td class='rc25'></td>
        <td class='rc26'></td>
        <td class='rc27'></td>
      </tr>
      <tr class='row3'>
        <td class='rc31'></td>
        <td class='rc32'></td>
        <td class='rc33'></td>
        <td class='rc34'></td>
        <td class='rc35'></td>
        <td class='rc36'></td>
        <td class='rc37'></td>
      </tr>
      <tr class='row4'>
        <td class='rc41'></td>
        <td class='rc42'></td>
        <td class='rc43'></td>
        <td class='rc44'></td>
        <td class='rc45'></td>
        <td class='rc46'></td>
        <td class='rc47'></td>
      </tr>
      <tr class='row5'>
        <td class='rc51'></td>
        <td class='rc52'></td>
        <td class='rc53'></td>
        <td class='rc54'></td>
        <td class='rc55'></td>
        <td class='rc56'></td>
        <td class='rc57'></td>
      </tr>
      <tr class='extra-row'>
        <td class='rc61'></td>
        <td class='rc62'></td>
        <td class='rc63'></td>
        <td class='rc64'></td>
        <td class='rc65'></td>
        <td class='rc66'></td>
        <td class='rc67'></td>
      </tr>    
    </table> 
  </body>
</html>

```