// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


(function() {
  'use strict';

  var app = {
    isLoading: true,
    visibleCards: {},
    users: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container'),
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.getElementById('butRefresh').addEventListener('click', function() {
    // Refresh all of the forecasts
    app.updateUsers();
  });

  /*document.getElementById('butAdd').addEventListener('click', function() {
    // Open/show the add new city dialog
    app.toggleAddDialog(true);
  });*/

  document.getElementById('butAddCity').addEventListener('click', function() {
    // Add the newly selected city
    var select = document.getElementById('selectCityToAdd');
    var selected = select.options[select.selectedIndex];
    var user_id = selected.value;
    var label = selected.textContent;
    if (!app.users) {
      app.users = [];
    }
    app.getUser(user_id, label);
    app.users.push({user_id: user_id, label: label});
    app.saveusers();
    app.toggleAddDialog(false);
  });

  document.getElementById('butAddCancel').addEventListener('click', function() {
    // Close the add new city dialog
    app.toggleAddDialog(false);
  });


  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Toggles the visibility of the add new city dialog.
  app.toggleAddDialog = function(visible) {
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };

  // Updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateUser = function(data) {
    //var dataLastUpdated = new Date(data.created);
	
    var card = app.visibleCards[data.user_id];
    if (!card) {
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.querySelector('.name').textContent = data.name;
      card.removeAttribute('hidden');
      app.container.appendChild(card);
      app.visibleCards[data.user_id] = card;
    }
	/*
    // Verifies the data provide is newer than what's already visible
    // on the card, if it's not bail, if it is, continue and update the
    // time saved in the card
    var cardLastUpdatedElem = card.querySelector('.card-last-updated');
    var cardLastUpdated = cardLastUpdatedElem.textContent;
    if (cardLastUpdated) {
      cardLastUpdated = new Date(cardLastUpdated);
      // Bail if the card has more recent data then the data
      if (dataLastUpdated.getTime() < cardLastUpdated.getTime()) {
        return;
      }
    }
    cardLastUpdatedElem.textContent = data.created;*/
    
    //card.querySelector('.current .icon').classList.add(app.getIconClass(current.code));
    card.querySelector('.current .icon').classList.add('user'+data.user_id);
	var status = data.status.toUpperCase();
	card.querySelector('.current .status .value').textContent = status;
	var date = parseDate(data.last_swipe.substring(0,10));
	var time = parseTime(data.last_swipe.substring(11,16));
	var dateStr = time + ' ' + date;
    card.querySelector('.current .last_swipe').textContent = dateStr;

    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };
  
  function parseDate(dateStr){
	  var year = dateStr.substring(0,4);
	  var month = dateStr.substring(5,7);
	  var day = dateStr.substring(8,10);
	  return month + '/' + day + '/' + year
  };
  
  function parseTime(timeStr){
	  var hour = timeStr.substring(0,2);
	  var minute = timeStr.substring(3,5);
    var time;
    hour = parseInt(hour) + 3;
	  if(hour==12){
		  time = hour + ':' + minute + 'pm';
	  }else if(hour==24){
		  time = '12:' + minute + 'am';
	  }else if(hour>12){
		  hour-=12;
		  time = hour<10 ?'0' + hour + ':' + minute + 'pm' : hour + ':' + minute + 'pm';
	  }else{
		  time = hour + ':' + minute + 'am';
	  }
	  return time;
  };


  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  /*
   * Gets a forecast for a specific city and updates the card with the data.
   * getUser() first checks if the weather data is in the cache. If so,
   * then it gets that data and populates the card with the cached data.
   * Then, getUser() goes to the network for fresh data. If the network
   * request goes through, then the card gets updated a second time with the
   * freshest data.
   */
  app.getUser = function(user_id, name) {
    
	/*
	//cache logic 
    if ('caches' in window) {
      /*
       * Check if the service worker has already cached this city's weather
       * data. If the service worker has the data, then display the cached
       * data while the app fetches the latest data.
       *
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function updateFromCache(json) {
            var results = json.query.results;
            results.key = key;
            results.label = label;
            results.created = json.query.created;
            app.updateUser(results);
          });
        }
      });
    }
	*/
	/*
    // Fetch the latest data.
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          var results = response.query.results;
          results.user_id = user_id;
          results.label = label;
          results.created = response.query.created;
          app.updateUser(results);
        }
      } else {
        // Return the initial weather forecast since no data is available.
        app.updateUser(testUser);
      }
    };
    request.open('GET', url);
    request.send();*/
	$.ajax({
		type: "POST",
		url: 'users_read.php',
		data: {action: pullOne, user_id: user_id},
		success:function(response){
			console.log(response);
		}
	
	});
	
  };

  // Iterate all of the cards and attempt to get the latest forecast data
  app.updateUsers = function() {
    /*var keys = Object.keys(app.visibleCards);
    keys.forEach(function(key) {
      app.getUser(key);
    });*/
	  app.loadAll();
  };

  // TODO add saveusers function here
  // Save list of cities to localStorage.
  app.saveusers = function() {
    var users = JSON.stringify(app.users);
    localStorage.users = users;
  };
  
  app.loadAll = function(){
	  app.spinner.setAttribute('hidden', false);
	  $.ajax({
		type: "POST",
		url: 'http://makeohio2018.kevinbartchlett.com/users_read.php',
		data: {action: 'pullAll'},
		success:function(response){
			var responseJSON = JSON.parse(response);
			for(var i=0;i<responseJSON.length;i++){
				app.updateUser(responseJSON[i]);
			}
			setTimeout(app.spinner.setAttribute('hidden', true),1000);
			
		},
		error: function(xhr){
            console.log("An error occured: " + xhr.status + " " + xhr.statusText);
        }
	});
  }

	

  /*
   * Fake weather data that is presented when the user first uses the app,
   * or when the user has not saved any cities. See startup code for more
   * discussion.
   */
  var testUser = {
    user_id: '123',
	rfid: '2459115',
    name: 'Testy McUserson',
    status: 'home',
	home_time: 12.6,
	away_time: 11.4,
	last_swipe: '2018-03-03 12:00:00'
  };
  
  $(document).ready(function(){
	  app.loadAll();
  });
  
  
  
  //app.updateUser(testUser);
	
  /************************************************************************
   *
   * Code required to start the app
   *
   * NOTE: To simplify this codelab, we've used localStorage.
   *   localStorage is a synchronous API and has serious performance
   *   implications. It should not be used in production applications!
   *   Instead, check out IDB (https://www.npmjs.com/package/idb) or
   *   SimpleDB (https://gist.github.com/inexorabletash/c8069c042b734519680c)
   ************************************************************************/
/*
  // TODO add startup code here
  app.users = localStorage.users;
  if (app.users) {
    app.users = JSON.parse(app.users);
    app.users.forEach(function(user) {
      app.getUser(user.user_id, user.name);
    });
  } else {
    /* The user is using the app for the first time, or the user has not
     * saved any cities, so show the user some fake data. A real app in this
     * scenario could guess the user's location via IP lookup and then inject
     * that data into the page.
     *
    app.updateUser(testUser);
    app.users = [
      {user_id: testUser.user_id, label: testUser.label}
    ];
    app.saveusers();
  }

  // TODO add service worker code here
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }
  
  */
})();
