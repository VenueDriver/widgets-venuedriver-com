
function make_event_json(options){
  //specify date,id,title,
  json = {
    VIP_URL: null,
    active: null,
    ages: null,
    canceled: false,
    close: null,
    closed_message: null,
    cover: null,
    created_at: "2012/01/02 14:59:58 -0400",
    date: options.date,    //ex 2012/06/01,
    description: options.description || "No Deescription Given",
    event_id: options.id.to_string, //must
    friendly_id: null,
    guestlist_URL: null,
    guestlist_conditions: null,
    guestlist_count: 0,
    home_URL: null,
    id: options.id,
    max_guests_per_guestlist: 20000,
    max_number_of_guests: null,
    myspace_URL: null,
    notes: null,
    open: "2000/01/01 00:20:12 -0500",
    parent_id: null,
    pass_codes: "",
    public_guestlists: true,
    repeat_day: null,
    reservation_count: 0,
    show_in_calendars: true,
    template: null,
    template_active: null,
    tickets_URL: null,
    tickets_sold_count: 0,
    time: null,
    title: options.description || "No Title given",
    updated_at: "2012/06/13 14:59:58 -0400",
    venue_id: "1",
    wiki_name: null
  }
  return json;
}


beforeEach(function() {

});