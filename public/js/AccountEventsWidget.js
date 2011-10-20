var VenueDriverAccountEventsWidget;
(function() {
  VenueDriverAccountEventsWidget = (function() {
    function VenueDriverAccountEventsWidget() {}

  	options = {
      div_id: "body",
      autostart: true
  	}
  	
    try{
  	  params = {
  		  api_token: VenueDriverWidgetConfig.api_token,
        account: VenueDriverWidgetConfig.account,
        div_id: VenueDriverWidgetConfig.div_id,
        autostart: VenueDriverWidgetConfig.autostart
  	  };
  	}catch(e){
  	  params = {}
  	}

  	jQuery.extend(options, params);
  	
    $(function initialize(){
      VenueDriverAccountEventsWidget.api_token = options.api_token;
      VenueDriverAccountEventsWidget.account = options.account;
      VenueDriverAccountEventsWidget.host = "venuedriver.com";
      options.div_id = "#" + options.div_id
      options.div_id = options.div_id.replace("#body", "body");
      VenueDriverAccountEventsWidget.api_url = "http://" + VenueDriverAccountEventsWidget.host + "/api/accounts/" + VenueDriverAccountEventsWidget.account + "/all_events?token=" + VenueDriverAccountEventsWidget.api_token + "&callback=?";
      VenueDriverAccountEventsWidget.prepare_table();
    });
    
    VenueDriverAccountEventsWidget.prototype.start = function(){
      if(options.autostart == true){
        $.getJSON(VenueDriverAccountEventsWidget.api_url, function(data) { 
          VenueDriverAccountEventsWidget.prototype.fill_table(data);
        });
      }
    };
    
    VenueDriverAccountEventsWidget.prototype.fill_table = function(data) {
      $.each(data, function(i, item) {
        $.each(item.events, function(i, event){
          var table_data = "<tr class='eventitem_row'><td width='92' class='eventitem_text column1'>" + event.date + "</td>  <td width='136' class='eventitem_text column2'>" + item.venue.city + ", " + item.venue.state +"</td>  <td width='130' class='eventitem_text column3'>" + item.venue.title + "</td>  <td class='eventitem_text column4'>" + event.title + "</td>  <td class='column5' align='right'><a href='" + urlBuyBtton(event, item)  + "' target='_blank'>Buy</a></td></tr>";
          $('#venueDriverAccountEventsWidgetMainTable tbody').append(table_data);
        });
      });
      toggle_loading();
    };
    
    VenueDriverAccountEventsWidget.prepare_table = function(){
      $(options.div_id).append("<div id='loading'><img src='http://widgets.venuedriver.com/images/ajax-loader.gif'/></div>")
      $(options.div_id).append("<table id='venueDriverAccountEventsWidgetMainTable'><thead><tr></tr></thead><tbody></tbody></table>");
      $(options.div_id + " tr").append(
              "<th class='eventlist_columnlabels' width='10%'>Date</th>" +
              "<th class='eventlist_columnlabels' width='20%'>Location</th>" +
              "<th class='eventlist_columnlabels' width='30%'>Venue</th>" +
              "<th class='eventlist_columnlabels' width='30%'>Event</th>" +
              "<th class='eventlist_columnlabels' width='10%'></th>"
      );
    }
    
    function toggle_loading(){
      $("#loading").toggle();
    }
    
    function urlBuyBtton(event, venue){
      if (event.tickets_URL == null){
        return "https://ticketdriver.com/" + venue.friendly_id + "/buy/tickets/event/" + event.id
      }else{
        return event.tickets_URL;
      }
    }
    
    return VenueDriverAccountEventsWidget;
  })();
  $(function() {
    try{
      var accountEventsWidget = new VenueDriverAccountEventsWidget;
      return accountEventsWidget.start();
    }catch(e){
      console.log(e);
    }
  });
}).call(this);
