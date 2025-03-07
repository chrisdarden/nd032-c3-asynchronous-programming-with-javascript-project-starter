

// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
let store = {
	track_id: undefined,
	player_id: undefined,
	race_id: undefined,
  }

  const updateStore = (store, newState) => {
	store = Object.assign(store, newState);
  };

// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
	onPageLoad()
	setupClickHandlers()
})

async function onPageLoad() {
	try {
		getTracks()
			.then(tracks => {
				console.log("getting tracks")
				const html = renderTrackCards(tracks)
				renderAt('#tracks', html)

			})

		getRacers()
			.then((racers) => {
				console.log("getting racers")
				const html = renderRacerCars(racers)
				renderAt('#racers', html)
			})
	} catch(error) {
		console.log("Problem getting tracks and racers ::", error.message)
		console.error(error)
	}
}

function setupClickHandlers() {
	document.addEventListener('click', function(event) {

		
		const { target } = event

		

		// Race track form field
		if (target.matches('.card.track')) {
			handleSelectTrack(target)
		}

		// Podracer form field
		if (target.matches('.card.podracer')) {
			handleSelectPodRacer(target)
		}

		// Submit create race form
		if (target.matches('#submit-create-race')) {
			event.preventDefault()
	
			// start race
			handleCreateRace()
		}

		// Handle acceleration click
		if (target.matches('#gas-peddle')) {
			handleAccelerate()
		}

	}, false)
}

async function delay(ms) {
	try {
		return await new Promise(resolve => setTimeout(resolve, ms));
	} catch(error) {
		console.log("an error shouldn't be possible here")
		console.log(error)
	}
}
// ^ PROVIDED CODE ^ DO NOT REMOVE

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {

	// TODO - Get player_id and track_id from the store
	
	let trackID = store.track_id
	console.log(`handleCreateRace funct - store.track_id: ${trackID}`)
	
	let playerID = store.player_id
	console.log(`handleCreateRace funct - store.player_id: ${playerID}`)
	
	if (!store.track_id) {
		alert("Please choose your track");
		return;
	  }
  
	  if (!store.player_id) {
		alert("Please choose a player");
		return;
	  }
  
	
    console.log(`before createRace store value = ${JSON.stringify(store)}`);
	
	// const race = TODO - invoke the API call to create the race, then save the result
	const race = await createRace(trackID, playerID);
    console.log(`race_id is : ${store.race_id}`);
	
	// TODO - update the store with the race id
	// For the API to work properly, the race id should be race id - 1
	// updateStore(store, {race_id: race.ID - 1});
	console.log(`handle CreateRace - store.race_id: ${store.race_id}`)
	
	// render starting UI
	renderAt('#race', renderRaceStartView(race.Track.name))
	
	
	// The race has been created, now start the countdown
	// TODO - call the async function runCountdown
	await runCountdown();

	// TODO - call the async function startRace
	await startRace(store.race_id);
	// TODO - call the async function runRace
	await runRace(store.race_id);
}
//TODO vv

function runRace(raceID) {
    return new Promise((resolve) => {
        // TODO - use Javascript's built in setInterval method to get race info twice a second
        const raceInterval = setInterval(async () => {
            let res = await getRace(raceID);
            /* 
                TODO - if the race info status property is "in-progress", update the leaderboard by calling:
                
                renderAt('#leaderBoard', raceProgress(res.positions))
                */
            if (res.status === 'in-progress') {
                renderAt('#leaderBoard', raceProgress(res.positions));
            }
            /* 
                    TODO - if the race info status property is "finished", run the following:
            
                    clearInterval(raceInterval) // to stop the interval from repeating
                    renderAt('#race', resultsView(res.positions)) // to render the results view
                    reslove(res) // resolve the promise
                */
            if (res.status === 'finished') {
                clearInterval(raceInterval); // to stop the interval from repeating
                renderAt('#race', resultsView(res.positions)); // to render the results view
                resolve(res); // resolve the promise
            }
        }, 500);
    });
    // remember to add error handling for the Promise
}
async function runCountdown() {
	try {
	  // counts down once per second
	  await delay(1000);
	  let timer = 3;
  
	  return new Promise((resolve) => {
		// decrements countdown for user
		let interval = setInterval(() => {
		  document.getElementById("big-numbers").innerHTML = --timer;
		
		  if (timer <= 0) {
			clearInterval(interval);
			resolve(console.log("Completed"));
		  }
		
		}, 1000);
	  });
	} catch (error) {
	  console.log(error);
	}
  }

