function make_date_array(year_num,month_num,date_arr){
  result = [];
  if (month_num < 10) month_num = '0'+month_num
  for (var i =0;i<date_arr.length;i++){
    num = date_arr[i];
    result.push(year_num+'/'+month_num+'/'+num);
  }
  return result;
};

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
    date: options.event_date,    //ex 2012/06/01,
    description: options.description || "No Deescription Given",
    event_id: options.id.toString(), //must
    friendly_id: null,
    guestlist_URL: null,
    guestlist_conditions: null,
    guestlist_count: 0,
    home_URL: null,
    id: options.id,
    max_guests_per_guestlist: 20000,
    max_number_of_guests: null,
    myspace_URL: null,
    notes: "here are some notes",
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
    title: options.event_title ,
    updated_at: "2012/02/14 14:59:58 -0400",
    venue_id: "1",
    wiki_name: null
  }
  return json;
};

function generate_events_json(dates){
  number = 1;
  var json = [];
  for (var i =0;i<dates.length;i++){
    this_date = dates[i]
    json.push(make_event_json({event_date:this_date,event_title:"Event "+number,id:number}))
    number++;
  }
  return json;
};

function mock_date_today(date_str){
  var OldDate = Date
  Date.today = function(){
    return new Date(date_str);
  }
};

beforeEach(function() {

});