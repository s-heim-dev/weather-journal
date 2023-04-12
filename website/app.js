const baseURL = "https://api.openweathermap.org/data/2.5/weather?"
const apiKey = "&appid=<API-KEY>";

document.getElementById("generate").addEventListener("click", generate);

function generate() {
    request(baseURL, "lat=44.34&lon=10.99", apiKey);
}

const request = async (baseURL, params, key) => {
    await fetch(baseURL + params + key).then(res => res.json()).then(data => {
        console.log(data)
    }).catch(err => {
        console.error(err)
    });
}