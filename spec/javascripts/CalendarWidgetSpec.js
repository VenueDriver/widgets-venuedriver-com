var _table_template = " \
<table border='1' class='clone-me' style='display:none'>\
  <tr class='calendar-title-row'>\
    <th class='title-cell' colspan='7'>\
      <span class='calendar-title title'>Events Calendar</span>\
      <span class ='navigation-group'>\
        <button class='prev-month change-month' >Previous Month</button>\
        <span class='month-title title'>Month Title</span>\
        <button class='next-month change-month'>Next Month</button>\
      </span>\
    </th>\
  </tr>\
  \
  <tr class ='day-title-row'>\
    <th class='header-1'>h1</th>\
    <th class='header-2'>h2</th>\
    <th class='header-3'>h3</th>\
    <th class='header-4'>h4</th>\
    <th class='header-5'>h5</th>\
    <th class='header-6'>h6</th>\
    <th class='header-7'>h7</th>\
  </tr>\
  \
  <tr class='row1'>\
    <td class='rc11'>rc11</td>\
    <td class='rc12'>rc12</td>\
    <td class='rc13'>rc13</td>\
    <td class='rc14'>rc14</td>\
    <td class='rc15'>rc15</td>\
    <td class='rc16'>rc16</td>\
    <td class='rc17'>rc17</td>\
  </tr>\
  <tr class='row2'>\
    <td class='rc21'>rc21</td>\
    <td class='rc22'>rc22</td>\
    <td class='rc23'>rc23</td>\
    <td class='rc24'>rc24</td>\
    <td class='rc25'>rc25</td>\
    <td class='rc26'>rc26</td>\
    <td class='rc27'>rc27</td>\
  </tr>\
  <tr class='row3'>\
    <td class='rc31'>rc31</td>\
    <td class='rc32'>rc32</td>\
    <td class='rc33'>rc33</td>\
    <td class='rc34'>rc34</td>\
    <td class='rc35'>rc35</td>\
    <td class='rc36'>rc36</td>\
    <td class='rc37'>rc37</td>\
  </tr>\
  <tr class='row4'>\
    <td class='rc41'>rc41</td>\
    <td class='rc42'>rc42</td>\
    <td class='rc43'>rc43</td>\
    <td class='rc44'>rc44</td>\
    <td class='rc45'>rc45</td>\
    <td class='rc46'>rc46</td>\
    <td class='rc47'>rc47</td>\
  </tr>\
  <tr class='row5'>\
    <td class='rc51'>rc51</td>\
    <td class='rc52'>rc52</td>\
    <td class='rc53'>rc53</td>\
    <td class='rc54'>rc54</td>\
    <td class='rc55'>rc55</td>\
    <td class='rc56'>rc56</td>\
    <td class='rc57'>rc57</td>\
  </tr>\
  <tr class='extra-row'>\
    <td class='rc61'>rc61</td>\
    <td class='rc62'>rc62</td>\
    <td class='rc63'>rc63</td>\
    <td class='rc64'>rc64</td>\
    <td class='rc65'>rc65</td>\
    <td class='rc66'>rc66</td>\
    <td class='rc67'>rc67</td>\
  </tr>\
  \
</table>\
\
"
describe("Calendar Widget", function() {
  var request;
  var TestResponses = {
        search: {
          success: {
            status: 200,
            responseText: '{"response":{"groups":[{"type":"nearby","name":"Nearby","items":[{"id":"4bb9fd9f3db7b7138dbd229a","name":"Pivotal Labs","contact":{"twitter":"pivotalboulder"},"location":{"address":"1701 Pearl St.","crossStreet":"at 17th St.","city":"Boulder","state":"CO","lat":40.019461,"lng":-105.273296,"distance":0},"categories":[{"id":"4bf58dd8d48988d124941735","name":"Office","pluralName":"Offices","icon":"https://foursquare.com/img/categories/building/default.png","parents":["Homes, Work, Others"],"primary":true}],"verified":false,"stats":{"checkinsCount":223,"usersCount":62},"hereNow":{"count":0}},{"id":"4af2eccbf964a5203ae921e3","name":"Laughing Goat Café","contact":{},"location":{"address":"1709 Pearl St.","crossStreet":"btw 16th & 17th","city":"Boulder","state":"CO","postalCode":"80302","country":"USA","lat":40.019321,"lng":-105.27311982,"distance":21},"categories":[{"id":"4bf58dd8d48988d1e0931735","name":"Coffee Shop","pluralName":"Coffee Shops","icon":"https://foursquare.com/img/categories/food/coffeeshop.png","parents":["Food"],"primary":true},{"id":"4bf58dd8d48988d1a7941735","name":"College Library","pluralName":"College Libraries","icon":"https://foursquare.com/img/categories/education/default.png","parents":["Colleges & Universities"]}],"verified":false,"stats":{"checkinsCount":1314,"usersCount":517},"hereNow":{"count":0}},{"id":"4ca777a597c8a1cdf7bc7aa5","name":"Ted\'s Montana Grill","contact":{"phone":"3034495546","formattedPhone":"(303) 449-5546","twitter":"TedMontanaGrill"},"location":{"address":"1701 Pearl St.","crossStreet":"17th and Pearl","city":"Boulder","state":"CO","postalCode":"80302","country":"USA","lat":40.019376,"lng":-105.273311,"distance":9},"categories":[{"id":"4bf58dd8d48988d1cc941735","name":"Steakhouse","pluralName":"Steakhouses","icon":"https://foursquare.com/img/categories/food/steakhouse.png","parents":["Food"],"primary":true}],"verified":true,"stats":{"checkinsCount":197,"usersCount":150},"url":"http://www.tedsmontanagrill.com/","hereNow":{"count":0}},{"id":"4d3cac5a8edf3704e894b2a5","name":"Pizzeria Locale","contact":{},"location":{"address":"1730 Pearl St","city":"Boulder","state":"CO","postalCode":"80302","country":"USA","lat":40.0193746,"lng":-105.2726744,"distance":53},"categories":[{"id":"4bf58dd8d48988d1ca941735","name":"Pizza Place","pluralName":"Pizza Places","icon":"https://foursquare.com/img/categories/food/pizza.png","parents":["Food"],"primary":true}],"verified":false,"stats":{"checkinsCount":511,"usersCount":338},"hereNow":{"count":2}},{"id":"4d012cd17c56370462a6b4f0","name":"The Pinyon","contact":{},"location":{"address":"1710 Pearl St.","city":"Boulder","state":"CO","country":"USA","lat":40.019219,"lng":-105.2730563,"distance":33},"categories":[{"id":"4bf58dd8d48988d14e941735","name":"American Restaurant","pluralName":"American Restaurants","icon":"https://foursquare.com/img/categories/food/default.png","parents":["Food"],"primary":true}],"verified":true,"stats":{"checkinsCount":163,"usersCount":98},"hereNow":{"count":1}}]}]}'
          }
        }
      };
  
  function setup(){
    //setup
    //$('body').append("<div<div id='cal-test'> </div>");
    //$('body').append(_table_template);
    loadFixtures('calendar.html');
    var cal = new VenueDriverCalendarEventsWidget({api_type:"account",api_id:1,div_id:'cal-test',first_day:'Monday'})
    
  };
  
  beforeEach(function() {
    setup();
  });
  
  function clean(){

  }
  
  it("should test", function(){
    
  });
  
});