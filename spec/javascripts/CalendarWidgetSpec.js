describe("Calendar Widget", function() {  
  beforeEach(function() {
    preloadFixtures('calendar.html')
    $.ajaxMock.on();
    loadFixtures('calendar.html');
    mock_date_today('2012/06/01')
  });
  
  describe("The first day of The calendar grid can be set to any day",function(){
    
    beforeEach(function() {
      std_options = {api_type:"account",api_id:1,div_id:'cal-test'}
    });
    
    it("Can be Monday", function(){
      test_first_day('Monday');
    });
    
    it("Can be Tuesday", function(){
      test_first_day('Tuesday');
    });
    
    it("Can be Wednesday", function(){
      test_first_day('Wednesday');
    });
    
    it("Can be Thursday", function(){
      test_first_day('Thursday');
    });
    
    it("Can be Friday", function(){
      test_first_day('Friday');
    });
    
    it("Can be Saturday", function(){
      test_first_day('Saturday');
    });
    
    it("Can be Sunday", function(){
      test_first_day('Sunday');
    });
    
    function test_first_day(name){
      var options = $().extend(std_options,{first_day:name})
      var calendar = new VenueDriverCalendarEventsWidget(options);
      expect($('#calendar-container .day-1').text()).toEqual(name);
    };
     
  });
  
  describe("It shows events in the correct position in the calendar",function(){
    
    
    
  });
  
  it('should test',function(){
    debugger;
  });
  
});