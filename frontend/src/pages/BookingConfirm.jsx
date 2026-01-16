import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FlightService from "../services/flight.service";
import AuthService from "../services/auth.service";
import BookingService from "../services/booking.service";

const BookingConfirm = () => {
    const { flightId } = useParams();
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        } else {
            navigate("/login");
        }

        FlightService.getFlightById(flightId).then(
            (response) => {
                setFlight(response.data);
            },
            (error) => console.log(error)
        );
    }, [flightId, navigate]);

    const handleBooking = () => {
        setLoading(true);
        BookingService.createBooking(currentUser.id, flight.id, null) // Seat selection skipped for simplicity
            .then(
                () => {
                    setLoading(false);
                    navigate("/bookings");
                },
                (error) => {
                    setLoading(false);
                    setMessage("Booking failed: " + error.toString());
                }
            );
    };

    if (!flight) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="container mx-auto mt-10 p-6 max-w-2xl bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Confirm Booking</h2>

            <div className="mb-6 p-4 bg-gray-50 rounded dark:bg-gray-700">
                <h3 className="font-bold text-lg mb-2 dark:text-white">Flight: {flight.flightNumber}</h3>
                <p className="dark:text-gray-300">From: {flight.departureAirport.city} ({flight.departureAirport.code})</p>
                <p className="dark:text-gray-300">To: {flight.arrivalAirport.city} ({flight.arrivalAirport.code})</p>
                <p className="dark:text-gray-300">Date: {new Date(flight.departureTime).toLocaleString()}</p>
                <p className="mt-2 font-bold text-xl dark:text-white">Price: ${flight.price}</p>
            </div>

            {message && <div className="text-red-500 mb-4">{message}</div>}

            <div className="flex justify-end space-x-4">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Cancel
                </button>
                <button
                    onClick={handleBooking}
                    disabled={loading}
                    className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 font-bold"
                >
                    {loading ? "Processing..." : "Confirm & Pay"}
                </button>
            </div>
        </div>
    );
};

export default BookingConfirm;
