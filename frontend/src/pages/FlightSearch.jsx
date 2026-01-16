import React, { useState, useEffect } from "react";
import FlightService from "../services/flight.service";
import { Link } from "react-router-dom";

const FlightSearch = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        retrieveFlights();
    }, []);

    const retrieveFlights = () => {
        FlightService.getAllFlights()
            .then((response) => {
                setFlights(response.data);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
    };

    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Available Flights</h2>

            {loading ? (
                <div className="text-gray-600 dark:text-gray-400">Loading flights...</div>
            ) : (
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
            )}
        </div>
    );
};

export default FlightSearch;
