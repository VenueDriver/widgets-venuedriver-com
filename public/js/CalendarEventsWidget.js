var VenueDriverCalendarEventsWidget;
// var test_url = 'http://localhost:3000/api/accounts/1/events/calendar_month?month=5&year=2012&token=test'
// **Calendar Options**
// api_type - "account" or "venue"
// api_id - id of the api resource
// div_id - the div where we insert the calendar
// first_day -the first day that shows
// javascript represents sunday as 0, monday as 1...saturday as 6
var glb_debug = true;
var db_panel = true;
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
  this.c = c;
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
  var new_div = '#components .empty-div'
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
  this.update_side_panel = function(text) {
    $('#side-panel').text(text);
  }
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
    // this functions goal is to account for spaces in the calendar table 
    // that are not part of the month. This function handles the spaces
    // that occur before the first day of the month
    difference = this.first_day_of_month() - this.first_day;
    if( difference >= 0) padding = difference;
    else padding = 7 + difference;
    //remove extra row if it is not needed
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
    //this function accounts for unused table cells that occur after the 
    // calendar has run out of days
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
    //the outer arrays index is (the date's number -1), as in June 5ths events
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
    event = null;//help reduce future errors by accidentall reusing this quantity
  };
  this.format_event_info = function(event, pairs){
    result = "";
    for (var key in pairs) {
      result += "' data-" + key + "='"+event[pairs[key]];
    };
    return result;
  };
  this.write_embedded_event_data = function(params){
    var l_event = params.event;
    var append = this.format_event_info(l_event,{id:'event_id',title:'title',date:'date',description:'description'});
    var result = "id='event_" + l_event.event_id +append;
    return result;
  };
  this.write_event_div = function(l_event){
    return "<div class='event-content' "+ this.write_embedded_event_data({event:l_event})+"'></div>";
  };
  this.prepare_events = function(the_days_events,$content_area){
     for(var j = 0;j<the_days_events.length;j++){
        var event_= the_days_events[j];
        var id = 'event_'+event_.event_id;
        var event_div = this.write_event_div(event_);
        $content_area.append(event_div);
        $event_location = $('#calendar-container #event_'+event_.event_id);
        $event_location.append("<div class='event-title'><a href='#'>"+event_.title+"</a></div>");
        $event_location.append("<div class='event-date'>"+event_.date+"</div>");
        $('#'+id).click(function(){
          var info = $(this)
          //here 'this' = $('#'+id) called above ^^
          var html = "<p> id: "+info.attr('data-id')+" </p>"
          html += "<p> title: "+info.attr('data-title')+" </p>"
          html += "<p> date: "+info.attr('data-date')+" </p>"
          $('#side-panel').html(html);
        });
      }
  };
  this.prepare_days = function(){
    var number_of_days =this.date.getDaysInMonth();
    this.sort_events();
    for (i=1; i<= number_of_days;i++){
      var css_path = "#calendar-container " + this.current_cell.to_css();
      var $html_location = $(css_path);
      $html_location.text("");
      $html_location.addClass('in-month');
      $html_location.append("<div class='day-number'>"+i+"</div>");
      $html_location.append("<div class='event-content-area'></div>");
      $html_location2 = $(css_path + ' .event-content-area');
      var the_days_events = this.sorted_events[i-1];
      if(the_days_events.length > 0)$html_location.addClass('has-events');
      else $html_location.addClass('has-no-events');
      this.prepare_events(the_days_events,$html_location2);         
      this.current_cell = this.current_cell.next();
    };
  };
  this.clone_table_template = function() {
    //remove previous table
    $('cal-table').remove();
    //clone hidden html table
    table_template = $('.clone-me').clone().attr('class','cal-table').attr('style','display:inline-block;float:left');
    $('#calendar-container').append(table_template);
  };
  this.construct_output = function(){
    //create container div
    $(this.div_id).html("<div id='calendar-container'></div>");  
    
    this.clone_table_template();
    this.prepare_table_header();
    this.prepare_unused_day_pre_padding();
    this.prepare_days();
    this.prepare_unused_day_post_padding();
    
    $('#calendar-container .prev-month').click(this.to_prev_month);
    $('#calendar-container .next-month').click(this.to_next_month);
    
    $(this.div_id + ' #calendar-container').append("<div id='side-panel' style='display:inline-block;float:left'>side panel </div>");
  };
  this.change_first_day = function(day_str) {
    this.first_day = Utils.day_string_to_number(day_str);
    this.construct_output();
  };
  this.pull_api_events(); 
}

$(document).ready(function() {
  window.t = new VenueDriverCalendarEventsWidget({api_type:"account",api_id:1,div_id:'cal-test',first_day:'Monday'});
});

