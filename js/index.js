const rideListElement = document.querySelector("#rideList");
const allRides = getAllRides();

allRides.forEach(async([id, value])=> {
    const ride = JSON.parse(value)
    ride.id = id;

    const itemElement = document.createElement("li")
    itemElement.id = ride.id
    itemElement.className = "d-flex align-items-center p-2 gap-2 shadow-sm"

    rideListElement.appendChild(itemElement)

    itemElement.addEventListener("click", ()=> {
        window.location.href = `./html/detail.html?id=${ride.id}`
    })

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

    const mapID = `map${ride.id}`
    const mapElement = document.createElement("div")
    mapElement.id = mapID
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

    itemElement.appendChild(mapElement)
    itemElement.appendChild(dataElement)

    const map = L.map(mapID, {zoomControl: false, dragging: false, attributionControl: false, scrollWheelZoom: false})
    map.setView([firsPosition.latitude, firsPosition.longitude], 14)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map)

    L.marker([firsPosition.latitude, firsPosition.longitude]).addTo(map)
    
})

