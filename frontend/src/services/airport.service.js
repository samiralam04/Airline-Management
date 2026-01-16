import api from "./api";

const getAllAirports = () => {
    return api.get("/airports");
};

const searchAirports = (query) => {
    return api.get(`/airports/search?q=${query}`);
};

const AirportService = {
    getAllAirports,
    searchAirports
};

export default AirportService;
