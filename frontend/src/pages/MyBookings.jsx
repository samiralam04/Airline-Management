import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { calculateFlightDuration, getDistance, AIRLINES } from "../utils/flightUtils";
import { Calendar, Clock, MapPin, Download, User, Plane, CreditCard, CalendarDays, Ticket, ChevronRight, QrCode, Bell, Info } from "lucide-react";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        // Simulate API call with setTimeout
        setTimeout(() => {
            const storedBookings = JSON.parse(localStorage.getItem("skywings_bookings") || "[]");
            // Add more realistic mock data if empty
            let bookingsData = storedBookings;

            if (bookingsData.length === 0) {
                bookingsData = generateMockBookings();
                localStorage.setItem("skywings_bookings", JSON.stringify(bookingsData));
            }

            const sorted = bookingsData.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
            setBookings(sorted);
            setLoading(false);
        }, 800);
    }, []);


    const generateMockBookings = () => {
        return [
            {
                id: `SKY${Date.now().toString().slice(-8)}`,
                flight: {
                    airline: "Air India",
                    airlineLogo: AIRLINES.find(a => a.code === "AI").logo,
                    flightNumber: "AI865",
                    departureAirport: { code: "DEL", city: "Delhi", terminal: "T3" },
                    arrivalAirport: { code: "BOM", city: "Mumbai", terminal: "T2" },
                    departureTime: new Date(Date.now() + 86400000 * 2).toISOString(),
                    arrivalTime: new Date(Date.now() + 86400000 * 2 + 7200000).toISOString(),
                    duration: calculateFlightDuration(getDistance("DEL", "BOM")),
                    aircraft: "Boeing 787 Dreamliner"
                },
                passenger: {
                    firstName: "John",
                    lastName: "Doe",
                    name: "John Doe",
                    age: 28,
                    flightClass: "Business",
                    seat: "12A"
                },
                paymentMethod: "Credit Card",
                totalAmount: 18500,
                bookingTime: new Date(Date.now() - 86400000 * 1).toISOString(),
                status: "CONFIRMED",
                checkInStatus: "OPEN",
                baggage: "15kg Check-in, 7kg Cabin"
            },
            {
                id: `SKY${Date.now().toString().slice(-9, -1)}`,
                flight: {
                    airline: "IndiGo",
                    airlineLogo: AIRLINES.find(a => a.code === "6E").logo,
                    flightNumber: "6E531",
                    departureAirport: { code: "BOM", city: "Mumbai", terminal: "T2" },
                    arrivalAirport: { code: "BLR", city: "Bangalore", terminal: "T1" },
                    departureTime: new Date(Date.now() + 86400000 * 7).toISOString(),
                    arrivalTime: new Date(Date.now() + 86400000 * 7 + 5400000).toISOString(),
                    duration: calculateFlightDuration(getDistance("BOM", "BLR")),
                    aircraft: "Airbus A320neo"
                },
                passenger: {
                    firstName: "John",
                    lastName: "Doe",
                    name: "John Doe",
                    age: 28,
                    flightClass: "Economy",
                    seat: "18C"
                },
                paymentMethod: "UPI",
                totalAmount: 7500,
                bookingTime: new Date(Date.now() - 86400000 * 3).toISOString(),
                status: "CONFIRMED",
                checkInStatus: "OPEN",
                baggage: "15kg Check-in, 7kg Cabin"
            },
            {
                id: `SKY${Date.now().toString().slice(-10, -2)}`,
                flight: {
                    airline: "Vistara",
                    airlineLogo: AIRLINES.find(a => a.code === "UK").logo,
                    flightNumber: "UK925",
                    departureAirport: { code: "DEL", city: "Delhi", terminal: "T3" },
                    arrivalAirport: { code: "CCU", city: "Kolkata", terminal: "T2" },
                    departureTime: new Date(Date.now() - 86400000 * 15).toISOString(),
                    arrivalTime: new Date(Date.now() - 86400000 * 15 + 10800000).toISOString(),
                    duration: calculateFlightDuration(getDistance("DEL", "CCU")),
                    aircraft: "Airbus A321"
                },
                passenger: {
                    firstName: "John",
                    lastName: "Doe",
                    name: "John Doe",
                    age: 28,
                    flightClass: "Premium Economy",
                    seat: "10D"
                },
                paymentMethod: "Net Banking",
                totalAmount: 12500,
                bookingTime: new Date(Date.now() - 86400000 * 20).toISOString(),
                status: "COMPLETED",
                checkInStatus: "CLOSED",
                baggage: "15kg Check-in, 7kg Cabin"
            }
        ];
    };

    const filteredBookings = bookings.filter(booking => {
        if (activeFilter === "all") return true;
        if (activeFilter === "upcoming") return booking.status === "CONFIRMED";
        if (activeFilter === "completed") return booking.status === "COMPLETED";
        if (activeFilter === "cancelled") return booking.status === "CANCELLED";
        return true;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const downloadTicket = (booking) => {
        const doc = new jsPDF();
        const flight = booking.flight;
        const passenger = booking.passenger;

        // Add airline branding
        doc.setFillColor(0, 51, 102);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text("SKYWINGS AIRLINES", 105, 20, null, null, 'center');

        // Booking header
        doc.setTextColor(0);
        doc.setFontSize(18);
        doc.text("BOARDING PASS", 105, 60, null, null, 'center');

        // Booking info
        doc.setFontSize(12);
        doc.text(`Booking Reference: ${booking.id}`, 20, 80);
        doc.text(`Status: ${booking.status}`, 120, 80);

        // Flight route
        doc.setFontSize(14);
        doc.text(`${flight.departureAirport.code} → ${flight.arrivalAirport.code}`, 20, 100);
        doc.setFontSize(12);
        doc.text(`Departure: ${formatDate(flight.departureTime)} ${formatTime(flight.departureTime)}`, 20, 110);
        doc.text(`Arrival: ${formatDate(flight.arrivalTime)} ${formatTime(flight.arrivalTime)}`, 20, 120);
        doc.text(`Flight: ${flight.flightNumber} | Class: ${passenger.flightClass}`, 20, 130);

        // Passenger info
        doc.text(`Passenger: ${passenger.name || `${passenger.firstName} ${passenger.lastName}`}`, 20, 150);
        doc.text(`Seat: ${passenger.seat || 'To be assigned'}`, 120, 150);

        // Payment info
        doc.text(`Total Paid: ₹${booking.totalAmount.toLocaleString()}`, 20, 170);
        doc.text(`Payment Method: ${booking.paymentMethod}`, 120, 170);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Present this at check-in with valid photo ID", 105, 270, null, null, 'center');

        doc.save(`SkyWings-BoardingPass-${booking.id}.pdf`);
    };

    const canCancel = (bookingTime) => {
        const bookingDate = new Date(bookingTime);
        const now = new Date();
        const diffInHours = (now - bookingDate) / (1000 * 60 * 60);
        return diffInHours < 24;
    };

    const handleCancel = (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            const updatedBookings = bookings.map(b => {
                if (b.id === bookingId) {
                    return { ...b, status: "CANCELLED" };
                }
                return b;
            });

            setBookings(updatedBookings);
            // Update localStorage
            const storedBookings = JSON.parse(localStorage.getItem("skywings_bookings") || "[]");
            const updatedStoredBookings = storedBookings.map(b => {
                if (b.id === bookingId) {
                    return { ...b, status: "CANCELLED" };
                }
                return b;
            });
            localStorage.setItem("skywings_bookings", JSON.stringify(updatedStoredBookings));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3">My Bookings</h1>
                            <p className="text-blue-200 text-lg">Manage your flights and boarding passes</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-3xl font-black">{bookings.length}</div>
                                <div className="text-blue-200 text-sm">Total Bookings</div>
                            </div>
                            <div className="h-12 w-px bg-white/20"></div>
                            <Link
                                to="/flights"
                                className="px-6 py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                            >
                                <Plane className="w-4 h-4" />
                                Book New Flight
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {bookings.filter(b => b.status === 'CONFIRMED').length}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Upcoming</div>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {bookings.filter(b => b.status === 'COMPLETED').length}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {bookings.filter(b => b.paymentMethod === 'Credit Card').length}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Card Payments</div>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Total Spent</div>
                            </div>
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <Ticket className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-8 border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveFilter("all")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === "all"
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        >
                            All Bookings ({bookings.length})
                        </button>
                        <button
                            onClick={() => setActiveFilter("upcoming")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === "upcoming"
                                ? "bg-green-600 text-white"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        >
                            Upcoming ({bookings.filter(b => b.status === "CONFIRMED").length})
                        </button>
                        <button
                            onClick={() => setActiveFilter("completed")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === "completed"
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        >
                            Completed ({bookings.filter(b => b.status === "COMPLETED").length})
                        </button>
                        <button
                            onClick={() => setActiveFilter("cancelled")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === "cancelled"
                                ? "bg-red-600 text-white"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        >
                            Cancelled ({bookings.filter(b => b.status === "CANCELLED").length})
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Plane className="w-8 h-8 text-blue-600 animate-pulse" />
                            </div>
                        </div>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 font-medium">Loading your bookings...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                            <Ticket className="w-full h-full" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {activeFilter === "all" ? "No bookings yet" : `No ${activeFilter} bookings`}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            {activeFilter === "all"
                                ? "You haven't made any bookings yet. Start your journey by booking your first flight!"
                                : `You don't have any ${activeFilter} bookings at the moment.`
                            }
                        </p>
                        <Link
                            to="/flights"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                            <Plane className="w-4 h-4" />
                            Book Your First Flight
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredBookings.map((booking) => (
                            <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col lg:flex-row gap-8">
                                        {/* Left Side - Flight Info */}
                                        <div className="lg:w-2/3">
                                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-16 h-16 rounded-xl p-3 border shadow-sm flex items-center justify-center`}
                                                        style={{ backgroundColor: `${booking.flight.airlineLogo ? 'white' : '#0D4A8A'}10` }}>
                                                        <img
                                                            src={booking.flight.airlineLogo}
                                                            alt={booking.flight.airline}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = `https://ui-avatars.com/api/?name=${booking.flight.airline}&bold=true`;
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{booking.flight.airline}</h3>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="font-mono font-bold text-gray-600 dark:text-gray-300">
                                                                {booking.flight.flightNumber}
                                                            </span>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                                                                {booking.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="md:ml-auto">
                                                    <div className="text-3xl font-bold text-gray-900 dark:text-white">₹{booking.totalAmount.toLocaleString()}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        <CreditCard className="w-4 h-4" />
                                                        {booking.paymentMethod}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Flight Route */}
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6">
                                                <div className="flex flex-col md:flex-row items-center justify-between">
                                                    <div className="text-center md:text-left mb-4 md:mb-0">
                                                        <div className="text-3xl font-black text-gray-900 dark:text-white">{booking.flight.departureAirport.code}</div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">{booking.flight.departureAirport.city}</div>
                                                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                                            <Clock className="w-4 h-4" />
                                                            {formatTime(booking.flight.departureTime)}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-center my-4 md:my-0">
                                                        <div className="relative">
                                                            <div className="w-64 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                                                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-blue-600 border-2 border-white"></div>
                                                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-blue-600 border-2 border-white"></div>
                                                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                                <Plane className="w-5 h-5 text-blue-600 animate-pulse" />
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-2">{booking.flight.duration}</div>
                                                    </div>

                                                    <div className="text-center md:text-right">
                                                        <div className="text-3xl font-black text-gray-900 dark:text-white">{booking.flight.arrivalAirport.code}</div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">{booking.flight.arrivalAirport.city}</div>
                                                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1 justify-center md:justify-end">
                                                            <Clock className="w-4 h-4" />
                                                            {formatTime(booking.flight.arrivalTime)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Additional Info */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                        <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">Passenger</div>
                                                        <div className="font-semibold text-gray-900 dark:text-white">
                                                            {booking.passenger.name || `${booking.passenger.firstName} ${booking.passenger.lastName}`}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                        <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">Date</div>
                                                        <div className="font-semibold text-gray-900 dark:text-white">{formatDate(booking.flight.departureTime)}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                        <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">Class</div>
                                                        <div className="font-semibold text-gray-900 dark:text-white">{booking.passenger.flightClass}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                        <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">Check-in</div>
                                                        <div className={`font-semibold ${booking.checkInStatus === 'OPEN' ? 'text-green-600' : 'text-gray-500'}`}>
                                                            {booking.checkInStatus}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side - Actions */}
                                        <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-700 pt-6 lg:pt-0 lg:pl-8">
                                            <div className="space-y-4">
                                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Booking ID</span>
                                                        <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{booking.id}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        Booked on {formatDate(booking.bookingTime)}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <button
                                                        onClick={() => downloadTicket(booking)}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download Boarding Pass
                                                    </button>

                                                    {booking.status === 'CONFIRMED' && (
                                                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-lg transition-colors">
                                                            <QrCode className="w-4 h-4" />
                                                            View Digital Boarding Pass
                                                        </button>
                                                    )}

                                                    {booking.status === 'CONFIRMED' && canCancel(booking.bookingTime) && (
                                                        <button
                                                            onClick={() => handleCancel(booking.id)}
                                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold rounded-lg transition-colors"
                                                        >
                                                            Cancel Booking
                                                        </button>
                                                    )}

                                                    <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                        <span className="font-medium">Flight Details</span>
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <Info className="w-4 h-4" />
                                                        <span>Need help? Contact customer support</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No bookings message for empty state with filter active */}
                {!loading && activeFilter !== "all" && filteredBookings.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                            No {activeFilter} bookings found. Try changing your filter.
                        </p>
                        <button
                            onClick={() => setActiveFilter("all")}
                            className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View all bookings
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;