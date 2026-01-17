import React, { useState, useEffect } from "react";
import FlightService from "../services/flight.service";
import AirportSearch from "../components/AirportSearch";
import { Link, useNavigate } from "react-router-dom";

import { generateMockFlights } from "../utils/flightUtils";

const FlightSearch = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        origin: "DEL",
        destination: "BOM",
        date: new Date().toISOString().split('T')[0]
    });
    const [searched, setSearched] = useState(false);
    const [sortBy, setSortBy] = useState("departure");
    const navigate = useNavigate();

    useEffect(() => {
        // Load initial flights
        handleInitialSearch();
    }, []);

    const handleInitialSearch = () => {
        setLoading(true);
        setTimeout(() => {
            const mocks = generateMockFlights(searchParams.origin, searchParams.destination, searchParams.date);
            setFlights(mocks);
            setLoading(false);
            setSearched(true);
        }, 800);
    };

    const handleChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const mocks = generateMockFlights(searchParams.origin, searchParams.destination, searchParams.date);
            setFlights(mocks);
            setLoading(false);
            setSearched(true);
        }, 800);
    };

    const handleBookClick = (flight) => {
        navigate(`/booking/confirm/${flight.id}`, { state: { flight, searchParams } });
    };

    const handleSortChange = (e) => {
        const sortValue = e.target.value;
        setSortBy(sortValue);

        const sortedFlights = [...flights].sort((a, b) => {
            switch (sortValue) {
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "duration":
                    return parseInt(a.duration) - parseInt(b.duration);
                case "departure":
                default:
                    return new Date(a.departureTime) - new Date(b.departureTime);
            }
        });
        setFlights(sortedFlights);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 pb-20">
            {/* Search Section */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-8 shadow-xl">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold text-white mb-2">Find Your Perfect Flight</h1>
                            <p className="text-blue-100">Compare prices and book with confidence</p>
                        </div>

                        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">From</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            🛫
                                        </div>
                                        <AirportSearch
                                            label=""
                                            initialValue={searchParams.origin}
                                            onSelect={(airport) => setSearchParams({ ...searchParams, origin: airport.code })}
                                            className="pl-10 w-full"
                                            showSelectedDetails={false}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">To</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            🛬
                                        </div>
                                        <AirportSearch
                                            label=""
                                            initialValue={searchParams.destination}
                                            onSelect={(airport) => setSearchParams({ ...searchParams, destination: airport.code })}
                                            className="pl-10 w-full"
                                            showSelectedDetails={false}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Departure Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={searchParams.date}
                                        onChange={handleChange}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                        Search Flights
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                Real-time prices | No hidden fees | 24/7 Support
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="container mx-auto px-4 mt-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-600"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-10 h-10 text-blue-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 font-medium">Searching for the best flights...</p>
                    </div>
                ) : (
                    <>
                        {searched && flights.length > 0 && (
                            <div className="mb-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {flights.length} Flights Found
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {searchParams.origin} → {searchParams.destination} • {formatDate(searchParams.date)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                                        <select
                                            value={sortBy}
                                            onChange={handleSortChange}
                                            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="departure">Departure Time</option>
                                            <option value="price-asc">Price: Low to High</option>
                                            <option value="price-desc">Price: High to Low</option>
                                            <option value="duration">Duration</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!loading && searched && flights.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No flights found</h3>
                                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {flights.map((flight) => (
                                    <div key={flight.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden group">
                                        <div className="p-6">
                                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                                                {/* Airline Info */}
                                                <div className="flex items-center lg:w-1/5">
                                                    <div className="relative">
                                                        <div
                                                            className="w-16 h-16 rounded-xl p-3 flex items-center justify-center border shadow-sm"
                                                            style={{ backgroundColor: flight.airlineColor + '10', borderColor: flight.airlineColor + '30' }}
                                                        >
                                                            <img
                                                                src={flight.airlineLogo}
                                                                alt={flight.airline}
                                                                className="w-full h-full object-contain"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = `https://ui-avatars.com/api/?name=${flight.airline}&background=${flight.airlineColor.replace('#', '')}&color=fff&bold=true`;
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                            {flight.airlineCode}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{flight.airline}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{flight.flightNumber}</p>
                                                        <div className="flex items-center mt-1">
                                                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                                {flight.seatsAvailable} seats left
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Flight Details */}
                                                <div className="flex-1 lg:w-3/5">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-center">
                                                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{formatTime(flight.departureTime)}</div>
                                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{flight.departureAirport.code}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">Terminal {flight.departureAirport.terminal}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{flight.departureAirport.city}</div>
                                                        </div>

                                                        <div className="flex-1 px-8">
                                                            <div className="relative">
                                                                <div className="text-center mb-2">
                                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                                                        {flight.duration}
                                                                    </span>
                                                                </div>
                                                                <div className="relative h-1 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 dark:from-blue-600 dark:via-blue-500 dark:to-blue-600 rounded-full">
                                                                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-blue-600 border-2 border-white dark:border-gray-800 shadow"></div>
                                                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-blue-600 border-2 border-white dark:border-gray-800 shadow"></div>
                                                                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
                                                                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                                    <span>{flight.isConnecting ? "1 Stop" : "Direct"}</span>
                                                                    <span>{flight.baggage}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="text-center">
                                                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{formatTime(flight.arrivalTime)}</div>
                                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{flight.arrivalAirport.code}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">Terminal {flight.arrivalAirport.terminal}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{flight.arrivalAirport.city}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Price & Action */}
                                                <div className="lg:w-1/5 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 pt-4 lg:pt-0 lg:pl-6">
                                                    <div className="flex flex-col items-center lg:items-end">
                                                        <div className="mb-3">
                                                            <div className="text-3xl font-bold text-gray-900 dark:text-white text-center lg:text-right">
                                                                ₹{flight.price.toLocaleString()}
                                                            </div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center lg:text-right">
                                                                {flight.refundable ? "Refundable" : "Non-refundable"}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleBookClick(flight)}
                                                            className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group"
                                                        >
                                                            <span>Select</span>
                                                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                                            </svg>
                                                        </button>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center lg:text-right">
                                                            All taxes included
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Flight Status Bar */}
                                        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="font-medium text-green-600">{flight.status}</span>
                                                    </span>
                                                    <span className="text-gray-500 dark:text-gray-400">•</span>
                                                    <span className="text-gray-600 dark:text-gray-400">E-Ticket Available</span>
                                                </div>
                                                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1">
                                                    Flight details
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Quick Tips */}
                {flights.length > 0 && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <h3 className="font-bold text-gray-900 dark:text-white">Booking Tips</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-semibold text-gray-800 dark:text-white">Best Price:</span> Book at least 21 days in advance
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-semibold text-gray-800 dark:text-white">Flexibility:</span> Consider refundable tickets for changes
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-semibold text-gray-800 dark:text-white">Baggage:</span> Check airline policies before booking
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightSearch;