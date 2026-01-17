import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import FlightService from "../services/flight.service";
import AuthService from "../services/auth.service";
import { MapPin, Calendar, Clock, Thermometer, Wind, Cloud, AlertCircle, Shield, Users, Luggage, Wifi, Utensils } from "lucide-react";
import { getMockFlightById } from "../utils/flightUtils";

const FlightDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [flight, setFlight] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }

        if (location.state?.flight) {
            const mockFlight = location.state.flight;
            setFlight(mockFlight);
            generateMockWeather(mockFlight);
            setLoading(false);
        } else {
            getFlightDetails();
        }
    }, [id, location.state]);

    const generateMockWeather = (flightData) => {
        const weatherData = {
            departure: {
                temperature: Math.floor(20 + Math.random() * 15),
                condition: ['Sunny', 'Partly Cloudy', 'Clear'][Math.floor(Math.random() * 3)],
                windSpeed: Math.floor(5 + Math.random() * 15),
                humidity: Math.floor(40 + Math.random() * 40),
                icon: '☀️'
            },
            arrival: {
                temperature: Math.floor(18 + Math.random() * 18),
                condition: ['Cloudy', 'Partly Cloudy', 'Light Rain'][Math.floor(Math.random() * 3)],
                windSpeed: Math.floor(8 + Math.random() * 20),
                humidity: Math.floor(50 + Math.random() * 30),
                icon: '⛅'
            }
        };
        setWeather(weatherData);
    };

    const getFlightDetails = () => {
        if (id?.toString().startsWith("mock-")) {
            const mockFlight = getMockFlightById(id);
            if (mockFlight) {
                setFlight(mockFlight);
                generateMockWeather(mockFlight);
                setLoading(false);
            } else {
                setLoading(false); // Flight not found
            }
            return;
        }

        // Real API call would go here
        setLoading(false);
    };

    const calculateDelayRisk = () => {
        if (!weather) return { level: "LOW", color: "green", probability: "15%" };

        const windDiff = Math.abs(weather.departure.windSpeed - weather.arrival.windSpeed);
        let riskLevel = "LOW";
        let color = "green";
        let probability = "15%";

        if (windDiff > 20) {
            riskLevel = "HIGH";
            color = "red";
            probability = "65%";
        } else if (windDiff > 10) {
            riskLevel = "MEDIUM";
            color = "yellow";
            probability = "35%";
        }

        return { level: riskLevel, color, probability };
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getTimeDifference = (departure, arrival) => {
        const dep = new Date(departure);
        const arr = new Date(arrival);
        const diffMs = arr - dep;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const handleBookNow = () => {
        if (currentUser) {
            navigate(`/booking/confirm/${flight.id}`, { state: { flight } });
        } else {
            navigate('/login', { state: { from: location, flight } });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading flight details...</p>
                </div>
            </div>
        );
    }

    if (!flight) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Flight not found</h3>
                    <p className="text-gray-500 mb-6">The flight you're looking for doesn't exist or has been removed.</p>
                    <Link to="/flights" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Browse Flights
                    </Link>
                </div>
            </div>
        );
    }

    const delayRisk = calculateDelayRisk();
    const timeDiff = getTimeDifference(flight.departureTime, flight.arrivalTime);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                    <img
                                        src={flight.airlineLogo}
                                        alt={flight.airline}
                                        className="w-16 h-16 object-contain"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/64?text=✈️";
                                        }}
                                    />
                                </div>
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-bold mb-2">{flight.airline}</h1>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xl font-bold tracking-wider bg-white/20 px-3 py-1 rounded-lg">
                                            {flight.flightNumber}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${flight.status === 'SCHEDULED' ? 'bg-green-500/20 text-green-300' :
                                            flight.status === 'DELAYED' ? 'bg-yellow-500/20 text-yellow-300' :
                                                'bg-red-500/20 text-red-300'
                                            }`}>
                                            {flight.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-blue-200">
                                {flight.departureAirport.city} → {flight.arrivalAirport.city} • {formatDate(flight.departureTime)}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-5xl font-black mb-2">₹{flight.price.toLocaleString()}</div>
                            <p className="text-blue-200">per passenger</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Flight Information */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Flight Route Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Flight Route</h2>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {timeDiff} total duration
                                </div>
                            </div>

                            <div className="relative">
                                {/* Timeline */}
                                <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full -translate-y-1/2 z-0"></div>
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                    <div className="bg-blue-600 p-3 rounded-full shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 relative z-20">
                                    {/* Departure */}
                                    <div className="bg-blue-50 dark:bg-gray-900 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="text-3xl font-black text-gray-900 dark:text-white">{flight.departureAirport.code}</div>
                                                <div className="text-sm text-gray-500">{flight.departureAirport.city}</div>
                                            </div>
                                            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg font-bold">
                                                Terminal {flight.departureAirport.terminal}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(flight.departureTime)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span className="font-bold text-lg text-gray-900 dark:text-white">
                                                    {formatTime(flight.departureTime)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrival */}
                                    <div className="bg-blue-50 dark:bg-gray-900 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="text-3xl font-black text-gray-900 dark:text-white">{flight.arrivalAirport.code}</div>
                                                <div className="text-sm text-gray-500">{flight.arrivalAirport.city}</div>
                                            </div>
                                            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg font-bold">
                                                Terminal {flight.arrivalAirport.terminal}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(flight.arrivalTime)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span className="font-bold text-lg text-gray-900 dark:text-white">
                                                    {formatTime(flight.arrivalTime)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                            <div className="border-b border-gray-100 dark:border-gray-700">
                                <nav className="flex space-x-8 px-8" aria-label="Tabs">
                                    {[
                                        { id: "overview", label: "Overview", icon: "📋" },
                                        { id: "amenities", label: "Amenities", icon: "✨" },
                                        { id: "details", label: "Flight Details", icon: "🔍" }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            <span className="text-lg">{tab.icon}</span>
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-8">
                                {activeTab === "overview" && (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Flight Information</h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                                    <span className="text-gray-600 dark:text-gray-400">Aircraft</span>
                                                    <span className="font-semibold">{flight.aircraft || "Airbus A320neo"}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                                    <span className="text-gray-600 dark:text-gray-400">Distance</span>
                                                    <span className="font-semibold">{flight.distance || "1,150 km"}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                                    <span className="text-gray-600 dark:text-gray-400">Check-in Time</span>
                                                    <span className="font-semibold">{flight.checkInTime || "2 hours before departure"}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                                    <span className="text-gray-600 dark:text-gray-400">Gate</span>
                                                    <span className="font-semibold">{flight.gate || "45A"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Baggage Information</h3>
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Luggage className="w-5 h-5 text-blue-600" />
                                                        <span className="font-semibold">Check-in Baggage</span>
                                                    </div>
                                                    <span className="font-bold text-gray-900 dark:text-white">15kg</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Luggage className="w-5 h-5 text-blue-600" />
                                                        <span className="font-semibold">Cabin Baggage</span>
                                                    </div>
                                                    <span className="font-bold text-gray-900 dark:text-white">7kg</span>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                * Additional charges apply for extra baggage
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "amenities" && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {flight.amenities?.map((amenity, index) => (
                                            <div key={index} className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
                                                <div className="text-2xl mb-2">
                                                    {amenity === "WiFi" ? "📶" :
                                                        amenity === "In-flight Entertainment" ? "🎬" :
                                                            amenity === "Meal Service" ? "🍽️" :
                                                                amenity === "USB Charging" ? "🔌" : "✨"}
                                                </div>
                                                <span className="text-sm font-medium text-center">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === "details" && (
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Important Information</h4>
                                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                                <li className="flex items-start gap-2">
                                                    <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>All fares include taxes and fees</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                                                    <span>Check-in closes 45 minutes before departure</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <Users className="w-4 h-4 text-blue-500 mt-0.5" />
                                                    <span>Photo ID required for all passengers</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking & Info */}
                    <div className="space-y-8">
                        {/* Weather & Risk Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Flight Conditions</h3>

                            {/* Delay Risk */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Delay Risk</span>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${delayRisk.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        delayRisk.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {delayRisk.level}
                                    </div>
                                </div>
                                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className={`absolute left-0 top-0 h-full rounded-full ${delayRisk.color === 'green' ? 'bg-green-500' :
                                        delayRisk.color === 'yellow' ? 'bg-yellow-500' :
                                            'bg-red-500'
                                        }`}
                                        style={{ width: delayRisk.probability }}>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-2 text-right">
                                    Probability: {delayRisk.probability}
                                </div>
                            </div>

                            {/* Weather Info */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{weather?.departure?.icon || '☀️'}</div>
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Departure</div>
                                            <div className="font-bold text-gray-900 dark:text-white">
                                                {weather?.departure?.temperature || '25'}°C
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                            <Wind className="w-4 h-4" />
                                            {weather?.departure?.windSpeed || '10'} km/h
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {weather?.departure?.condition || 'Sunny'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{weather?.arrival?.icon || '⛅'}</div>
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Arrival</div>
                                            <div className="font-bold text-gray-900 dark:text-white">
                                                {weather?.arrival?.temperature || '22'}°C
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                            <Wind className="w-4 h-4" />
                                            {weather?.arrival?.windSpeed || '15'} km/h
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {weather?.arrival?.condition || 'Partly Cloudy'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-white">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">Ready to Fly?</h3>
                                <p className="text-blue-100 opacity-90">
                                    Secure your seat now at the best price
                                </p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-200">Base Fare</span>
                                    <span className="font-bold">₹{flight.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-200">Taxes & Fees</span>
                                    <span className="font-bold">₹{(flight.price * 0.18).toLocaleString()}</span>
                                </div>
                                <div className="border-t border-blue-500/30 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg">Total</span>
                                        <span className="text-2xl font-bold">
                                            ₹{Math.round(flight.price * 1.18).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleBookNow}
                                className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 rounded-xl text-lg transition-all transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                </svg>
                                {currentUser ? "Book This Flight" : "Login to Book"}
                            </button>

                            <div className="mt-6 pt-6 border-t border-blue-500/30">
                                <div className="flex items-center justify-center gap-2 text-sm text-blue-200">
                                    <Shield className="w-4 h-4" />
                                    <span>Secure payment • 24/7 Support • Free cancellation within 24h</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Need Help?</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Customer Support</span>
                                    <a href="tel:1800123456" className="font-semibold text-blue-600 hover:text-blue-700">
                                        1800-123-456
                                    </a>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Email</span>
                                    <a href="mailto:support@skywings.com" className="font-semibold text-blue-600 hover:text-blue-700">
                                        support@skywings.com
                                    </a>
                                </div>
                                <div className="pt-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Our team is available 24/7 to assist with your booking.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-4">
                        <Link to="/flights" className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            ← Back to Search
                        </Link>
                        <button
                            onClick={handleBookNow}
                            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105"
                        >
                            {currentUser ? "Book Now for ₹" + Math.round(flight.price * 1.18).toLocaleString() : "Login & Book Now"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightDetails;