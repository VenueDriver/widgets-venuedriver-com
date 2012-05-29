var VenueDriverCalendarEventsWidget;
var test_url = 'http://localhost:3000/api/accounts/1/events/calendar_month?month=5&year=2012&token=test'
var test_json;
var test = function(){
  $.getJSON(test_url,function(data){
    test_json = data;
  })
}
// **calendar options**
// TODO:day of the first collumn, as in "calendar starts with sunday/monday"
// api_type - "account" or "venue"
// api_id - id of the api resource
VenueDriverCalendarEventsWidget = function(options){
  this.test_http = 'http://localhost:3000/api/'
  this.real_http = 'http://www.venuedriver.com/api/'
  this.api_type = options.api_type;
  this.api_id = options.api_id;
  this.date = Date.today(); //calendar defaults to current month 
  this.json_events;
  this.setMonth = function(year,month) { //month param counts from 1
    this.date = new Date(year,month -1);
  };
  this.month = function(){
    return this.date.getMonth()+1;
  };
  this.year = function(){
    return this.date.getFullYear();
  }
  this.api_url = function(){
    return this.test_http + this.api_type +'/' + this.api_id + '/events/calendar_month?month='+this.month()+'&year='+this.year()+'&token=test';
  }
  this.pull_api_events = function() {
    var url = this.api_url();
  } 
}

var test_obj = new VenueDriverCalendarEventsWidget({api_type:"account",api_id:1});
test_obj.setMonth(2012,5);