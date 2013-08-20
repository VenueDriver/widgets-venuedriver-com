// Let the widget know that we're in testing mode.  Mainly for disabling JSONP,
// because it's extremely difficult to mock JSONP requests at the time of writing.
window.noJSONP = true;

describe("Calendar Widget", function() {  
  //cal-test div is in calendar.html fixture
  
  var std_options = { api_type:"account", api_id:1, div_id:'cal-test' };
  beforeEach(function() {
    preloadFixtures('calendar.html')
    $.ajaxMock.on();
    $.ajaxMock.reset();
    loadFixtures('calendar.html');
  });
  
  afterEach(function(){
    $('.clone-me').remove();
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
    
    it("defaults to Monday if no day is specified",function(){
      
      //var calendar = new VenueDriverCalendarWidget(std_options);
      $('#cal-test').AccountCalendar({ account_id:1 })
      expect($('#calendar-container .day-1').text()).toEqual('Monday');
    });
    
    function test_first_day(name){
      $('#cal-test').AccountCalendar({ account_id:1, first_day:name })
      expect($('#calendar-container .day-1').text()).toEqual(name);
    };
    
    function check_first_day_position(position){
      expect($('#calendar-container ' + '.' + position).attr('id')).toEqual('2012-06-01');
    };
     
  });
  
  describe("Displaying events",function(){
    
    beforeEach(function() {
      mock_date_today('2012/06/01');
      json = [];
      event1 = new FakeEvent({ event_title:'Event 1', event_date:'2012/06/04', id:1});
      event2 = new FakeEvent({ event_title:'Event 2', event_date:'2012/06/05', id:2});
      event3 = new FakeEvent({ event_title:'Event 3', event_date:'2012/06/06', id:3});
      
      json.push(make_event_json(event1));
      json.push(make_event_json(event2));
      json.push(make_event_json(event3));

      jQuery.ajaxMock.url('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012', json);
      $('#cal-test').AccountCalendar({account_id:1})
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
    
    describe('Month to month',function(){
      beforeEach(function(){
        mock_date_today('2012/06/01');
        $('#cal-test').AccountCalendar({account_id:1})
      });
      
      afterEach(restore_date_today);
    
      it("goes to the next month, when the 'next month' button is pressed",function(){
        expect($('#calendar-container .month-title').text()).toEqual("June 2012");
        $btn = $('#calendar-container #next-month');
        $btn.trigger('click');
        expect($('#calendar-container .month-title').text()).toEqual("July 2012")
      });
    
      it("goes to the previous month, when the 'previous month' button is pressed",function(){
        expect($('#calendar-container .month-title').text()).toEqual("June 2012");
        $btn = $('#calendar-container #prev-month');
        $btn.trigger('click');
        expect($('#calendar-container .month-title').text()).toEqual("May 2012")
      });
    });
    
    describe('Crossing year boundaries',function(){
      
      it('goes to the next year',function(){
        mock_date_today('2012/12/01');
        $('#cal-test').AccountCalendar({account_id:1});
        expect($('#calendar-container .month-title').text()).toEqual("December 2012");
        $btn = $('#calendar-container #next-month');
        $btn.trigger('click');
        expect($('#calendar-container .month-title').text()).toEqual("January 2013");
      });
      
      it('goes to the previous year',function(){
        mock_date_today('2012/01/01');
        $('#cal-test').AccountCalendar({account_id:1});
        expect($('#calendar-container .month-title').text()).toEqual("January 2012");
        $btn = $('#calendar-container #prev-month');
        $btn.trigger('click');
        expect($('#calendar-container .month-title').text()).toEqual("December 2011");
      })
      
      afterEach(restore_date_today);
    });
  });
  
  describe('API Requests',function(){
    afterEach(restore_date_today);
    
    it('makes the correct request using account id',function(){
      mock_date_today('2012/06/01');
      $('#cal-test').AccountCalendar({account_id:52});
      expect(window.my_calendar.t_api_url()).toEqual('http://www.venuedriver.com/api/accounts/52/events/calendar_month?month=6&year=2012');
    });
    
    it('makes the correct request using venue id',function(){
      mock_date_today('2012/06/01');
      $('#cal-test').VenueCalendar({venue_id:33});
      expect(window.my_calendar.t_api_url()).toEqual('http://www.venuedriver.com/api/venues/33/events/calendar_month?month=6&year=2012');
    });
    
    it('updates the request string when the month changes',function(){
      mock_date_today('2012/06/01');
      $('#cal-test').AccountCalendar({account_id:1});
      var cal = window.my_calendar;
      expect(cal.t_api_url()).toEqual('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012');
      $('#calendar-container #next-month').trigger('click');
      expect(cal.t_api_url()).toEqual('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=7&year=2012');
      $('#calendar-container #prev-month').trigger('click');
      expect(cal.t_api_url()).toEqual('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012');
      $('#calendar-container #prev-month').trigger('click');
      expect(cal.t_api_url()).toEqual('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=5&year=2012');
    });
    
  });
  
  it("Creates its own table template from a javascript multiline string but only if the template doesnt exist", function(){
    expect($('.clone-me').length).toEqual(0);
    $('#cal-test').AccountCalendar({account_id:1});
    expect($('.clone-me').length).toEqual(1);
    window.my_calendar.refresh();//construct output again, should not create another table template
    expect($('.clone-me').length).toEqual(1);
  });

  describe('Displays event info when you select an event', function(){

    it('makes event info div visible when you select an event', function(){
      mock_date_today('2012/06/01');

      jQuery.ajaxMock.url('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012',
        [make_event_json(new FakeEvent({
          event_title: 'Event 1',
          event_date: '2012/06/04',
          id:1
        }))]);

      $('#cal-test').AccountCalendar({ account_id:1 })

      expect(jQuery('#side-panel').is(':hidden')).toBe(true);

      // Click on the test event.
      jQuery('#calendar-container #2012-06-04 a').trigger(jQuery.Event('click'));

      expect(jQuery('#side-panel').is(':visible')).toBe(true);
    });

    it('sets the event information in the event information div', function(){
      mock_date_today('2012/06/01');

      jQuery.ajaxMock.url('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012',
        [make_event_json(new FakeEvent({
          event_title: 'Event 1',
          event_date: '2012/06/04',
          id:1
        }))]);

      $('#cal-test').AccountCalendar({ account_id:1 })

      // Click on the test event.
      jQuery('#calendar-container #2012-06-04 a').trigger(jQuery.Event('click'));

      expect(jQuery('#side-panel #sp-event-title').html()).toEqual("Event 1");
    });

    it('inserts event info into the target div when an event is selected', function(){
      mock_date_today('2012/06/01');

      jQuery.ajaxMock.url('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012',
        [make_event_json(new FakeEvent({
          event_title: 'Event 1',
          event_date: '2012/06/04',
          id:1
        }))]);

      $('#cal-test').AccountCalendar({ account_id:1 })

      // Click on the test event.
      jQuery('#calendar-container #2012-06-04 a').trigger(jQuery.Event('click'));

      // Check to make sure that it shows in the side panel.
      expect(jQuery('#side-panel #sp-event-title').html()).toEqual("Event 1");
    });

    it('displays the action buttons when they are valid', function(){
      mock_date_today('2012/06/01');

      jQuery.ajaxMock.url('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012',
        [make_event_json(new FakeEvent({
          event_title: 'Event 1',
          event_date: '2012/06/04',
          public_guestlists: true,
          public_reservations: true,
          active: true,
          id:1
        }))]);

      $('#cal-test').AccountCalendar({ account_id:1 })

      jQuery('#calendar-container #2012-06-04 a').trigger(jQuery.Event('click'));

      expect(jQuery('#side-panel #sp-buy-tickets').is(':visible')).toBe(true);
      expect(jQuery('#side-panel #sp-join-guestlist').is(':visible')).toBe(true);
      expect(jQuery('#side-panel #sp-vip-reservation').is(':visible')).toBe(true);
    });

    it('hides the action buttons when they are not valid', function(){
      mock_date_today('2012/06/01');

      jQuery.ajaxMock.url('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012',
        [make_event_json(new FakeEvent({
          event_title: 'Event 1',
          event_date: '2012/06/04',
          public_guestlists: false,
          public_reservations: false,
          active: false,
          id:1
        }))]);

      $('#cal-test').AccountCalendar({ account_id:1 });

      jQuery('#calendar-container #2012-06-04 a').trigger(jQuery.Event('click'));

      expect(jQuery('#side-panel #sp-join-guestlist').is(':hidden')).toBe(true);
      expect(jQuery('#side-panel #sp-vip-reservation').is(':hidden')).toBe(true);
      expect(jQuery('#side-panel #sp-buy-tickets').is(':hidden')).toBe(true);
    });

    it('hides the action buttons when the event is closed', function(){
      mock_date_today('2012/06/04');

      jQuery.ajaxMock.url('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012',
        [make_event_json(new FakeEvent({
          event_title: 'Event 1',
          event_date: '2012/06/01', // This puts the test event in the past.
          public_guestlists: true,
          public_reservations: true,
          active: true,
          id:1
        }))]);

      $('#cal-test').AccountCalendar({ account_id:1 });

      jQuery('#calendar-container #2012-06-01 a').trigger(jQuery.Event('click'));

      expect(jQuery('#side-panel #sp-event-closed').is(':hidden')).toBe(false);
      expect(jQuery('#side-panel #sp-join-guestlist').is(':hidden')).toBe(true);
      expect(jQuery('#side-panel #sp-vip-reservation').is(':hidden')).toBe(true);
      expect(jQuery('#side-panel #sp-buy-tickets').is(':hidden')).toBe(true);
    });

    it('sets the button action for guest lists', function(){
      mock_date_today('2012/06/01');

      jQuery.ajaxMock.url('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012',
        [make_event_json(new FakeEvent({
          event_title: 'WORKING',
          event_date: '2012/06/04',
          public_guestlists: true,
          public_reservations: false,
          active: false,
          tickets_URL: 'http://google.com',
          id:1
        }))]);

      $('#cal-test').AccountCalendar({
        account_id:1,
        friendly_id:'someid'
      });

      jQuery('#calendar-container #2012-06-04 a').trigger(jQuery.Event('click'));

      expect(jQuery('#side-panel #sp-join-guestlist').is(':hidden')).toBe(false);

      expect(jQuery('#side-panel #sp-join-guestlist a').attr('href')).
        toBe('http://www.venuedriver.com/someid/apps/web/guestlist?event_id=1');
    });

    it('sets the button action for reservations', function(){
      mock_date_today('2012/06/01');

      jQuery.ajaxMock.url('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012',
        [make_event_json(new FakeEvent({
          event_title: 'WORKING',
          event_date: '2012/06/04',
          public_guestlists: false,
          public_reservations: true,
          active: false,
          tickets_URL: 'http://google.com',
          id:1
        }))]);

      $('#cal-test').AccountCalendar({
        account_id:1,
        friendly_id:'someid'
      });

      jQuery('#calendar-container #2012-06-04 a').trigger(jQuery.Event('click'));

      expect(jQuery('#side-panel #sp-vip-reservation').is(':hidden')).toBe(false);

      expect(jQuery('#side-panel #sp-vip-reservation a').attr('href')).
        toBe('http://www.venuedriver.com/someid/apps/web/reservation?event_id=1');
    });

    it('sets the button action for ticket sales', function(){
      mock_date_today('2012/06/01');

      jQuery.ajaxMock.url('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012',
        [make_event_json(new FakeEvent({
          event_title: 'WORKING',
          event_date: '2012/06/04',
          public_guestlists: false,
          public_reservations: false,
          active: true,
          id:1
        }))]);

      $('#cal-test').AccountCalendar({
        account_id:1,
        friendly_id: 'someid'
      });

      jQuery('#calendar-container #2012-06-04 a').trigger(jQuery.Event('click'));

      expect(jQuery('#side-panel #sp-buy-tickets').is(':hidden')).toBe(false);

      expect(jQuery('#side-panel #sp-buy-tickets a').attr('href')).
        toBe('http://www.ticketdriver.com/someid/buy/tickets/event/1');
    });

    it('uses an external tickets_URL link when one is set', function(){
      mock_date_today('2012/06/01');

      jQuery.ajaxMock.url('http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012',
        [make_event_json(new FakeEvent({
          event_title: 'WORKING',
          event_date: '2012/06/04',
          public_guestlists: false,
          public_reservations: false,
          active: true,
          tickets_URL: 'http://google.com',
          id:1
        }))]);

      $('#cal-test').AccountCalendar({
        account_id:1,
        friendly_id: 'someid'
      });

      jQuery('#calendar-container #2012-06-04 a').trigger(jQuery.Event('click'));

      expect(jQuery('#side-panel #sp-buy-tickets').is(':hidden')).toBe(false);

      expect(jQuery('#side-panel #sp-buy-tickets a').attr('href')).
        toBe('http://google.com');
    });

    it('sets the flyer image url', function(){
      mock_date_today('2012/06/01');

      jQuery.ajaxMock.url('http://www.venuedriver.com/api/venues/1/events/calendar_month?month=6&year=2012',
        [make_event_json(new FakeEvent({
          event_title: 'WORKING',
          event_date: '2012/06/04',
          public_guestlists: true,
          public_reservations: false,
          active: false,
          tickets_URL: 'http://google.com',
          id:1,
          flyer_url: '/missing.png'
        }))]);

      $('#cal-test').VenueCalendar({
        venue_id:1,
        friendly_id:'someid'
      });

      jQuery('#calendar-container #2012-06-04 a').trigger(jQuery.Event('click'));

      expect(jQuery('#side-panel #sp-flyer').is(':hidden')).toBe(false);

      expect(jQuery('#side-panel #sp-flyer img').attr('src')).
        toBe('/missing.png');
    });


    it('Show the event of the hashbang', function(){
      mock_date_today('2012/06/01');

      jQuery.ajaxMock.url('http://www.venuedriver.com/api/venues/1/events/calendar_month?month=6&year=2012',
        [make_event_json(new FakeEvent({
          event_title: 'WORKING',
          event_date: '2012/06/04',
          public_guestlists: true,
          public_reservations: false,
          active: false,
          tickets_URL: 'http://google.com',
          id:3,
          flyer_url: '/missing.png'
        })),
        make_event_json(new FakeEvent({
          event_title: 'WORKING',
          event_date: '2012/06/05',
          public_guestlists: true,
          public_reservations: false,
          active: false,
          tickets_URL: 'http://google.com',
          id:4,
          flyer_url: '/missing.png'
        }))]);

      $('#cal-test').VenueCalendar({
        venue_id:1,
        friendly_id:'someid'
      });

      jQuery('#calendar-container #2012-06-04 a').trigger(jQuery.Event('click'));
      expect(window.location.hash).toBe('#!/events/3');

      jQuery('#calendar-container #2012-06-05 a').trigger(jQuery.Event('click'));
      expect(window.location.hash).toBe('#!/events/4');
    });

  });

});
