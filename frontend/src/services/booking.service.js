import api from "./api";

const createBooking = (userId, flightId, seatId) => {
  return api.post("/bookings", {
    user: { id: userId },
    flight: { id: flightId },
    seat: seatId ? { id: seatId } : null,
    status: "CONFIRMED"
  });
};

const getUserBookings = (userId) => {
  return api.get(`/bookings/user/${userId}`);
};

const BookingService = {
  createBooking,
  getUserBookings,
};

export default BookingService;
