var VenueDriverCalendarEventsWidget;
// var test_url = 'http://localhost:3000/api/accounts/1/events/calendar_month?month=5&year=2012&token=test'
// **Calendar Options**
// api_type - "account" or "venue"
// api_id - id of the api resource
// div_id - the div where we insert the calendar
// first_day -the first day that shows
// javascript represents sunday as 0, monday as 1...saturday as 6
var glb_debug = true;
var Utils = {
  day_string_to_number: function(day_str) { //defaults to sunday if day_str is mispelled
    switch(day_str){
      case "Sunday": return 0;
      case "Monday": return 1;
      case "Tuesday": return 2;
      case "Wednesday": return 3;
      case "Thursday": return 4;
      case "Friday": return 5;
      case "Saturday": return 6;
      default: return 0;
    }
  },
  day_number_to_string: function(day_num){
    switch(day_num){
      case 0: return "Sunday";
      case 1: return "Monday";
      case 2: return "Tuesday";
      case 3: return "Wednesday";
      case 4: return "Thursday";
      case 5: return "Friday";
      case 6: return "Saturday";
      default: "error";
    }
  },
  first_date_of_month: function(date){
    newDate = new Date(date.getFullYear(),date.getMonth());
    return newDate;
  },
}

//iterator for table cells
var CellIndex = function(r,c) {
  this.r = r;
  this.c = c
  this.next =  function() {
    if (c >= 7) return new CellIndex(this.r+1,1);
    else return new CellIndex(this.r,this.c+1);
  };
  if (glb_debug) console.log("r="+this.r+"c="+this.c);
}

VenueDriverCalendarEventsWidget = function(options){
  var this_calendar
  this.test_http = 'http://localhost:3000/api/';
  this.real_http = 'http://www.venuedriver.com/api/';
  this.div_id = '#' + options.div_id
  this.api_type = options.api_type;
  this.api_id = options.api_id;
  this.date = Date.today(); //calendar defaults to current month 
  this.json_events ={};
  this.first_day = Utils.day_string_to_number(options.first_day);
  this.current_cell = new CellIndex(1,1);
  this.set_month = function(year,month) { //wrapper so that month param counts from 1
    this.date = new Date(year,month -1);
    this.pull_api_events();
  };
  this.month = function(){ //wrapper so that month counts from one
    return this.date.getMonth()+1;
  };
  this.year = function(){
    return this.date.getFullYear();
  };
  this.to_next_month = function(){
    if (this_calendar.month() >= 12) this_calendar.set_month(this_calendar.year()+1,1);
    else this_calendar.set_month(this_calendar.year(),this_calendar.month()+1);
  };
  this.to_prev_month = function(){
    if (this_calendar.month() <= 1) this_calendar.set_month(this_calendar.year()-1,12);
    else this_calendar.set_month(this_calendar.year(),this_calendar.month()-1);
  };
  this.api_url = function(){
    return this.test_http + this.api_type +'s/' + this.api_id + '/events/calendar_month?month='+this.month()+'&year='+this.year()+'&token=test';
  };
  this.pull_api_events = function() {
    var url = this.api_url();
    var calendar =this;
    $.getJSON(url,function(data){
      calendar.json_events = data;
      if (glb_debug){console.log(calendar.json_events.length);}
      calendar.events_ready();
    });
  };
  this.prepare_table_header = function() {
    var cal_title = this.date.getMonthName()+' '+this.date.getFullYear();
    $('#calendar-container .title-cell').text(cal_title);
    for(i=0;i<=7;i++){
      var day_num = this.first_day + i;
      if(day_num >= 7) day_num-=7;
      //I use css classes as identifiers here
      var html_location = '#calendar-container .header-'+ (i+1);
      $(html_location).text(Utils.day_number_to_string(day_num));
    }
  };
  this.first_day_of_month = function(){
    return Utils.first_date_of_month(this.date).getDay();
  };
  this.prepare_unused_day_padding = function(){
    difference = this.first_day_of_month() - this.first_day;
    if( difference >= 0) padding = difference;
    else padding = 7 + difference;
   
    if (padding > 0){
      for(i=1;i<=padding;i++){
        html_location = '#calendar-container .rc1'+i;
       // debugger;
        $(html_location).text('Not In Month');
      }
    }
  };
  this.construct_scaffolding = function(){
    var number_of_days = this.date.getDaysInMonth();
    //create container div
    $(this.div_id).html("<div id='calendar-container'>");
    $('</div>').insertAfter("#calendar-container");
    
    //remove previous table
    $('cal-table').remove();
    //clone hidden html table
    table_template = $('.clone-me').clone().attr('class','cal-table').attr('style','')
    $('#calendar-container').append(table_template);
    
    this.prepare_table_header();
    this.prepare_unused_day_padding();
    
    $('#calendar-container .prev-month a').click(this.to_prev_month);
    $('#calendar-container .next-month a').click(this.to_next_month);
  };
  this.events_ready = function() {
    this.construct_scaffolding();
  };
  this_calendar = this;
  this.pull_api_events(); 
}

var mini_test = function(cal) {
  cal.set_month(2012,5);
}

$(document).ready(function() {
  window.t = new VenueDriverCalendarEventsWidget({api_type:"account",api_id:1,div_id:'cal-test',first_day:'Monday'});
  
  
});

