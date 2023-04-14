// API Helper

const baseURL = "https://api.openweathermap.org";
const apiKey = "<API-KEY>";

/**
 * Creates a HTTP Requests
 * @param {string}  baseURL     The main url of the api
 * @param {string}  subURL      The defining suburl of the api service
 * @param {string}  params      The request parameters
 * @param {string}  key         The api key
 * @returns An unhandled HTTP request (serialized from JSON)
 */
const request = async (baseURL, subURL, params, appendix) => {
    return await fetch(baseURL + subURL + params + "&appid=" + appendix).then(res => res.json());
}

/**
 * Creates a HTTP Request to the geo api
 * @param {string}  city        The city name of the requested location
 * @param {string}  country     The country code of the requested location
 * @returns An unhandled HTTP request (serialized from JSON)
 */
const getGeoData = async (city, country) => {
    if (!(city || country)) {
        return undefined;
    }

    return request(baseURL, "/geo/1.0/direct?", `q=${city ? city : ""}${country && city ? "," : ""}${country ? country : ""}`, apiKey);
}

/**
 * Creates a HTTP request to the weather api
 * @param {number}  lat     The latitude of the location
 * @param {number}  lon     The longitude of the location
 * @returns An unhandled HTTP request (serialized from JSON)
 */
const getWeatherData = async (lat, lon) => {
    if (!(lat && lon)) {
        return undefined;
    }

    return request(baseURL, "/data/2.5/weather?", `lat=${lat}&lon=${lon}&units=metric`, apiKey);
}


// DOM Helper

/**
 * Sets the data to the most recent entry
 * @param {Date}    date    The date of the entry
 * @param {number}  temp    The temperature
 * @param {string}  content The feelings (or other content to mention)
 */
const setEntryData = (date = new Date(), temp=null, content=null) => {
    document.getElementById("date").innerHTML = date.toUTCString();
    document.getElementById("temp").innerHTML = temp;
    document.getElementById("content").innerHTML = content;
} 


// Setup App
document.getElementById("generate").addEventListener("click", () => {
    const city = document.getElementById("city");
    const country = document.getElementById("country");
    const feelings = document.getElementById("feelings");

    const geoDataRequest = getGeoData(city.value, country.value);

    if (geoDataRequest) {
        geoDataRequest.then(res => {
            if (res.length == 1) {
                const { lat, lon } = res[0];
                getWeatherData(lat, lon).then(res => {
                    setEntryData(new Date(), res.main.temp + "°C", "Your feelings: " + feelings.value);
                }).catch(err => console.log(err));
            }
            
        }).catch(err => console.log(err));
    }
});
