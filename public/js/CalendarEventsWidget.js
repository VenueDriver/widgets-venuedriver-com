
var calendar_html = "<table border='1' class='clone-me' style='display:none'>\n\
  <tr class='calendar-title-row'>\n\
    <th class='title-cell' colspan='7'>\n\
      <span class='calendar-title title'></span>\n\
      <span class ='navigation-group'>\n\
        <button class='prev-month change-month' >Previous Month</button>\n\
        <span class='month-title title'> </span>\n\
        <button class='next-month change-month'>Next Month</button>\n\
      </span>\n\
    </th>\n\
  </tr>\n\
  \n\
  <tr class ='day-title-row'>\n\
    <th class='day-1'></th>\n\
    <th class='day-2'></th>\n\
    <th class='day-3'></th>\n\
    <th class='day-4'></th>\n\
    <th class='day-5'></th>\n\
    <th class='day-6'></th>\n\
    <th class='day-7'></th>\n\
  </tr>\n\
  \n\
  <tr class='row1'>\n\
    <td class='rc11'></td>\n\
    <td class='rc12'></td>\n\
    <td class='rc13'></td>\n\
    <td class='rc14'></td>\n\
    <td class='rc15'></td>\n\
    <td class='rc16'></td>\n\
    <td class='rc17'></td>\n\
  </tr>\n\
  <tr class='row2'>\n\
    <td class='rc21'></td>\n\
    <td class='rc22'></td>\n\
    <td class='rc23'></td>\n\
    <td class='rc24'></td>\n\
    <td class='rc25'></td>\n\
    <td class='rc26'></td>\n\
    <td class='rc27'></td>\n\
  </tr>\n\
  <tr class='row3'>\n\
    <td class='rc31'></td>\n\
    <td class='rc32'></td>\n\
    <td class='rc33'></td>\n\
    <td class='rc34'></td>\n\
    <td class='rc35'></td>\n\
    <td class='rc36'></td>\n\
    <td class='rc37'></td>\n\
  </tr>\n\
  <tr class='row4'>\n\
    <td class='rc41'></td>\n\
    <td class='rc42'></td>\n\
    <td class='rc43'></td>\n\
    <td class='rc44'></td>\n\
    <td class='rc45'></td>\n\
    <td class='rc46'></td>\n\
    <td class='rc47'></td>\n\
  </tr>\n\
  <tr class='row5'>\n\
    <td class='rc51'></td>\n\
    <td class='rc52'></td>\n\
    <td class='rc53'></td>\n\
    <td class='rc54'></td>\n\
    <td class='rc55'></td>\n\
    <td class='rc56'></td>\n\
    <td class='rc57'></td>\n\
  </tr>\n\
  <tr class='extra-row'>\n\
    <td class='rc61'></td>\n\
    <td class='rc62'></td>\n\
    <td class='rc63'></td>\n\
    <td class='rc64'></td>\n\
    <td class='rc65'></td>\n\
    <td class='rc66'></td>\n\
    <td class='rc67'></td>\n\
  </tr>\n\
</table>";



var VenueDriverCalendarWidget;
// **Calendar Options**
// api_type - "account" or "venue"
// api_id - id of the api resource
// div_id - the div where we insert the calendar
// first_day -the first day that shows
// javascript represents sunday as 0, monday as 1...saturday as 6
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
  this.set = function(new_row,new_col) {
    this.r = new_row;
    this.c = new_col
  };
  this.set(r,c);
  this.next = function() {
    if (this.c >= 7) return new CellIndex(this.r+1,1);
    else return new CellIndex(this.r,this.c+1);
  };
  this.go_to_next = function(){
    if (this.c >= 7) this.set(this.r+1,1);
    else this.set(this.r,this.c+1);
  };
  
  this.to_css =function(){
    return ".rc"+this.r+this.c;
  };
  r= null;
  c= null;
}

