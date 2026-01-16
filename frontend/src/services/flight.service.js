import api from "./api";

const getAllFlights = () => {
  return api.get("/flights");
};

const getFlightById = (id) => {
  return api.get(`/flights/${id}`);
};

const getFlightWeather = (id) => {
  return api.get(`/flights/${id}/weather`);
};

const getFlightDelayRisk = (id) => {
  return api.get(`/flights/${id}/delay-risk`);
};

const searchFlights = (origin, destination, date) => {
  return api.get(`/flights/search?origin=${origin}&destination=${destination}&date=${date}`);
};

const FlightService = {
  getAllFlights,
  getFlightById,
  getFlightWeather,
  getFlightDelayRisk,
  searchFlights,
};

export default FlightService;
