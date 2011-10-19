var VenueDriverAccountWidget;
(function() {
  VenueDriverAccountWidget = (function() {
    function VenueDriverAccountWidget() {}

  	options = {
  		api_token: "NVJEZ3T8A861Q2",
      account: "93",  
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
      VenueDriverAccountWidget.api_token = options.api_token;
      VenueDriverAccountWidget.account = options.account;
      VenueDriverAccountWidget.host = "venuedriver.com";
      options.div_id = "#" + options.div_id
      options.div_id = options.div_id.replace("#body", "body");
      VenueDriverAccountWidget.api_url = "http://" + VenueDriverAccountWidget.host + "/api/accounts/" + VenueDriverAccountWidget.account + "/all_events?token=" + VenueDriverAccountWidget.api_token + "&callback=?";
      VenueDriverAccountWidget.prepare_table();
    });
    
    VenueDriverAccountWidget.prototype.start = function(){
      if(options.autostart == true){
        $.getJSON(VenueDriverAccountWidget.api_url, function(data) { 
          VenueDriverAccountWidget.prototype.fill_table(data);
        });
      }
    };
    
    VenueDriverAccountWidget.prototype.fill_table = function(data) {
      $.each(data, function(i, item) {
        $.each(item.events, function(i, event){
          var table_data = "<tr class='eventitem_row'><td width='92' class='eventitem_text column1'>" + event.date + "</td>  <td width='136' class='eventitem_text column2'>" + item.venue.city + ", " + item.venue.state +"</td>  <td width='130' class='eventitem_text column3'>" + item.venue.title + "</td>  <td class='eventitem_text column4'>" + event.title + "</td>  <td class='column5' align='right'><a href='" + urlBuyBtton(event, item)  + "' target='_blank'>Buy</a></td></tr>";
          $('#venueWidgetMainTable tbody').append(table_data);
        });
      });
      toggle_loading();
    };
    
    VenueDriverAccountWidget.prepare_table = function(){
      $(options.div_id).append("<div id='loading'><img src='http://github.com/Bakedweb/venue_widget/raw/master/public/images/ajax-loader.gif'/></div>")
      $(options.div_id).append("<table id='venueWidgetMainTable'><thead><tr></tr></thead><tbody></tbody></table>");
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
  
    
    return VenueDriverAccountWidget;
  })();
  $(function() {
    try{
      var accountWidget = new VenueDriverAccountWidget;
      return accountWidget.start();
    }catch(e){
      console.log(e);
    }
  });
}).call(this);
