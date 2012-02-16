describe("Guestlist Widget", function() {
  
  function setup(){
    //setup
    $('body').append("<div id = 'guest'> </div>")
  }
  
  function clean(){
    $('#guest').remove();
  }
  
  it("should not create errors", function(){
    setup();
    $('#guest').VenueDriverFormWidget();
    clean();
  });
  
  

});
