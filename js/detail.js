const parameter = new URLSearchParams(window.location.search)
const rideID = parameter.get("id")
const ride = getRideRecord(rideID)

document.addEventListener("DOMContentLoaded", async() => {
    const firsPosition = ride.data[0]
    const firtsLocationData = await getLocationData(firsPosition.latitude, firsPosition.longitude)

    const cityDiv = document.createElement("div")
    cityDiv.className = "text-primary mb-2"
    cityDiv.innerHTML = `${firtsLocationData.city} - ${firtsLocationData.countryCode}`

    const maxSpeedDiv = document.createElement("div")
    maxSpeedDiv.className = "fw-bold"
    maxSpeedDiv.innerText = `Velocidade máxima: ${getMaxSpeed(ride.data)} Km/h`

    const distanceDiv = document.createElement("div")
    distanceDiv.innerText = `Distância: ${getDistance(ride.data)} Km`

    const durationDiv = document.createElement("div")
    durationDiv.innerText = `Duração: ${getDuration(ride)}`

    const dateDiv = document.createElement("div")
    dateDiv.className = "text-secondary mt-2"
    dateDiv.innerText = getStartDate(ride)

    const mapElement = document.createElement("div")
    mapElement.style = "width: 100px; height: 100px";
    mapElement.classList.add("bg-secondary")
    mapElement.classList.add("rounded-4")

    const dataElement = document.createElement("div")
    dataElement.className = "flex-fill d-flex flex-column"

    dataElement.appendChild(cityDiv)
    dataElement.appendChild(maxSpeedDiv)
    dataElement.appendChild(distanceDiv)
    dataElement.appendChild(durationDiv)
    dataElement.appendChild(dateDiv)

    document.querySelector("#data").appendChild(dataElement)

    const deleteBtn = document.querySelector("#deleteBtn")
    deleteBtn.addEventListener("click", () => {
       deleteRide(rideID)
       window.location.href = "../index.html" 
    })

    const map = L.map("mapDetail")
    map.setView([firsPosition.latitude, firsPosition.longitude], 14)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

    const positionsArray = ride.data.map((position => { return [position.latitude, position.longitude]}))

    const polyline = L.polyline(positionsArray, {color: "F00"}).addTo(map)

    map.fitBounds(polyline.getBounds())

    L.marker([firsPosition.latitude, firsPosition.longitude]).addTo(map)
    
})

