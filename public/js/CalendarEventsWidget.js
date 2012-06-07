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
  //if (glb_debug) console.log("r="+that.r+"c="+that.c);
  this.to_css =function(){
    return ".rc"+r+c;
  };
}

VenueDriverCalendarEventsWidget = function(options){
  var that =this;//that is for jquery event handlers, which rebind 'that' to something else
  that.json_events ={};
  that.sorted_events = [];
  that.current_cell = new CellIndex(1,1); //WARNING that is used like a global variable in the widget member functions
  
  var test_http = 'http://localhost:3000/api/';
  that.real_http = 'http://www.venuedriver.com/api/';
  that.div_id = '#' + options.div_id
  that.api_type = options.api_type;
  that.api_id = options.api_id;
  that.date = Date.today(); //calendar defaults to current month 
  that.first_day = Utils.day_string_to_number(options.first_day);
  that.set_month = function(year,month) { //wrapper so that month param counts from 1
    that.date = new Date(year,month -1);
    that.pull_api_events();
  };
  var month = function(){ //wrapper so that month counts from one
    return that.date.getMonth()+1;
  };
  var year = function(){
    return that.date.getFullYear();
  };
  //public or private?
  that.to_next_month = function(){
    if (that.month() >= 12) that.set_month(that.year()+1,1);
    else that.set_month(that.year(),that.month()+1);
  };
  that.to_prev_month = function(){
    if (that.month() <= 1) that.set_month(that.year()-1,12);
    else that.set_month(that.year(),that.month()-1);
  };
  //private
  api_url = function(){
    return test_http + that.api_type +'s/' + that.api_id + '/events/calendar_month?month='+month()+'&year='+year()+'&token=test';
  };
  //private
  var pull_api_events = function() {
    var url = api_url();
    $.getJSON(url,function(data){
      that.json_events = data;
      if (glb_debug){console.log(that.json_events.length);}
      that.construct_output();
    });
  };
  //private
  that.prepare_calendar_title = function() {
    var cal_title = that.date.getMonthName()+' '+that.date.getFullYear();
    $('#calendar-container .month-title').text(cal_title);
  };
  //private
  that.prepare_table_header = function() {
    that.prepare_calendar_title();
    for(i=0;i<=6;i++){
      var day_num = that.first_day + i;
      if(day_num >= 7) day_num-=7;
      //I use css classes as identifiers here
      var html_location = '#calendar-container .header-'+ (i+1);
      $(html_location).text(Utils.day_number_to_string(day_num));
    }
  };
  //private
  that.first_day_of_month = function(){
    return Utils.first_date_of_month(that.date).getDay();
  };
  //private
  that.prepare_unused_day_pre_padding = function(){
    // that functions goal is to account for spaces in the calendar table 
    // that are not part of the month. that function handles the spaces
    // that occur before the first day of the month
    difference = that.first_day_of_month() - that.first_day;
    if( difference >= 0) padding = difference;
    else padding = 7 + difference;
    //remove extra row if it is not needed
    if(padding+that.date.getDaysInMonth() <= 35) $('#calendar-container .extra-row').remove();
    if (padding > 0){
      that.current_cell = new CellIndex(1,1);
      for(i=1;i<=padding;i++){
        var $html_location = $('#calendar-container ' + that.current_cell.to_css());
        $html_location.text("");
        $html_location.addClass("not-in-month");
        that.current_cell = that.current_cell.next();
      }
    }
    else {
      that.current_cell = new CellIndex(1,1);
    }
  };
  //private
  that.prepare_unused_day_post_padding = function(){
    //that function accounts for unused table cells that occur after the 
    // calendar has run out of days
    while(true){
      var $html_location = $("#calendar-container " + that.current_cell.to_css());
      $html_location.text("");
      $html_location.addClass("not-in-month");
      that.current_cell = that.current_cell.next();
      if (that.current_cell.r>=7) break;
    }
    
  };
  //private
  that.sort_events = function(){
    //sorted events is an array of arrays
    //the outer arrays index is (the date's number -1), as in June 5ths events
    //are in sorted events[4]
    //each inner array contains all the events for a particular day
    for(var day_index =0; day_index<that.date.getDaysInMonth();day_index++){
     that.sorted_events[day_index]=[] 
    }
    
    //iterate through all events in json_events with i
    for(var i=0;i<that.json_events.length;i++){
      event = that.json_events[i];
      index = Date.parse(event.date).getDate()-1;
      that.sorted_events[index].push(event);
    }
    event = null;//help reduce future errors by accidentall reusing that quantity
  };
  //private
  that.format_event_info = function(event, pairs){
    result = "";
    for (var key in pairs) {
      var property = pairs[key];
      result += "' data-" + key + "='"+event[property];
    };
    return result;
  };
  //private
  that.write_embedded_event_data = function(params){
    var l_event = params.event;
    var append = that.format_event_info(l_event,{id:'event_id',title:'title',date:'date',description:'description'});
    var result = "id='event_" + l_event.event_id +append;
    return result;
  };
  //private
  that.write_event_div = function(l_event){
    return "<div class='event-content' "+ that.write_embedded_event_data({event:l_event})+"'></div>";
  };
  //private
  that.prepare_event = function(l_event,$content_area) {
    var id = 'event_'+l_event.event_id;
    var event_div = that.write_event_div(l_event);
    $content_area.append(event_div);
    var $event_location = $('#calendar-container #event_'+l_event.event_id);
    $event_location.append("<div class='event-title'><a href='#'>"+l_event.title+"</a></div>");
    $event_location.append("<div class='event-date'>"+l_event.date+"</div>");
    $('#'+id).click(function(){
      var info = $(this)
      //here 'that' = $('#'+id) called above ^^
      var html = "<p> id: "+info.attr('data-id')+" </p>"
      html += "<p> title: "+info.attr('data-title')+" </p>"
      html += "<p> date: " +info.attr('data-date')+" </p>"
      html += "<p> description: " +info.attr('data-description')+" </p>"
      $('#side-panel').html(html);
    });
  }
  //private
  that.prepare_events = function(the_days_events,$content_area){
     for(var j = 0;j<the_days_events.length;j++){
        var event_= the_days_events[j];
        that.prepare_event(event_,$content_area);
      }
  };
  //private
  that.prepare_days = function(){
    var number_of_days =that.date.getDaysInMonth();
    that.sort_events();
    for (i=1; i<= number_of_days;i++){
      var css_path = "#calendar-container " + that.current_cell.to_css();
      var $html_location = $(css_path);
      $html_location.text("");
      $html_location.addClass('in-month');
      $html_location.append("<div class='day-number'>"+i+"</div>");
      $html_location.append("<div class='event-content-area'></div>");
      $event_content_area = $(css_path + ' .event-content-area');
      var the_days_events = that.sorted_events[i-1];
      if(the_days_events.length > 0)$html_location.addClass('has-events');
      else $html_location.addClass('has-no-events');
      that.prepare_events(the_days_events,$event_content_area);         
      that.current_cell = that.current_cell.next();
    };
  };
  //private
  that.clone_table_template = function() {
    //remove previous table
    $('cal-table').remove();
    //clone hidden html table
    table_template = $('.clone-me').clone().attr('class','cal-table').attr('style','display:inline-block;float:left');
    $('#calendar-container').append(table_template);
  };
  //private
  that.prepare_navigation_buttons = function(){
    $('#calendar-container .prev-month').click(that.to_prev_month);
    $('#calendar-container .next-month').click(that.to_next_month);
  };
  //private
  that.construct_output = function(){
    $(that.div_id).html("<div id='calendar-container'></div>");  
    that.clone_table_template();
    that.prepare_table_header();
    that.prepare_unused_day_pre_padding();
    that.prepare_days();
    that.prepare_unused_day_post_padding();
    that.prepare_navigation_buttons();
    $(that.div_id + ' #calendar-container').append("<div id='side-panel' style='display:inline-block;float:left'>side panel </div>");
  };
  that.change_first_day = function(day_str) {
    that.first_day = Utils.day_string_to_number(day_str);
    that.construct_output();
  };
  pull_api_events(); 
}

$(document).ready(function() {
  window.t = new VenueDriverCalendarEventsWidget({api_type:"account",api_id:1,div_id:'cal-test',first_day:'Monday'});
});

