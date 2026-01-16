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

const FlightService = {
  getAllFlights,
  getFlightById,
  getFlightWeather,
  getFlightDelayRisk,
};

export default FlightService;
