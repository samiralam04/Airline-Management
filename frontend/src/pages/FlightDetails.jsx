import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import FlightService from "../services/flight.service";
import AuthService from "../services/auth.service";

const FlightDetails = () => {
    const { id } = useParams();
    const [flight, setFlight] = useState(null);
    const [weather, setWeather] = useState(null);
    const [risk, setRisk] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }

        getFlight(id);
        getWeather(id);
        getRisk(id);
    }, [id]);

    const getFlight = (id) => {
        FlightService.getFlightById(id)
            .then((response) => {
                setFlight(response.data);
                console.log("Flight:", response.data);
                if (response.data && !weather && !risk) {
                    // Once flight is loaded, we could potentially retry weather/risk if they depend on flight data
                    // But API endpoints depend on ID, so parallel calls are fine.
                }
            })
            .catch((e) => console.log(e));
    };

    const getWeather = (id) => {
        FlightService.getFlightWeather(id)
            .then((response) => {
                setWeather(response.data);
                console.log("Weather:", response.data);
            })
            .catch((e) => console.log(e));
    };

    const getRisk = (id) => {
        FlightService.getFlightDelayRisk(id)
            .then((response) => {
                setRisk(response.data);
                console.log("Risk:", response.data);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
    };

    if (loading && !flight) {
        return <div className="text-center mt-10 text-gray-600 dark:text-gray-400">Loading details...</div>;
    }

    return (
        <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700">
            {flight ? (
                <div className="space-y-8">
                    <div className="flex justify-between items-start border-b pb-4 dark:border-gray-700">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Flight {flight.flightNumber}</h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${flight.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' :
                                flight.status === 'DELAYED' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {flight.status}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">${flight.price}</p>
                            <p className="text-sm text-gray-500">{flight.aircraft.model}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Route Info */}
                        <div className="bg-gray-50 p-6 rounded-lg dark:bg-gray-700">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Route Information</h3>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{flight.departureAirport.code}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{flight.departureAirport.city}</p>
                                    <p className="text-xs text-gray-500">{new Date(flight.departureTime).toLocaleString()}</p>
                                </div>
                                <div className="text-2xl text-gray-400">➝</div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{flight.arrivalAirport.code}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{flight.arrivalAirport.city}</p>
                                    <p className="text-xs text-gray-500">{new Date(flight.arrivalTime).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Risk Indicator */}
                        <div className="bg-gray-50 p-6 rounded-lg dark:bg-gray-700 flex flex-col items-center justify-center">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Delay Risk Prediction</h3>
                            {risk ? (
                                <div className={`text-center p-4 rounded-full w-32 h-32 flex items-center justify-center border-4 ${risk.riskLevel === 'LOW' ? 'border-green-500 text-green-600 bg-green-50' :
                                    risk.riskLevel === 'MEDIUM' ? 'border-yellow-500 text-yellow-600 bg-yellow-50' :
                                        'border-red-500 text-red-600 bg-red-50'
                                    }`}>
                                    <span className="text-xl font-bold">{risk.riskLevel}</span>
                                </div>
                            ) : (
                                <p>Calculating risk...</p>
                            )}
                            <p className="text-sm text-gray-500 mt-2 text-center">Based on real-time weather data</p>
                        </div>
                    </div>

                    {/* Weather Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Weather Conditions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {weather && weather.departure ? (
                                <div className="p-4 border rounded-lg dark:border-gray-600">
                                    <h4 className="font-bold mb-2 dark:text-white">Departure ({flight.departureAirport.city})</h4>
                                    {weather.departure.current_weather ? (
                                        <div className="space-y-1 text-sm dark:text-gray-300">
                                            <p>Temp: {weather.departure.current_weather.temperature}°C</p>
                                            <p>Wind: {weather.departure.current_weather.windspeed} km/h</p>
                                        </div>
                                    ) : <p className="text-sm">Weather data unavailble</p>}
                                </div>
                            ) : (<div className="p-4 border rounded-lg">Loading Departure Weather...</div>)}

                            {weather && weather.arrival ? (
                                <div className="p-4 border rounded-lg dark:border-gray-600">
                                    <h4 className="font-bold mb-2 dark:text-white">Arrival ({flight.arrivalAirport.city})</h4>
                                    {weather.arrival.current_weather ? (
                                        <div className="space-y-1 text-sm dark:text-gray-300">
                                            <p>Temp: {weather.arrival.current_weather.temperature}°C</p>
                                            <p>Wind: {weather.arrival.current_weather.windspeed} km/h</p>
                                        </div>
                                    ) : <p className="text-sm">Weather data unavailble</p>}
                                </div>
                            ) : (<div className="p-4 border rounded-lg">Loading Arrival Weather...</div>)}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        {currentUser ? (
                            <Link to={`/booking/confirm/${flight.id}`} className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-lg px-8 py-3 dark:bg-green-600 dark:hover:bg-green-700">
                                Book Now
                            </Link>
                        ) : (
                            <Link to="/login" className="text-blue-600 hover:underline">Log in to book this flight</Link>
                        )}
                    </div>

                </div>
            ) : (
                <div className="text-center text-red-500">Flight not found</div>
            )}
        </div>
    );
};

export default FlightDetails;