VenueDriverCalendarWidget = function(options){
  var that =this;//that is for jquery event handlers, which rebind 'that' to something else
  var json_events =[];
  this.t_json_events = json_events;
  var sorted_events= [];
  this.t_sorted_events = sorted_events;
  var current_cell = new CellIndex(1,1); //WARNING that is used like a global variable in the widget member functions
  var test_http = 'http://localhost:3000/api/';
  var real_http = 'http://www.venuedriver.com/api/';
  var http_str;
  this.db_transform = options.day_bottom || false;
  if (options.testing ==true){
    http_str = test_http;
  } else {
    http_str = real_http;
  }
  var div_id = '#' + options.div_id
  var api_type = options.api_type;
  var api_id = options.api_id;
  var date = Date.today(); //calendar defaults to current month 
  this.t_date = date;
  var first_day = Utils.day_string_to_number(options.first_day || 'Monday');
  var refresh_on_creation = options.refresh_on_creation || true;
  that.set_month = function(year,month) {
    date = new Date(year,month -1);
    json_events=[];
    construct_output();
    pull_api_events();
  };
  
  var month = function(){ //wrapper so that month counts from one
    return date.getMonth()+1;
  };
  
  var year = function(){
    return date.getFullYear();
  };
  
  var to_next_month = function(){
    if (month() >= 12) that.set_month(year()+1,1);
    else that.set_month(year(),month()+1);
  };
  
  var to_prev_month = function(){
    if (month() <= 1) that.set_month(year()-1,12);
    else that.set_month(year(),month()-1);
  };

  var api_url = function(){
    return http_str + api_type +'s/' + api_id + '/events/calendar_month?month='+month()+'&year='+year();
  };this.t_api_url = api_url;

  var pull_api_events = function() {
    var url = api_url();
    console.log(url);
    $.getJSON(url,function(data){
      json_events = data;
      that._json_events = data
      construct_output();
    });
  };this.t_pull_api_events = pull_api_events;
  
  first_day_of_month = function(){
    return Utils.first_date_of_month(date).getDay();
  };

  var construct_calendar_title = function() {
    var cal_title = date.getMonthName()+' '+date.getFullYear();
    //TODO, make an option for setting calendar title
    $('#calendar-container .calendar-title').text("Events Calendar");
    $('#calendar-container .month-title').text(cal_title);
  };

  var construct_table_header = function() {
    //clarify this if time permits
    construct_calendar_title();
    for(i=0;i<=6;i++){
      var day_num = first_day + i;
      if(day_num >= 7) day_num-=7;
      //I use css classes as identifiers here
      var html_location = '#calendar-container .day-'+ (i+1);
      $(html_location).text(Utils.day_number_to_string(day_num));
    }
  };

  var construct_unused_day_pre_padding = function(){
    // that functions goal is to account for spaces in the calendar table 
    // that are not part of the month. that function handles the spaces
    // that occur before the first day of the month
    difference = first_day_of_month() - first_day;
    if( difference >= 0) padding = difference;
    else padding = 7 + difference;
    //remove extra row if it is not needed
    if(padding+date.getDaysInMonth() <= 35) $('#calendar-container .extra-row').remove();
    if (padding > 0){
      current_cell = new CellIndex(1,1);
      for(i=1;i<=padding;i++){
        var $html_location = $('#calendar-container ' + current_cell.to_css());
        $html_location.text("");
        $html_location.addClass("not-in-month");
        current_cell.go_to_next();
      }
    }
    else {
      current_cell = new CellIndex(1,1);
    }
  };

  var construct_unused_day_post_padding = function(){
    //that function accounts for unused table cells that occur after the 
    // calendar has run out of days
    while(true){
      var $html_location = $("#calendar-container " + current_cell.to_css());
      $html_location.text("");
      $html_location.addClass("not-in-month");
      current_cell.go_to_next();
      if (current_cell.r>=7) break;
    }
    
  };

  var sort_events = function(){
    //sorted events is an array of arrays
    //the outer arrays index is (the date's number -1), as in June 5ths events
    //are in sorted events[4]
    //each inner array contains all the events for a particular day
    for(var day_index =0; day_index<date.getDaysInMonth();day_index++){
     sorted_events[day_index]=[] 
    }
    
    //iterate through all events in json_events with i
    for(var i=0;i<json_events.length;i++){
      event = json_events[i];
      index = Date.parse(event.date).getDate()-1;
      sorted_events[index].push(event);
    }
    this.t_sorted_events = sorted_events
    event = null;//help reduce future errors by accidentall reusing that quantity
  };

  var format_event_info = function(event, pairs){
    result = "";
    for (var key in pairs) {
      var property = pairs[key];
      result += "' data-" + key + "='"+event[property];
    };
    return result;
  };

  var write_embedded_event_data = function(event_param){
    var l_event = event_param;
    var append = format_event_info(l_event,{id:'event_id',title:'title',date:'date',description:'description'});
    var result = "id='event_" + l_event.event_id +append;
    return result;
  }; 

  var write_event_div = function(l_event){
    return "<div class='event-content' "+ write_embedded_event_data(l_event)+"'></div>";
  };

  var construct_event = function(l_event,$content_area) {
    var id = 'event_'+l_event.event_id;
    var event_div = write_event_div(l_event);
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

  var construct_events = function(the_days_events,$content_area){
     for(var j = 0;j<the_days_events.length;j++){
        var event_= the_days_events[j];
        construct_event(event_,$content_area);
      }
  };

  var construct_days = function(){
    var number_of_days =date.getDaysInMonth();
    sort_events();
    for (i=1; i<= number_of_days;i++){
      var css_path = "#calendar-container " + current_cell.to_css();
      var $html_location = $(css_path);
      $html_location.text("");
      //TODO:this snippet should be a function
      var d = Utils.first_date_of_month(date).add(i-1).days();
      var month = d.getMonth()+1;
      var date_num = d.getDate()
      if (month <10) month = '0' +month;
      if (date_num<10) date_num = '0'+date_num;
      var id = d.getFullYear()+'-'+month+'-'+ date_num;
      
      $html_location.attr('id',id);
      $html_location.addClass('in-month');
      $html_location.append("<div class='day-number'>"+i+"</div>");
      $html_location.append("<div class='events-content-area'></div>");
      $event_content_area = $(css_path + ' .events-content-area');
      var the_days_events = sorted_events[i-1];
      if(the_days_events.length > 0)$html_location.addClass('has-events');
      else $html_location.addClass('has-no-events');
      construct_events(the_days_events,$event_content_area);
      
      if(that.db_transform){
        $html_location.addClass('date-bottom-style')
        $('#'+id + ' .events-content-area').insertBefore('#'+id + ' .day-number');
        $('#'+id + ' .day-number').attr('style','vertical-align:bottom')
      } else {
        $html_location.addClass('date-top-style')
      }         
      current_cell.go_to_next();
    };
  };

  var clone_table_template = function() {
    //remove previous table
    $('cal-table').remove();
    //clone hidden html table
    table_template = $('.clone-me').clone().attr('class','cal-table').attr('style','display:inline-block;float:left');
    $('#calendar-container').append(table_template);
  };

  var construct_navigation_buttons = function(){
    $('#calendar-container .prev-month').click(to_prev_month);
    $('#calendar-container .next-month').click(to_next_month);
  };

  var construct_output = function(){
    $(div_id).html("<div id='calendar-container'></div>");  
    if ($('.clone-me').length == 0){
      $('body').append(calendar_html);
    }
    clone_table_template();
    construct_table_header();
    construct_unused_day_pre_padding();
    construct_days();
    construct_unused_day_post_padding();
    construct_navigation_buttons();
    $(div_id + ' #calendar-container').append("<div id='side-panel' style='display:inline-block;float:left'>side panel </div>");
  };
  that.change_first_day = function(day_str) {
    first_day = Utils.day_string_to_number(day_str);
    that.construct_output();
  };
  construct_output();
  this.refresh = construct_output;
  if (refresh_on_creation) pull_api_events(); 
}


jQuery.fn.VenueCalendar = function(params) {
  var $location = this.attr('id');
  var settings = jQuery.extend(params,{div_id:$location,api_type:'venue',api_id:params.venue_id});
  window.my_calendar = new VenueDriverCalendarWidget(settings);
  return this;
};

jQuery.fn.AccountCalendar = function(params) {
  var $location = this.attr('id');
  var settings = jQuery.extend(params,{div_id:$location,api_type:'account',api_id:params.account_id});
  window.my_calendar = new VenueDriverCalendarWidget(settings);
  return this;
};



$(document).ready(function() {
  //$('#cal-test').AccountCalendar({api_id:1,first_day:'Thursday',testing:true,day_bottom:false});
  //$('#cal-test').AccountCalendar({account_id:1,testing:true})
  //$('#cal-test').AccountCalendar({api_id:1})
});

//for development
window.show_calendar_in_devel = function(){
  $('#cal-test').AccountCalendar({account_id:1,testing:true})
};


