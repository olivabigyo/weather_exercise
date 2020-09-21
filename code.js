'use strict';

// console.log('hello');

// const btn = document.querySelector('form button');
const input = document.querySelector('form input');
const tableCells = document.querySelectorAll('.cell');

// ez a ketto ugyanaz csak mashogy mukodik benne  a this
// document.querySelector('form button').addEventListener('click', ()=> {})      
// document.querySelector('form button').addEventListener('click', function() {})

const requestCorsAnywhere = async (url) => {
    const response = await fetch(`http://vidra.nilcons.com:24455/${url}`,
        { headers: { 'X-Requested-Misi': 'en' } }
    );
    console.log(response);
    if (!response.ok) {
        throw Error(`Fetch failed: ${response.status}`);
    }
    return response.json();
};

function weatherIcon(state_abbr) {
    return `https://www.metaweather.com/static/img/weather/${state_abbr}.svg`;
}


document.querySelector('form button').addEventListener('click', async (event) => {
    event.preventDefault();
    const location = input.value.trim();
    console.log(location);

    for (const cell of tableCells) {
        cell.innerHTML = '';
    }
    const places = await requestCorsAnywhere(`https://www.metaweather.com/api/location/search/?query=${location}`);
    console.log("data", places);

    if (!places || places.length < 1) {
        console.error('No result');
        return;
    }
    const woeid = places[0].woeid;
    const weather = await requestCorsAnywhere(`https://www.metaweather.com/api/location/${woeid}/`);
    console.log('weather: ', weather);
    weather.consolidated_weather.forEach((day, i) => {
        const cell = tableCells[i];
        if (!cell) return;
        cell.innerHTML = `<img src="${weatherIcon(day.weather_state_abbr)}"><br> ${day.max_temp.toFixed(1)} °C`;
    });
});
