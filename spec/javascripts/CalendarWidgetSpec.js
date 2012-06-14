
describe("Calendar Widget", function() {
  function setup(){
    loadFixtures('calendar.html');
    window.cal = new VenueDriverCalendarEventsWidget({api_type:"account",api_id:1,div_id:'cal-test',first_day:'Monday'});  
  };
  
  beforeEach(function() {
    preloadFixtures('calendar.html')
    $.ajaxMock.on();
    str = 'http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012&token=test';
    $.ajaxMock.url(str, generate_events_json(make_date_array(2012,6,['04','07','08','12','16'])));
    setup();
  });
  
  it("should test", function(){
    debugger;
    expect(true).toBe(true);
  });
  
});