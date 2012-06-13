

json_test = []
json_test.push(make_event_json({date:"2012/06/02",title:"The Only Event",id:4}))
describe("Calendar Widget", function() {
  function setup(){
    loadFixtures('calendar.html');
    var cal = new VenueDriverCalendarEventsWidget({api_type:"account",api_id:1,div_id:'cal-test',first_day:'Monday'});  
  };
  
  beforeEach(function() {
    preloadFixtures('calendar.html')
    $.ajaxMock.on();
    str = 'http://www.venuedriver.com/api/accounts/1/events/calendar_month?month=6&year=2012&token=test';
    console.log('str='+str);
    $.ajaxMock.url(str, json_test);
    setup();
  });
  
  it("should test", function(){
    debugger;
    expect(true).toBe(true);
  });
  
});