function handleSelectPodRacer(target) {
	console.log("selected a pod", target.id)

	// remove class selected from all racer options
	const selected = document.querySelector('#racers .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// TODO - save the selected racer to the store
	updateStore(store, {player_id: target.id});

	console.log(`handleSelectPodRacer - store.player_id = ${store.player_id}`)
}

function handleSelectTrack(target) {
	console.log("selected a track", target.id)

	// remove class selected from all track options
	const selected = document.querySelector('#tracks selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')
	
	// TODO - save the selected track id to the store
	updateStore(store, {track_id: target.id});
	console.log(`handleSelectTrack - store.track_id = ${store.track_id}`)
	
}

function handleAccelerate() {
	console.log("accelerate button clicked")
	// TODO - Invoke the API call to accelerate
	accelerate(store.race_id).then(() => console.log("accelerate button clicked")).catch(error => console.log(error));
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
	if (!racers.length) {
		return `
			<h4>Loading Racers...</4>
		`
	}

	const results = racers.map(renderRacerCard).join('')

	return `
		<ul id="racers">
			${results}
		</ul>
	`
}

function renderRacerCard(racer) {
	const { id, driver_name, top_speed, acceleration, handling } = racer

	return `
		<li class="card podracer" id="${id}">
			<h3>${driver_name}</h3>
			<p>Top Speed: ${top_speed}</p>
			<p>Acceleration: ${acceleration}</p>
			<p>Handling: ${handling}</p>
		</li>
	`
}

function renderTrackCards(tracks) {
	if (!tracks.length) {
		return `
			<h4>Loading Tracks...</4>
		`
	}

	const results = tracks.map(renderTrackCard).join('')

	return `
		<ul id="tracks">
			${results}
		</ul>
	`
}

function renderTrackCard(track) {
	const { id, name } = track

	return `
		<li id="${id}" class="card track">
			<h3>${name}</h3>
		</li>
	`
}

function renderCountdown(count) {
	return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`
}

function renderRaceStartView(track, racers) {
	return `
		<header>
			<h1>Race: ${track.name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`
}

function resultsView(positions) {
	positions.sort((a, b) => (a.final_position > b.final_position) ? 1 : -1)

	return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<a href="/race">Start a new race</a>
		</main>
	`
}

function raceProgress(positions) {
    let userPlayer = positions.find((e) => e.id === parseInt(store.player_id));
    userPlayer.driver_name += ' (you)';

    positions = positions.sort((a, b) => (a.segment > b.segment ? -1 : 1));
    let count = 1;

    const results = positions.map((p) => {
        return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`;
    });

    return `
		<main>
			<h3>Leaderboard</h3>
			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`;
}


function renderAt(element, html) {
	const node = document.querySelector(element)

	node.innerHTML = html
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:8000'

function defaultFetchOpts() {
	return {
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin' : SERVER,
		},
	}
}

// TODO - Make a fetch call (with error handling!) to each of the following API endpoints 

function getTracks() {
	return fetch(`${SERVER}/api/tracks`, {
		method: 'GET',
		...defaultFetchOpts(),
	  })
	  .then(response => response.json())
	  //.then(res => console.log(res))
	  .catch(err => console.log(err));
  }
  
  function getRacers() {
	return fetch(`${SERVER}/api/cars`, {
		method: 'GET',
		...defaultFetchOpts(),
	  })
	  .then(response => response.json())
	  //.then(res => console.log(res))
	  .catch(err => console.log(err));
  }
  function createRace(player_id, track_id) {
	console.log("in createRace function")
	player_id = parseInt(player_id);
  	track_id = parseInt(track_id);
    const body = { player_id, track_id };

	console.log(`body: ${JSON.stringify(body)}`)
    return fetch(`${SERVER}/api/races`, {
        ...defaultFetchOpts(),
        method: 'POST',
        dataType: 'jsonp',
        body: JSON.stringify(body),
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
			console.log(`response from createRace is - ${JSON.stringify(res)}`)
			updateStore(store, {race_id: res.ID - 1});
            console.log(`updated store with -1 on race_id: ${store.race_id}`);
			return res;
        })
        .catch((e) => {
            alert(e);
        });
}

function getRace(id) {
	// GET request to `${SERVER}/api/races/${id}`
	return fetch(`${SERVER}/api/races/${id}`)
	.then(data => {
		return data.json();
		}).catch(err => console.log(`Error during fetch of getRace(id): ${err}`))
}

function startRace(id) {
	return fetch(`${SERVER}/api/races/${id}/start`, {
		method: 'POST',
		...defaultFetchOpts(),
	})
	// .then(res => res.json())
	// .catch(err => console.log("Problem with getRace request::", err))
}

function accelerate(id) {

	return fetch(`${SERVER}/api/races/${id}/accelerate`, {
	  method: "POST",
	  ...defaultFetchOpts(),
	}).catch((err) =>
	  console.log("Problem with acceleration request::", err)
	);
   
  }