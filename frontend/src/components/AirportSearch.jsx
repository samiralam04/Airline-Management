import React, { useState, useEffect, useRef } from "react";
import AirportService from "../services/airport.service";
import { Search, Plane, MapPin, Navigation, X } from "lucide-react";

const AirportSearch = ({
  label,
  onSelect,
  initialValue,
  className = "",
  showSelectedDetails = true,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimeout = useRef(null);

  // Mock popular airports for quick selection

  const popularAirports = [
    {
      code: "DEL",
      city: "Delhi",
      name: "Indira Gandhi International Airport",
      country: "India",
    },
    {
      code: "BOM",
      city: "Mumbai",
      name: "Chhatrapati Shivaji Maharaj International Airport",
      country: "India",
    },
    {
      code: "BLR",
      city: "Bengaluru",
      name: "Kempegowda International Airport",
      country: "India",
    },
    {
      code: "MAA",
      city: "Chennai",
      name: "Chennai International Airport",
      country: "India",
    },
    {
      code: "HYD",
      city: "Hyderabad",
      name: "Rajiv Gandhi International Airport",
      country: "India",
    },
    {
      code: "CCU",
      city: "Kolkata",
      name: "Netaji Subhash Chandra Bose International Airport",
      country: "India",
    },
    {
      code: "AMD",
      city: "Ahmedabad",
      name: "Sardar Vallabhbhai Patel International Airport",
      country: "India",
    },
    { code: "GOI", city: "Goa", name: "Dabolim Airport", country: "India" },
    {
      code: "PAT",
      city: "Patna",
      name: "Jay Prakash Narayan Airport",
      country: "India",
    },
    { code: "PNQ", city: "Pune", name: "Pune Airport", country: "India" },
    {
      code: "COK",
      city: "Kochi",
      name: "Cochin International Airport",
      country: "India",
    },
    {
      code: "JAI",
      city: "Jaipur",
      name: "Jaipur International Airport",
      country: "India",
    },
    {
      code: "SXR",
      city: "Srinagar",
      name: "Sheikh ul-Alam International Airport",
      country: "India",
    },
    {
      code: "GAU",
      city: "Guwahati",
      name: "Lokpriya Gopinath Bordoloi International Airport",
      country: "India",
    },
    {
      code: "LKO",
      city: "Lucknow",
      name: "Chaudhary Charan Singh International Airport",
      country: "India",
    },
  ];

  useEffect(() => {
    if (initialValue) {
      if (typeof initialValue === "object" && initialValue.code) {
        setSelectedAirport(initialValue);
        setQuery(`${initialValue.city} (${initialValue.code})`);
      } else if (typeof initialValue === "string") {
        setQuery(initialValue);
      }
    }
  }, [initialValue]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [wrapperRef]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedAirport(null);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (value.trim().length > 0) {
      setLoading(true);
      debounceTimeout.current = setTimeout(async () => {
        try {
          const response = await AirportService.searchAirports(value);

          // Patch data: Rename Mopa (GOX) to Goa for better UX
          const patchedData = response.data.map((airport) => {
            if (airport.code === "GOX") {
              return {
                ...airport,
                city: "Goa",
                name: "Manohar International Airport (New Goa)",
              };
            }
            return airport;
          });

          // Sort results: Code match > India & StartsWith > StartsWith > India > Others
          const sortedResults = patchedData.sort((a, b) => {
            const q = value.toLowerCase();

            const aCode = a.code.toLowerCase();
            const bCode = b.code.toLowerCase();

            const aCity = a.city.toLowerCase();
            const bCity = b.city.toLowerCase();

            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();

            const aIsIndia = a.country === "IN" || a.country === "India";
            const bIsIndia = b.country === "IN" || b.country === "India";

            // Helper flags
            const aStarts =
              aCity.startsWith(q) || aName.startsWith(q) || aCode.startsWith(q);
            const bStarts =
              bCity.startsWith(q) || bName.startsWith(q) || bCode.startsWith(q);

            const aContains =
              aCity.includes(q) || aName.includes(q) || aCode.includes(q);
            const bContains =
              bCity.includes(q) || bName.includes(q) || bCode.includes(q);

            // 1. Exact code match
            if (aCode === q && bCode !== q) return -1;
            if (bCode === q && aCode !== q) return 1;

            // 2. Starts with query + Domestic first
            if (aStarts && bStarts) {
              if (aIsIndia && !bIsIndia) return -1;
              if (!aIsIndia && bIsIndia) return 1;
              return 0;
            }

            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            // 3. Contains query + Domestic first
            if (aContains && bContains) {
              if (aIsIndia && !bIsIndia) return -1;
              if (!aIsIndia && bIsIndia) return 1;
              return 0;
            }

            if (aContains && !bContains) return -1;
            if (!aContains && bContains) return 1;

            // 4. Fallback → Domestic always above International
            if (aIsIndia && !bIsIndia) return -1;
            if (!aIsIndia && bIsIndia) return 1;

            return 0;
          });

          setResults(sortedResults);
        } catch (error) {
          console.error("Error fetching airports:", error);
          // Fallback to local search
          const localResults = popularAirports.filter(
            (airport) =>
              airport.city.toLowerCase().includes(value.toLowerCase()) ||
              airport.code.toLowerCase().includes(value.toLowerCase()) ||
              airport.name.toLowerCase().includes(value.toLowerCase()),
          );
          setResults(localResults);
        } finally {
          setLoading(false);
          setShowDropdown(true);
        }
      }, 300);
    } else {
      setResults([]);
      setShowDropdown(false);
      setLoading(false);
    }
  };

  const handleSelect = (airport) => {
    setSelectedAirport(airport);
    setQuery(`${airport.city} (${airport.code})`);
    setShowDropdown(false);
    onSelect(airport);
    // Blur input after selection
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleClear = () => {
    setQuery("");
    setSelectedAirport(null);
    setResults([]);
    setShowDropdown(false);
    onSelect(null);
    // Focus input after clear
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFocus = () => {
    if (query.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {/* Label - Rendered only if label prop is provided (not empty) */}
      {label && (
        <div className="mb-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </label>
        </div>
      )}

      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-lg font-medium"
          placeholder={
            label === "From"
              ? "Departure city or airport"
              : "Arrival city or airport"
          }
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {/* Loading indicator */}
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500"></div>
          )}

          {/* Clear Button or Plane Icon */}
          {selectedAirport || query.length > 0 ? (
            <button
              onClick={handleClear}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center">
              <Plane className="w-5 h-5 text-gray-300" />
            </div>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Search Query Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Search className="w-4 h-4" />
              <span>Search results for "{query}"</span>
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto">
            {results.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {results.map((airport) => (
                  <div
                    key={airport.id}
                    className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors group"
                    onClick={() => handleSelect(airport)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {airport.city}
                          </div>
                          <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-md text-xs font-bold">
                            {airport.code}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {airport.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {airport.country}
                        </div>
                      </div>
                      <Navigation className="w-4 h-4 text-gray-300 group-hover:text-blue-500 dark:text-gray-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !loading && query.length > 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                  <Search className="w-full h-full" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  No airports found
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Try searching with a different city or airport code
                </p>
              </div>
            ) : null}
          </div>

          {/* Popular Airports Section (shown only when no query or few results) */}
          {(!query || query.length <= 1) && (
            <div className="border-t border-gray-100 dark:border-gray-700">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Popular Airports
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {popularAirports.map((airport, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelect(airport)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left group"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                          {airport.code}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {airport.city}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                          {airport.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Search by city name, airport code, or airport name</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Airport Info (when dropdown is hidden) */}
      {showSelectedDetails && selectedAirport && !showDropdown && (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border border-blue-100 dark:border-blue-800">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-gray-900 dark:text-white">
                  {selectedAirport.city}
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-md text-xs font-bold">
                  {selectedAirport.code}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedAirport.name}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportSearch;
