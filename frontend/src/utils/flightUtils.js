
// Airport coordinates (IATA code -> { lat, lon })
const AIRPORT_COORDINATES = {
    DEL: { lat: 28.5562, lon: 77.1000, name: "Delhi", country: "India" },
    BOM: { lat: 19.0896, lon: 72.8656, name: "Mumbai", country: "India" },
    BLR: { lat: 13.1986, lon: 77.7066, name: "Bengaluru", country: "India" },
    MAA: { lat: 12.9941, lon: 80.1709, name: "Chennai", country: "India" },
    CCU: { lat: 22.6547, lon: 88.4467, name: "Kolkata", country: "India" },
    HYD: { lat: 17.2403, lon: 78.4294, name: "Hyderabad", country: "India" },
    AMD: { lat: 23.0738, lon: 72.6347, name: "Ahmedabad", country: "India" },
    GOI: { lat: 15.3800, lon: 73.8314, name: "Goa (Dabolim)", country: "India" },
    COK: { lat: 10.1518, lon: 76.3930, name: "Kochi", country: "India" },
    PNQ: { lat: 18.5821, lon: 73.9197, name: "Pune", country: "India" },
    GAU: { lat: 26.1061, lon: 91.5859, name: "Guwahati", country: "India" },
    JAI: { lat: 26.8242, lon: 75.8054, name: "Jaipur", country: "India" },
    LKO: { lat: 26.7606, lon: 80.8893, name: "Lucknow", country: "India" },
    SXR: { lat: 34.0087, lon: 74.7740, name: "Srinagar", country: "India" },
    TRV: { lat: 8.4821, lon: 76.9200, name: "Thiruvananthapuram", country: "India" },
    IXB: { lat: 26.6857, lon: 88.3224, name: "Bagdogra", country: "India" },
    PAT: { lat: 25.5912, lon: 85.0880, name: "Patna", country: "India" },
    BBI: { lat: 20.2444, lon: 85.8178, name: "Bhubaneswar", country: "India" },
    IND: { lat: 22.7217, lon: 75.8011, name: "Indore", country: "India" },
    VNS: { lat: 25.4497, lon: 82.8587, name: "Varanasi", country: "India" },
    DXB: { lat: 25.2532, lon: 55.3657, name: "Dubai", country: "UAE" },
    LHR: { lat: 51.4700, lon: -0.4543, name: "London Heathrow", country: "UK" },
    JFK: { lat: 40.6413, lon: -73.7781, name: "New York JFK", country: "USA" },
    SIN: { lat: 1.3644, lon: 103.9915, name: "Singapore Changi", country: "Singapore" },
    HND: { lat: 35.5494, lon: 139.7798, name: "Tokyo Haneda", country: "Japan" },
    SYD: { lat: -33.9399, lon: 151.1753, name: "Sydney", country: "Australia" }
};

