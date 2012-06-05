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
      //use fall through behavior to check for capitlized and uncapitlized forms
      case "sunday":
      case "Sunday": return 0;
      case "monday":
      case "Monday": return 1;
      case "tuesday":
      case "Tuesday": return 2;
      case "wednesday":
      case "Wednesday": return 3;
      case "thursday":
      case "Thursday": return 4;
      case "friday":
      case "Friday": return 5;
      case "saturday":
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
  //if (glb_debug) console.log("r="+this.r+"c="+this.c);
  this.to_css =function(){
    return ".rc"+r+c;
  };
}

VenueDriverCalendarEventsWidget = function(options){
  var this_calendar =this;//this is for jquery event handlers, which rebind 'this' to something else
  this.test_http = 'http://localhost:3000/api/';
  this.real_http = 'http://www.venuedriver.com/api/';
  this.div_id = '#' + options.div_id
  this.api_type = options.api_type;
  this.api_id = options.api_id;
  this.date = Date.today(); //calendar defaults to current month 
  this.json_events ={};
  this.sorted_events = [];
  this.first_day = Utils.day_string_to_number(options.first_day);
  this.current_cell = new CellIndex(1,1); //WARNING This is used like a global variable in the widget member functions
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
    $.getJSON(url,function(data){
      this_calendar.json_events = data;
      if (glb_debug){console.log(this_calendar.json_events.length);}
      this_calendar.construct_output();
    });
  };
  this.prepare_calendar_title = function() {
    var cal_title = this.date.getMonthName()+' '+this.date.getFullYear();
    $('#calendar-container .month-title').text(cal_title);
  };
  this.prepare_table_header = function() {
    this.prepare_calendar_title();
    for(i=0;i<=6;i++){
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
  this.prepare_unused_day_pre_padding = function(){
    difference = this.first_day_of_month() - this.first_day;
    if( difference >= 0) padding = difference;
    else padding = 7 + difference;
    if(padding+this.date.getDaysInMonth() <= 35) $('#calendar-container .extra-row').remove();
    if (padding > 0){
      this.current_cell = new CellIndex(1,1);
      for(i=1;i<=padding;i++){
        var $html_location = $('#calendar-container ' + this.current_cell.to_css());
        $html_location.text("");
        $html_location.addClass("not-in-month");
        this.current_cell = this.current_cell.next();
      }
    }
    else {
      this.current_cell = new CellIndex(1,1);
    }
  };
  this.prepare_unused_day_post_padding = function(){
    while(true){
      var $html_location = $("#calendar-container " + this.current_cell.to_css());
      $html_location.text("");
      $html_location.addClass("not-in-month");
      this.current_cell = this.current_cell.next();
      if (this.current_cell.r>=7) break;
    }
    
  };
  this.sort_events = function(){
    //sorted events is an array of arrays
    //the outer arrays index is the date number -1, as in June 5ths events
    //are in sorted events[4]
    //each inner array contains all the events for a particular day
    for(var day_index =0; day_index<this.date.getDaysInMonth();day_index++){
     this.sorted_events[day_index]=[] 
    }
    
    //iterate through all events in json_events with i
    for(var i=0;i<this.json_events.length;i++){
      event = this.json_events[i];
      index = Date.parse(event.date).getDate()-1;
      this.sorted_events[index].push(event);
    }

  };
  this.prepare_days = function(){
    var number_of_days =this.date.getDaysInMonth();
    this.sort_events();
    for (i=1; i<= number_of_days;i++){
      var html_location = "#calendar-container " + this.current_cell.to_css();
      $(html_location).text("");
      $(html_location).append("<div class='day-number'>"+i+"</div>");
      $(html_location).addClass('in-month')
      $(html_location).append("<div class='event-content-area'>");
      $(html_location).append("</div>")
      $html_location2 = $(html_location + ' .event-content-area')
      var the_days_events = this.sorted_events[i-1];
      for(var j = 0;j<this.sorted_events[i-1].length;j++){
        event = the_days_events[j];

        $html_location2.append("<div class='event-content' id='event_"+event.event_id +"'>") 
        $html_location2.append("</div>");
        $event_location = $('#calendar-container #event_'+event.event_id);
        $event_location.append("<div class='event-title'>"+event.title+"</div>");
        $event_location.append("<div class='event-date'>"+event.date+"</div>");
      }
      
      this.current_cell = this.current_cell.next();
    };
  };
  this.construct_output = function(){
    //create container div
    $(this.div_id).html("<div id='calendar-container'>");
    $('</div>').insertAfter("#calendar-container");    
    //remove previous table
    $('cal-table').remove();
    //clone hidden html table
    table_template = $('.clone-me').clone().attr('class','cal-table').attr('style','')
    $('#calendar-container').append(table_template);
    
    this.prepare_table_header();
    this.prepare_unused_day_pre_padding();
    this.prepare_days();
    this.prepare_unused_day_post_padding();
    
    $('#calendar-container .prev-month').click(this.to_prev_month);
    $('#calendar-container .next-month').click(this.to_next_month);
  };
  this.change_first_day = function(day_str) {
    this.first_day = Utils.day_string_to_number(day_str);
    this.construct_output();
  };
  this.pull_api_events(); 
  //this.construct_output();
}

$(document).ready(function() {
  window.t = new VenueDriverCalendarEventsWidget({api_type:"account",api_id:1,div_id:'cal-test',first_day:'Monday'});
});

