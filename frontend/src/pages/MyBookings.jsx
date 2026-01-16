import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import BookingService from "../services/booking.service";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            BookingService.getUserBookings(user.id).then(
                (response) => {
                    setBookings(response.data);
                    setLoading(false);
                },
                (error) => {
                    console.log(error);
                    setLoading(false);
                }
            );
        }
    }, []);

    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Bookings</h2>

            {loading ? (
                <div className="text-gray-600 dark:text-gray-400">Loading bookings...</div>
            ) : bookings.length === 0 ? (
                <div className="text-gray-600 dark:text-gray-400">No bookings found.</div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-lg shadow p-6 border dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold dark:text-white">Booking #{booking.id}</h3>
                                    <p className="text-gray-500 text-sm">Booked on: {new Date(booking.bookingTime).toLocaleDateString()}</p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                                    {booking.status}
                                </span>
                            </div>
                            <div className="mt-4 border-t pt-4 dark:border-gray-700">
                                <p className="font-bold text-lg dark:text-white">{booking.flight.flightNumber}</p>
                                <div className="flex space-x-4 mt-2 text-gray-700 dark:text-gray-300">
                                    <span>{booking.flight.departureAirport.city}</span>
                                    <span>➝</span>
                                    <span>{booking.flight.arrivalAirport.city}</span>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">Departure: {new Date(booking.flight.departureTime).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