// Real airline logos with proper Wikimedia URLs
export const AIRLINES = [
    {
        name: "IndiGo",
        code: "6E",
        logo: "https://images.seeklogo.com/logo-png/62/1/indigo-logo-png_seeklogo-621349.png",
        color: "#0D4A8A",
        type: "DOMESTIC"
    },
    {
        name: "Air India",
        code: "AI",
        logo: "https://images.seeklogo.com/logo-png/49/1/air-india-logo-png_seeklogo-498362.png",
        color: "#FF6B00",
        type: "DOMESTIC"
    },
    {
        name: "Vistara",
        code: "UK",
        logo: "https://images.seeklogo.com/logo-png/31/1/vistara-logo-png_seeklogo-317421.png",
        color: "#0056A4",
        type: "DOMESTIC"
    },
    {
        name: "SpiceJet",
        code: "SG",
        logo: "https://images.seeklogo.com/logo-png/27/1/spicejet-logo-png_seeklogo-278033.png",
        color: "#F78F1E",
        type: "DOMESTIC"
    },
    {
        name: "AirAsia",
        code: "I5",
        logo: "http://images.seeklogo.com/logo-png/0/1/airasia-logo-png_seeklogo-5230.png",
        color: "#FF0000",
        type: "DOMESTIC"
    },
    {
        name: "Akasa Air",
        code: "QP",
        logo: "https://images.seeklogo.com/logo-png/43/1/akasa-air-logo-png_seeklogo-431797.png",
        color: "#FF6B35",
        type: "DOMESTIC"
    },
    {
        name: "Emirates",
        code: "EK",
        logo: "https://images.seeklogo.com/logo-png/2/1/emirates-logo-png_seeklogo-2831.png",
        color: "#D71920",
        type: "INTERNATIONAL"
    },
    {
        name: "Qatar Airways",
        code: "QR",
        logo: "https://images.seeklogo.com/logo-png/3/2/qatar-airways-logo-png_seeklogo-3363.png",
        color: "#580F31",
        type: "INTERNATIONAL"
    },
    {
        name: "Singapore Airlines",
        code: "SQ",
        logo: "https://images.seeklogo.com/logo-png/33/2/singapore-airlines-logo-png_seeklogo-339237.png",
        color: "#FDB913",
        type: "INTERNATIONAL"
    },
    {
        name: "British Airways",
        code: "BA",
        logo: "https://images.seeklogo.com/logo-png/8/1/british-airways-logo-png_seeklogo-8255.png",
        color: "#075AAA",
        type: "INTERNATIONAL"
    },
    {
        name: "Lufthansa",
        code: "LH",
        logo: "https://images.seeklogo.com/logo-png/43/1/lufthansa-logo-png_seeklogo-433433.png",
        color: "#051642",
        type: "INTERNATIONAL"
    },
    {
        name: "Etihad",
        code: "EY",
        logo: "https://images.seeklogo.com/logo-png/27/2/etihad-airways-logo-png_seeklogo-278297.png",
        color: "#D0B86F",
        type: "INTERNATIONAL"
    }
];

const toRad = (value) => {
    return value * Math.PI / 180;
};

// Calculate distance between two lat/lon points in km using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Math.round(d);
};

export const getDistance = (originCode, destinationCode) => {
    const origin = AIRPORT_COORDINATES[originCode];
    const destination = AIRPORT_COORDINATES[destinationCode];

    if (origin && destination) {
        return calculateDistance(origin.lat, origin.lon, destination.lat, destination.lon);
    }
    
    // Fallback for unknown airports: randomized realistic distance (800-2500km)
    const seed = (originCode || "").charCodeAt(0) + (destinationCode || "").charCodeAt(0);
    return 800 + (seed % 20) * 100;
};

export const calculateFlightDuration = (distance, isConnecting = false) => {
    // Average speed approx 800 km/h
    // + 30 mins for takeoff/landing/taxiing per leg
    
    const speed = 750; // slightly conservative average speed including reduced speed zones
    
    if (!isConnecting) {
        const flightTimeHours = distance / speed;
        const totalMinutes = Math.round(flightTimeHours * 60) + 40; // +40 mins fixed overhead
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
    } else {
        // Connecting flight: Distance represents total air distance
        // Add 2-4 hours for layover + extra takeoff/landing overhead
        const flightTimeHours = distance / speed;
        
        // Random layover between 2h to 5h
        const layoverMinutes = 120 + Math.floor(Math.random() * 180);
        
        // Two legs overhead (40 mins * 2)
        const totalMinutes = Math.round(flightTimeHours * 60) + 80 + layoverMinutes;
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
    }
};

