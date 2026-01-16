import React, { useState, useEffect } from "react";
import FlightService from "../services/flight.service";
import AirportService from "../services/airport.service"; // Kept if needed for other things, but main search is in component
import AirportSearch from "../components/AirportSearch";
import { Link } from "react-router-dom";

const FlightSearch = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        origin: "",
        destination: "",
        date: ""
    });
    const [searched, setSearched] = useState(false);

    const handleChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);
        FlightService.searchFlights(searchParams.origin, searchParams.destination, searchParams.date)
            .then((response) => {
                setFlights(response.data);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
                setFlights([]);
            });
    };

    return (
        <div className="container mx-auto mt-10 px-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-10">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Find Your Flight</h2>
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <AirportSearch
                            label="From"
                            onSelect={(airport) => setSearchParams({ ...searchParams, origin: airport.code })}
                        />
                    </div>
                    <div>
                        <AirportSearch
                            label="To"
                            onSelect={(airport) => setSearchParams({ ...searchParams, destination: airport.code })}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={searchParams.date}
                            onChange={handleChange}
                            required
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            Search Flights
                        </button>
                    </div>
                </form>
            </div>

            <div className="mb-8">
                {loading && <div className="text-center text-xl text-gray-600 dark:text-gray-400">Searching flights...</div>}

                {!loading && searched && flights.length === 0 && (
                    <div className="text-center text-xl text-gray-600 dark:text-gray-400">No flights found for the selected criteria.</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {flights.map((flight) => (
                        <div key={flight.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700 p-6 border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                                    {flight.flightNumber}
                                </span>
                                <span className={`text-sm font-medium px-2 py-1 rounded ${flight.status === 'SCHEDULED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                    flight.status === 'DELAYED' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {flight.status}
                                </span>
                            </div>

                            <div className="flex justify-between mb-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{flight.departureAirport.code}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{flight.departureAirport.city}</div>
                                    <div className="text-xs text-gray-400">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-gray-400">✈️</span>
                                    <span className="text-xs text-gray-400">----------------</span>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{flight.arrivalAirport.code}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{flight.arrivalAirport.city}</div>
                                    <div className="text-xs text-gray-400">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">${flight.price}</div>
                                <Link to={`/flights/${flight.id}`} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FlightSearch;
