describe("Calendar Widget", function() {  
  var std_options = {api_type:"account",api_id:1,div_id:'cal-test',first_day:"Monday"};
  beforeEach(function() {
    preloadFixtures('calendar.html')
    $.ajaxMock.on();
    loadFixtures('calendar.html');
  });
  
  describe("The first day of The calendar grid can be set to any day",function(){
    
    beforeEach(function() {
      mock_date_today('2012/06/01')
    });
    
    afterEach(restore_date_today);
    
    it("can be Monday", function(){
      test_first_day('Monday');
      //rcXY is a class for a calendar cell in row X, collumn Y
      check_first_day_position("rc15");
    });
    
    it("can be Tuesday", function(){
      test_first_day('Tuesday');
      check_first_day_position("rc14");
    });
    
    it("can be Wednesday", function(){
      test_first_day('Wednesday');
      check_first_day_position("rc13");
    });
    
    it("can be Thursday", function(){
      test_first_day('Thursday');
      check_first_day_position("rc12");
    });
    
    it("can be Friday", function(){
      test_first_day('Friday');
      check_first_day_position("rc11");
    });
    
    it("can be Saturday", function(){
      test_first_day('Saturday');
      check_first_day_position("rc17");
    });
    
    it("can be Sunday", function(){
      test_first_day('Sunday');
      check_first_day_position("rc16");
    });
    
    function test_first_day(name){
      var options = $().extend(std_options,{});
      options.first_day =name;
      var calendar = new VenueDriverCalendarEventsWidget(options);
      expect($('#calendar-container .day-1').text()).toEqual(name);
    };
    
    function check_first_day_position(position){
      expect($('#calendar-container ' +'.'+position).attr('id')).toEqual('2012-06-01');
    };
     
  });
  
  describe("Displaying Events",function(){
    
    beforeEach(function() {
      var options = {api_type:"account",api_id:1,div_id:'cal-test',first_day:"Monday"}
      mock_date_today('2012/06/01');
      json = [];
      events = []
      event1 = new FakeEvent({event_title:'Event 1',event_date:'2012/06/04',id:1});
      event2 = new FakeEvent({event_title:'Event 2',event_date:'2012/06/05',id:2});
      event3 = new FakeEvent({event_title:'Event 3',event_date:'2012/06/06',id:3});
      
      json.push(make_event_json(event1));
      json.push(make_event_json(event2));
      json.push(make_event_json(event3));
      jQuery.ajaxMock.url('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012&token=test', json);
      window.cal = new VenueDriverCalendarEventsWidget(options);
    });
    
    it('shows events in their proper positions', function(){
      expect($('#calendar-container #2012-06-04 .events-content-area :first-child a').text()).toEqual("Event 1");
      expect($('#calendar-container #2012-06-05 .events-content-area :first-child a').text()).toEqual("Event 2");
      expect($('#calendar-container #2012-06-06 .events-content-area :first-child a').text()).toEqual("Event 3");
    });
    
    it('embeds information in data-attributes inside the event-content divs', function(){
      var $test_location = $('#calendar-container #2012-06-04 .events-content-area :first-child');
      expect($test_location.attr('data-title')).toEqual('Event 1');
      expect($test_location.attr('data-date')).toEqual('2012/06/04');
      expect($test_location.attr('data-id')).toEqual('1');
      
      $test_location = $('#calendar-container #2012-06-05 .events-content-area :first-child');
      expect($test_location.attr('data-title')).toEqual('Event 2');
      expect($test_location.attr('data-date')).toEqual('2012/06/05');
      expect($test_location.attr('data-id')).toEqual('2');
      
      $test_location = $('#calendar-container #2012-06-06 .events-content-area :first-child');
      expect($test_location.attr('data-title')).toEqual('Event 3');
      expect($test_location.attr('data-date')).toEqual('2012/06/06');
      expect($test_location.attr('data-id')).toEqual('3');
    });
  });
  
  describe("Navigation", function(){
    
    describe('Month to Month',function(){
      beforeEach(function(){
        mock_date_today('2012/06/01');
        window.cal = new VenueDriverCalendarEventsWidget(std_options);
      });
      
      afterEach(restore_date_today);
    
      it("should go to the next month, when the 'next month' button is pressed",function(){
        expect($('#calendar-container .month-title').text()).toEqual("June 2012");
        $btn = $('#calendar-container .next-month');
        $btn.trigger('click');
        expect($('#calendar-container .month-title').text()).toEqual("July 2012")
      });
    
      it("should go to the previous month, when the 'previous month' button is pressed",function(){
        expect($('#calendar-container .month-title').text()).toEqual("June 2012");
        $btn = $('#calendar-container .prev-month');
        $btn.trigger('click');
        expect($('#calendar-container .month-title').text()).toEqual("May 2012")
      });
    });
    
    describe('Crossing Year Bounaries',function(){
      
      it('should go to the next year',function(){
        mock_date_today('2012/12/01');
        window.cal = new VenueDriverCalendarEventsWidget(std_options);
        expect($('#calendar-container .month-title').text()).toEqual("December 2012");
        $btn = $('#calendar-container .next-month');
        $btn.trigger('click');
        expect($('#calendar-container .month-title').text()).toEqual("January 2013");
      })
      
      it('should go to the previous year',function(){
        mock_date_today('2012/01/01');
        window.cal = new VenueDriverCalendarEventsWidget(std_options);
        expect($('#calendar-container .month-title').text()).toEqual("January 2012");
        $btn = $('#calendar-container .prev-month');
        $btn.trigger('click');
        expect($('#calendar-container .month-title').text()).toEqual("December 2011");
      })
      
      afterEach(restore_date_today);
      
    });
  });
});