export const generateMockFlights = (origin, destination, date) => {
    const distance = getDistance(origin, destination);
    const basePrice = Math.round(distance * 4.5); // Adjusted pricing model: approx 4.5 INR per km

    const mockFlights = [];
    const seed = (origin || "A").charCodeAt(0) + (destination || "B").charCodeAt(0) + new Date(date).getDate();
    const numFlights = 4 + (seed % 5); // 4 to 8 flights

    // Determine if route is domestic (both in India)
    const originAirport = AIRPORT_COORDINATES[origin];
    const destinationAirport = AIRPORT_COORDINATES[destination];
    
    // Default to India if airport not found (backward compatibility)
    const isOriginIndia = originAirport ? originAirport.country === "India" : true;
    const isDestIndia = destinationAirport ? destinationAirport.country === "India" : true;
    const isDomestic = isOriginIndia && isDestIndia;

    // Filter airlines based on route
    let availableAirlines = AIRLINES;
    if (isDomestic) {
        availableAirlines = AIRLINES.filter(a => a.type === "DOMESTIC");
    } else {
        // For international, mix international carriers and major domestic carriers (AI, Vistara, IndiGo)
        availableAirlines = AIRLINES.filter(a => 
            a.type === "INTERNATIONAL" || 
            ["AI", "UK", "6E"].includes(a.code)
        );
    }

    // Fallback if no airlines match (shouldn't happen with current data)
    if (availableAirlines.length === 0) availableAirlines = AIRLINES;

    for (let i = 0; i < numFlights; i++) {
        const airline = availableAirlines[(seed + i) % availableAirlines.length];
        
        // Distribute flights throughout the day
        const minuteOffset = ((seed + i * 17) % 60);
        const hourOffset = 5 + ((seed * 3 + i * 4) % 18); // Flights between 05:00 and 23:00
        
        // 20% chance of connecting flight if distance > 1500km, else 5%
        const isConnecting = distance > 1500 ? (i % 5 === 0) : (i % 10 === 0);
        
        const durationString = calculateFlightDuration(distance, isConnecting);
        const [hoursStr, minutesStr] = durationString.split(' ');
        const durationTotalMinutes = parseInt(hoursStr) * 60 + parseInt(minutesStr);
        
        const departureTime = new Date(`${date}T${hourOffset.toString().padStart(2, '0')}:${minuteOffset.toString().padStart(2, '0')}:00`);
        const arrivalTime = new Date(departureTime.getTime() + durationTotalMinutes * 60 * 1000);

        // Price variation based on demand/time (early morning/late night cheaper)
        let priceMultiplier = 1;
        if (hourOffset < 7 || hourOffset > 21) priceMultiplier = 0.85; // Cheaper
        if (hourOffset > 9 && hourOffset < 18) priceMultiplier = 1.15; // Peak
        if (isConnecting) priceMultiplier = 0.75; // Connecting usually cheaper
        
        const randomVariance = 0.9 + ((seed + i) % 20) / 100; // +/- 10%
        const finalPrice = Math.round(basePrice * priceMultiplier * randomVariance);

        // Generate realistic flight number
        const flightNumber = `${airline.code}${String(100 + ((seed + i) * 11) % 900)}`;

        mockFlights.push({
            id: `mock-${origin}-${destination}-${i}-${seed}`,
            flightNumber: flightNumber,
            airline: airline.name,
            airlineCode: airline.code,
            airlineLogo: airline.logo,
            airlineColor: airline.color,
            status: "SCHEDULED",
            departureAirport: {
                code: origin || "DEL",
                city: AIRPORT_COORDINATES[origin]?.name || origin || "Origin",
                terminal: "T" + (1 + (seed % 3)),
                coordinates: AIRPORT_COORDINATES[origin]
            },
            arrivalAirport: {
                code: destination || "BOM",
                city: AIRPORT_COORDINATES[destination]?.name || destination || "Destination",
                terminal: "T" + (1 + ((seed + 1) % 3)),
                coordinates: AIRPORT_COORDINATES[destination]
            },
            departureTime: departureTime.toISOString(),
            arrivalTime: arrivalTime.toISOString(),
            price: finalPrice,
            distance: `${distance} km`,
            duration: durationString,
            isConnecting: isConnecting,
            stops: isConnecting ? 1 : 0,
            seatsAvailable: 5 + ((seed + i) % 120),
            baggage: "15kg Check-in, 7kg Cabin",
            refundable: i % 2 === 0,
            aircraft: airline.code === "SG" || airline.code === "6E" ? "Boeing 737" : "Airbus A320neo",
            amenities: ["WiFi", "In-flight Entertainment", "Meal Service"]
        });
    }

    // Sort by departure time
    return mockFlights.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
};

