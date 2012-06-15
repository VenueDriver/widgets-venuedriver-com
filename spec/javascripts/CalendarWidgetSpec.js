describe("Calendar Widget", function() {  
  beforeEach(function() {
    preloadFixtures('calendar.html')
    $.ajaxMock.on();
    loadFixtures('calendar.html');
  });
  
  describe("The first day of The calendar grid can be set to any day",function(){
    
    beforeEach(function() {
      std_options = {api_type:"account",api_id:1,div_id:'cal-test'}
      mock_date_today('2012/06/01')
    });
    
    it("can be Monday", function(){
      test_first_day('Monday');
    });
    
    it("can be Tuesday", function(){
      test_first_day('Tuesday');
    });
    
    it("can be Wednesday", function(){
      test_first_day('Wednesday');
    });
    
    it("can be Thursday", function(){
      test_first_day('Thursday');
    });
    
    it("can be Friday", function(){
      test_first_day('Friday');
    });
    
    it("can be Saturday", function(){
      test_first_day('Saturday');
    });
    
    it("can be Sunday", function(){
      test_first_day('Sunday');
    });
    
    function test_first_day(name){
      var options = $().extend(std_options,{first_day:name})
      var calendar = new VenueDriverCalendarEventsWidget(options);
      expect($('#calendar-container .day-1').text()).toEqual(name);
    };
     
  });
  
  describe("Displaying Events",function(){
    
    beforeEach(function() {
      var options = {api_type:"account",api_id:1,div_id:'cal-test',first_day:"Monday"}
      mock_date_today('2012/06/01');
      json = [];
      json.push(make_event_json({event_title:'Event 1',event_date:'2012/06/04',id:1}));
      json.push(make_event_json({event_title:'Event 2',event_date:'2012/06/05',id:2}));
      json.push(make_event_json({event_title:'Event 3',event_date:'2012/06/06',id:3}));
      jQuery.ajaxMock.url('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012&token=test', json);
      window.cal = new VenueDriverCalendarEventsWidget(options);
    });
    
    it('shows events in their proper positions', function(){
      expect($('#calendar-container #2012-06-04 .event-content-area :first-child a').text()).toEqual("Event 1");
      expect($('#calendar-container #2012-06-05 .event-content-area :first-child a').text()).toEqual("Event 2");
      expect($('#calendar-container #2012-06-06 .event-content-area :first-child a').text()).toEqual("Event 3");
    });
  });
  
});