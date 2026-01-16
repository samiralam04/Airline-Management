import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FlightSearch from "./pages/FlightSearch";
import FlightDetails from "./pages/FlightDetails";
import BookingConfirm from "./pages/BookingConfirm";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<FlightSearch />} />
          <Route path="/flights/:id" element={<FlightDetails />} />
          <Route path="/booking/confirm/:flightId" element={<BookingConfirm />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

const Home = () => (
  <div className="text-center mt-20">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to SkyWings Airline Management</h1>
    <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">Your journey begins here.</p>
    <a href="/flights" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-lg px-6 py-3 dark:bg-blue-600 dark:hover:bg-blue-700">
      Search Flights
    </a>
  </div>
);

export default App;