export const getMockFlightById = (id) => {
    if (!id || !id.startsWith("mock-")) return null;
    
    // ID format: mock-{origin}-{destination}-{index}-{seed}
    const parts = id.split("-");
    
    // We expect at least 5 parts. Note: Origin/Dest usually 3 chars but split '-' might be risky if code contains dash (unlikely for IATA)
    // Safe parsing from end
    if (parts.length < 5) return null;
    
    const seedString = parts[parts.length - 1];
    const indexString = parts[parts.length - 2];
    
    const index = parseInt(indexString);
    const seed = parseInt(seedString);
    
    if (isNaN(index) || isNaN(seed)) return null;
    
    const destination = parts[parts.length - 3];
    const origin = parts[parts.length - 4];
    
    // Use current date as placeholder
    const date = new Date().toISOString().split('T')[0];
    const distance = getDistance(origin, destination);
    const basePrice = Math.round(distance * 4.5);
    
    // Reconstruct flight for specific index
    const i = index;
    const airline = AIRLINES[(seed + i) % AIRLINES.length];
    const minuteOffset = ((seed + i * 17) % 60);
    const hourOffset = 5 + ((seed * 3 + i * 4) % 18);
    const isConnecting = distance > 1500 ? (i % 5 === 0) : (i % 10 === 0);
    
    const durationString = calculateFlightDuration(distance, isConnecting);
    const [hoursStr, minutesStr] = durationString.split(' ');
    const durationTotalMinutes = parseInt(hoursStr) * 60 + parseInt(minutesStr);
        
    const departureTime = new Date(`${date}T${hourOffset.toString().padStart(2, '0')}:${minuteOffset.toString().padStart(2, '0')}:00`);
    const arrivalTime = new Date(departureTime.getTime() + durationTotalMinutes * 60 * 1000);

    let priceMultiplier = 1;
    if (hourOffset < 7 || hourOffset > 21) priceMultiplier = 0.85;
    if (hourOffset > 9 && hourOffset < 18) priceMultiplier = 1.15;
    if (isConnecting) priceMultiplier = 0.75;
    const randomVariance = 0.9 + ((seed + i) % 20) / 100;
    const finalPrice = Math.round(basePrice * priceMultiplier * randomVariance);
    
    const flightNumber = `${airline.code}${String(100 + ((seed + i) * 11) % 900)}`;

    return {
        id: id,
        flightNumber: flightNumber,
        airline: airline.name,
        airlineCode: airline.code,
        airlineLogo: airline.logo,
        airlineColor: airline.color,
        status: "SCHEDULED",
        departureAirport: {
            code: origin || "DEL",
            city: AIRPORT_COORDINATES[origin]?.name || origin || "Origin",
            terminal: "T" + (1 + (seed % 3)),
            coordinates: AIRPORT_COORDINATES[origin]
        },
        arrivalAirport: {
            code: destination || "BOM",
            city: AIRPORT_COORDINATES[destination]?.name || destination || "Destination",
            terminal: "T" + (1 + ((seed + 1) % 3)),
            coordinates: AIRPORT_COORDINATES[destination]
        },
        departureTime: departureTime.toISOString(),
        arrivalTime: arrivalTime.toISOString(),
        price: finalPrice,
        distance: `${distance} km`,
        duration: durationString,
        isConnecting: isConnecting,
        stops: isConnecting ? 1 : 0,
        seatsAvailable: 5 + ((seed + i) % 120),
        baggage: "15kg Check-in, 7kg Cabin",
        refundable: i % 2 === 0,
        aircraft: airline.code === "SG" || airline.code === "6E" ? "Boeing 737" : "Airbus A320neo",
        amenities: ["WiFi", "In-flight Entertainment", "Meal Service"]
    };
};

export const getAirportDetails = (code) => {
    return AIRPORT_COORDINATES[code] || null;
};
