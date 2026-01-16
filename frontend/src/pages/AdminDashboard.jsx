import React, { useState, useEffect } from "react";
import FlightService from "../services/flight.service";
import BookingService from "../services/booking.service";
import api from "../services/api"; // Need direct access for some admin/mock calls or extend services

const AdminDashboard = () => {
    const [flights, setFlights] = useState([]);
    // In a real app, we'd have a service to get all bookings for admin
    // For now, listing flights is enough demonstration
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        retrieveFlights();
    }, []);

    const retrieveFlights = () => {
        FlightService.getAllFlights()
            .then((response) => {
                setFlights(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <div className="container mx-auto mt-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                    {showForm ? "Close Form" : "Add Flight"}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 p-6 bg-gray-50 rounded shadow dark:bg-gray-700">
                    <p className="text-gray-600 dark:text-gray-300">Flight creation form placeholder (Use Postman or Backend API for now)</p>
                </div>
            )}

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Flight No</th>
                            <th scope="col" className="px-6 py-3">Origin</th>
                            <th scope="col" className="px-6 py-3">Destination</th>
                            <th scope="col" className="px-6 py-3">Time</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map((flight) => (
                            <tr key={flight.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {flight.flightNumber}
                                </td>
                                <td className="px-6 py-4">{flight.departureAirport.code}</td>
                                <td className="px-6 py-4">{flight.arrivalAirport.code}</td>
                                <td className="px-6 py-4">
                                    {new Date(flight.departureTime).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs ${flight.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' :
                                            flight.status === 'DELAYED' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {flight.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex space-x-2">
                                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                    <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline">Cancel</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
