import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { generateTicketPDF } from "../utils/pdfUtils";
import { QRCodeSVG } from "qrcode.react";
import Confetti from "react-confetti";

const BookingConfirm = () => {
    const { flightId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // State for Steps: 1=Passenger, 2=Payment, 3=Success
    const [step, setStep] = useState(1);
    const [flight, setFlight] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    // Passenger Details
    const [passenger, setPassenger] = useState({
        firstName: "",
        lastName: "",
        age: "",
        gender: "Male",
        flightClass: "Economy",
        email: "",
        phone: ""
    });

    // Payment Details
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [cardDetails, setCardDetails] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: ""
    });

    useEffect(() => {
        if (location.state?.flight) {
            setFlight(location.state.flight);
        } else {
            navigate("/flights");
        }

        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [location, navigate]);

    // Calculate total price
    const calculateTotal = () => {
        if (!flight) return 0;
        let price = flight.price;
        if (passenger.flightClass === "Business") price *= 1.8;
        if (passenger.flightClass === "First") price *= 2.5;
        return Math.round(price);
    };

    const handlePassengerChange = (e) => {
        setPassenger({ ...passenger, [e.target.name]: e.target.value });
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "number") {
            formattedValue = value.replace(/\D/g, '').slice(0, 16);
            if (formattedValue.length > 0) {
                formattedValue = formattedValue.match(/.{1,4}/g).join(' ');
            }
        } else if (name === "expiry") {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
            if (formattedValue.length > 2) {
                formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
            }
        } else if (name === "cvv") {
            formattedValue = value.replace(/\D/g, '').slice(0, 3);
        }

        setCardDetails({ ...cardDetails, [name]: formattedValue });
    };

    const handlePayment = (e) => {
        e.preventDefault();

        // Simple validation
        if (paymentMethod === "card") {
            if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
                alert("Please fill all card details");
                return;
            }
            if (cardDetails.number.replace(/\s/g, '').length !== 16) {
                alert("Please enter a valid 16-digit card number");
                return;
            }
        }

        // Show processing state
        const submitBtn = e.target;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Processing...";
        submitBtn.disabled = true;

        setTimeout(() => {
            setStep(3);
            setShowConfetti(true);

            // Create booking
            const bookingId = `SKY${Date.now().toString().slice(-8)}`;
            const bookingData = {
                id: bookingId,
                flight: flight,
                passenger: passenger,
                paymentMethod: paymentMethod,
                totalAmount: calculateTotal(),
                bookingTime: new Date().toISOString(),
                status: "CONFIRMED"
            };

            // Save to localStorage
            const bookings = JSON.parse(localStorage.getItem("skywings_bookings") || "[]");
            bookings.push(bookingData);
            localStorage.setItem("skywings_bookings", JSON.stringify(bookings));

            // Reset button after delay
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);

            // Hide confetti after 5 seconds
            setTimeout(() => setShowConfetti(false), 5000);
        }, 2000);
    };

    const downloadTicket = () => {
        if (!flight) return;

        const bookingData = {
            id: `SKY${Date.now().toString().slice(-8)}`, // Generate a temporary ID if not saved yet, or use saved one
            flight: flight,
            passenger: passenger,
            paymentMethod: paymentMethod,
            totalAmount: calculateTotal(),
            bookingTime: new Date().toISOString(),
            status: "CONFIRMED",
            baggage: "15kg Check-in, 7kg Cabin"
        };

        generateTicketPDF(bookingData);
    };

    if (!flight) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading flight details...</p>
                </div>
            </div>
        );
    }

    const fareBreakdown = {
        baseFare: flight.price,
        classMultiplier: passenger.flightClass === "Business" ? 1.8 : passenger.flightClass === "First" ? 2.5 : 1,
        taxes: Math.round(flight.price * 0.18),
        convenienceFee: 99
    };

    const total = calculateTotal();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
            {showConfetti && (
                <Confetti
                    width={windowDimensions.width}
                    height={windowDimensions.height}
                    recycle={false}
                    numberOfPieces={200}
                />
            )}

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                        Complete Your Booking
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Secure your seat in just a few steps
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between relative max-w-3xl mx-auto">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10 transform -translate-y-1/2"></div>
                        <div className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 -z-10 transform -translate-y-1/2 transition-all duration-500"
                            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>

                        {[1, 2, 3].map((stepNum) => (
                            <div key={stepNum} className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 
                                    ${step >= stepNum ? 'border-blue-500 bg-white text-blue-500 shadow-lg scale-110' : 'border-gray-200 bg-white text-gray-400'}`}>
                                    {stepNum === 1 ? '👤' : stepNum === 2 ? '💳' : '✅'}
                                </div>
                                <span className={`mt-3 text-sm font-semibold ${step >= stepNum ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                    {stepNum === 1 ? 'Details' : stepNum === 2 ? 'Payment' : 'Confirm'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Flight Summary (Always visible) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Step 1: Passenger Details */}
                        {step === 1 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-fade-in">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        Passenger Information
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Enter details as they appear on your government ID
                                    </p>
                                </div>

                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={passenger.firstName}
                                                onChange={handlePassengerChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={passenger.lastName}
                                                onChange={handlePassengerChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Age *
                                            </label>
                                            <input
                                                type="number"
                                                name="age"
                                                value={passenger.age}
                                                onChange={handlePassengerChange}
                                                min="1"
                                                max="120"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Gender
                                            </label>
                                            <select
                                                name="gender"
                                                value={passenger.gender}
                                                onChange={handlePassengerChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Class *
                                            </label>
                                            <select
                                                name="flightClass"
                                                value={passenger.flightClass}
                                                onChange={handlePassengerChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="Economy">Economy</option>
                                                <option value="Business">Business (+80%)</option>
                                                <option value="First">First Class (+150%)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={passenger.email}
                                                onChange={handlePassengerChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={passenger.phone}
                                                onChange={handlePassengerChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </form>

                                <div className="flex justify-between pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => navigate("/flights")}
                                        className="px-6 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
                                    >
                                        ← Back to Search
                                    </button>
                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!passenger.firstName || !passenger.lastName || !passenger.age || !passenger.email || !passenger.phone}
                                        className={`px-8 py-3 rounded-lg font-semibold transition-all ${!passenger.firstName || !passenger.lastName || !passenger.age || !passenger.email || !passenger.phone
                                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                                            }`}
                                    >
                                        Continue to Payment →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-fade-in">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        Payment Method
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Choose your preferred payment option
                                    </p>
                                </div>

                                {/* Payment Method Selection */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    {[
                                        { id: 'card', label: 'Card', icon: '💳' },
                                        { id: 'upi', label: 'UPI', icon: '📱' },
                                        { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
                                        { id: 'wallet', label: 'Wallet', icon: '👛' }
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${paymentMethod === method.id
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-md'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                        >
                                            <span className="text-2xl mb-2">{method.icon}</span>
                                            <span className="font-medium">{method.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Card Details Form */}
                                {paymentMethod === 'card' && (
                                    <form className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                name="number"
                                                value={cardDetails.number}
                                                onChange={handleCardChange}
                                                placeholder="1234 5678 9012 3456"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Cardholder Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={cardDetails.name}
                                                onChange={handleCardChange}
                                                placeholder="John Doe"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="text"
                                                    name="expiry"
                                                    value={cardDetails.expiry}
                                                    onChange={handleCardChange}
                                                    placeholder="MM/YY"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    CVV
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    value={cardDetails.cvv}
                                                    onChange={handleCardChange}
                                                    placeholder="123"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
                                                        <div className="w-6 h-4 bg-yellow-500 rounded-sm"></div>
                                                        <div className="w-6 h-4 bg-blue-500 rounded-sm"></div>
                                                    </div>
                                                    <span className="mt-1 block">Secure 3D Payment</span>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                {/* UPI QR Code */}
                                {paymentMethod === 'upi' && (
                                    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">
                                            Scan QR Code to Pay
                                        </p>
                                        <div className="p-4 bg-white rounded-lg shadow-lg">
                                            <QRCodeSVG
                                                value={`upi://pay?pa=skywings@upi&pn=SkyWings%20Airlines&am=${total}&cu=INR`}
                                                size={200}
                                            />
                                        </div>
                                        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                                            Scan with any UPI app to complete payment
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-between pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-6 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
                                    >
                                        ← Back to Details
                                    </button>
                                    <button
                                        onClick={handlePayment}
                                        className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                                    >
                                        Pay ₹{total.toLocaleString()} Now
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Success */}
                        {step === 3 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-fade-in">
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        Booking Confirmed!
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Your tickets have been booked successfully
                                    </p>
                                </div>

                                {/* Ticket Preview */}
                                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-6 mb-8 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <div className="text-sm opacity-80">Booking Reference</div>
                                                <div className="text-2xl font-bold">SKY{Date.now().toString().slice(-8)}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm opacity-80">Status</div>
                                                <div className="text-green-400 font-semibold">✓ CONFIRMED</div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                                            <div>
                                                <div className="text-sm opacity-80">Passenger</div>
                                                <div className="text-lg font-semibold">{passenger.firstName} {passenger.lastName}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm opacity-80">Flight</div>
                                                <div className="text-lg font-semibold">{flight.flightNumber}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm opacity-80">Class</div>
                                                <div className="text-lg font-semibold">{passenger.flightClass}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{flight.departureAirport.code}</div>
                                                <div className="text-sm opacity-80">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </div>
                                            <div className="flex-1 px-4">
                                                <div className="relative">
                                                    <div className="h-1 bg-white/30 rounded-full"></div>
                                                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-white"></div>
                                                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                        </svg>
                                                    </div>
                                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-white"></div>
                                                </div>
                                                <div className="text-center text-sm mt-2 opacity-80">{flight.duration}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{flight.arrivalAirport.code}</div>
                                                <div className="text-sm opacity-80">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={downloadTicket}
                                        className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download E-Ticket
                                    </button>
                                    <button
                                        onClick={() => navigate("/flights")}
                                        className="flex-1 px-6 py-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Book Another Flight
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Flight Summary & Price Breakdown */}
                    <div className="space-y-6">
                        {/* Flight Summary Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Flight Summary</h3>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-gray-700 flex items-center justify-center">
                                    <img
                                        src={flight.airlineLogo}
                                        alt={flight.airline}
                                        className="w-8 h-8 object-contain"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/32?text=✈️";
                                        }}
                                    />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white">{flight.airline}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{flight.flightNumber}</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{flight.departureAirport.code}</div>
                                        <div className="text-sm text-gray-500">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500 mb-1">{flight.duration}</div>
                                        <div className="relative w-32">
                                            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">{flight.isConnecting ? "1 Stop" : "Non-stop"}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{flight.arrivalAirport.code}</div>
                                        <div className="text-sm text-gray-500">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <div className="text-sm text-gray-500 mb-2">Date</div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {new Date(flight.departureTime).toLocaleDateString('en-IN', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Price Breakdown</h3>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Base Fare</span>
                                    <span>₹{fareBreakdown.baseFare.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Class ({passenger.flightClass})</span>
                                    <span>{passenger.flightClass === "Business" ? "+80%" : passenger.flightClass === "First" ? "+150%" : "Standard"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Taxes & Fees</span>
                                    <span>₹{fareBreakdown.taxes.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Convenience Fee</span>
                                    <span>₹{fareBreakdown.convenienceFee}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{total.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">Inclusive of all taxes</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="flex items-center text-sm text-green-700 dark:text-green-400">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Free cancellation within 24 hours
                                </div>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white">Secure Booking</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">SSL Encrypted Payment</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Your payment details are protected with 256-bit encryption. We never store your card information.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirm;