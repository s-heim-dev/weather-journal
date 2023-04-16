// API Helper

const apiURL = "https://api.openweathermap.org";
const apiKey = "<API-KEY>";

/**
 * Creates a HTTP-GET-Request to a specified api
 * @param {string}  baseURL     The main url of the api
 * @param {string}  route       The defining route of the api service
 * @param {string}  params      The request parameters
 * @param {string}  key         The api key
 * @returns An unhandled HTTP request (serialized from JSON)
 */
const get = async (baseURL, route, params, appendix) => {
    return await fetch(baseURL + route + params + "&appid=" + appendix).then(res => res.json());
}

/**
 * Creates a HTTP-POST-Request to the server
 * @param {string}  route       The route to the post service
 * @param {Object}  data        The data to post
 * @returns An unhandled HTTP request
 */
const post = async (route, data) => {
    return await fetch(route, {
        method: 'POST', 
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },     
        body: JSON.stringify(data), 
      });
}

/**
 * Creates a HTTP-GET-Request to the geo api
 * @param {string}  city        The city name of the requested location
 * @param {string}  country     The country code of the requested location
 * @returns An unhandled HTTP request (serialized from JSON)
 */
const getGeoData = async (city, country) => {
    if (!(city || country)) {
        return undefined;
    }

    return await get(apiURL, "/geo/1.0/direct?", `q=${city ? city : ""}${country && city ? "," : ""}${country ? country : ""}`, apiKey);
}

/**
 * Creates a HTTP-GET-request to the weather api
 * @param {number}  lat     The latitude of the location
 * @param {number}  lon     The longitude of the location
 * @returns An unhandled HTTP request (serialized from JSON)
 */
const getWeatherData = async (lat, lon) => {
    if (!(lat && lon)) {
        return undefined;
    }

    return await get(apiURL, "/data/2.5/weather?", `lat=${lat}&lon=${lon}&units=metric`, apiKey);
}

/**
 * Creates a HTTP-GET-Request to the Entry Handler to get the last entry
 * @returns An unhandled HTTP request
 */
const getEntryData = async () => {
    return await fetch("/entry").then(res => res.json());
}

/**
 * Creates a HTTP-GET-Request to the Entry Handler to get all entries
 * @returns An unhandled HTTP request
 */
const getAllEntryData = async () => {
    return await fetch("/all").then(res => res.json());
}

/**
 * Creates a HTTP-POST-Request to the Entry Handler
 * @param {Object}  data    The Entry Data
 * @returns An unhandled HTTP request
 */
const postEntryData = async (data) => {
    return await post("/entry", data);
}


// DOM Helper

/**
 * Sets the data to the most recent entry
 * @param {Objct}   data    The entry data
 */
const createEntryHolder = (data) => {
    const holder = document.createElement("div");
    const entries = document.getElementById("entries");
    holder.className = "entryHolder";
    for (let prop of [new Date(data.date).toUTCString(), data.temp, data.content]) {
        const element = document.createElement("div");
        element.innerHTML = prop;
        holder.appendChild(element);
    }

    entries.insertBefore(holder, entries.firstChild);
} 


// Setup App
const city = document.getElementById("city");
const country = document.getElementById("country");
const feelings = document.getElementById("feelings");

document.addEventListener("DOMContentLoaded", () => {
    getEntryData().then(data => {
        if (data.hasOwnProperty("date")) {
            createEntryHolder(data);
        }
    })
});



document.getElementById("generate").addEventListener("click", () => {
    const geoDataRequest = getGeoData(city.value, country.value);

    if (geoDataRequest) {
        geoDataRequest.then(res => {
            if (res.length == 1) {
                const { lat, lon } = res[0];
                getWeatherData(lat, lon).then(res => {
                    const data = { 
                        date: new Date(), 
                        temp: res.main.temp + "°C", 
                        content: "Your feelings: " + feelings.value 
                    };

                    createEntryHolder(data);
                    postEntryData(data).catch(err => console.log(err));
                    

                }).catch(err => console.log(err));
            }
            
        }).catch(err => console.log(err));
    }
});
