async function getLocationData(latitude, longitude) {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&=localityLanguage=en`;
    const response = await fetch(url)
    return await response.json()
}

function getMaxSpeed(positions) {
    let maxSpeed = 0

    positions.forEach(position => {
        if(position.speed != null && position.speed > maxSpeed)
        maxSpeed = position.speed
    })

    return (maxSpeed * 3.6).toFixed(1)
}

// 1 m/s - 1 segundo = 1 metro
// 60 m/min - 60 segundos = 60 metros
// 1h - 60 min = 60 metros = 3600 m/h
// Se 1000 = 1 km 
// Então 1 m/s = 3.6 km/h

function getDistance(positions) {
    const earthRadiusKm = 6371 // Raio do planeta Terra.
    let totalDistance = 0

    for (let i = 0; i < positions.length - 1; i++) {
        const p1 = {
            latitude: positions[i].latitude,
            longitude: positions[i].longitude
        }
        const p2 = {
            latitude: positions[i + 1].latitude,
            longitude: positions[i + 1].longitude
        }
        const deltaLatitude = toRad(p2.latitude - p1.latitude)
        const deltaLongitude = toRad(p2.longitude - p1.longitude)

        const a = 
                Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) + 
                Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2) * 
                Math.cos(toRad(p1.latitude)) * Math.cos(toRad(p2.latitude))
                
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        
        const distance = earthRadiusKm * c

        totalDistance = totalDistance + distance
    }
    function toRad(degree) {
        return degree * Math.PI / 180
    }
    return totalDistance.toFixed(2)
}

function format(number, digits) {
    return String(number.toFixed(0)).padStart(2, "0")
}

function getDuration(ride) {

    const interval = (ride.stopTime - ride.startTime) / 1000
    
    const minutes = Math.trunc(interval / 60)
    const seconds = Math.trunc(interval % 60)

    return `${format(minutes, 2)}:${format(seconds, 2)}`
}

function getStartDate(ride) {
    const date = new Date(ride.startTime)
    const day = date.toLocaleString("pt-br", {day: "2-digit"})
    const month = date.toLocaleString("pt-br", {month: "2-digit"})
    const year = date.toLocaleString("pt-br", {year: "numeric"})
    const hour = date.toLocaleString("pt-br", {hour: "2-digit"})
    const minute = date.toLocaleString("pt-br", {minute: "2-digit"})
    return `${day}/${month}/${year} - ${hour}:${minute}`;
}