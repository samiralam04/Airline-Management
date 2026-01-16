import React, { useState, useEffect, useRef } from 'react';
import AirportService from '../services/airport.service';

const AirportSearch = ({ label, onSelect, initialValue }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (initialValue) {
            // If we have an initial value (like "DEL"), we might want to fetch its details or just show it.
            // For simplicity, we assume initialValue is the code or name we want to show, 
            // or the parent manages the "selected" state and this component is just for searching.
            // Let's stick to the prompt's simplicity: This is an input.
            // But if we want to "Search", we usually type. 
            // If we select, we fill the input with the selected value.
        } else {
            setQuery('');
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
        };
    }, [wrapperRef]);

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 1) {
            AirportService.searchAirports(value).then(
                (response) => {
                    setResults(response.data);
                    setShowDropdown(true);
                },
                (error) => {
                    console.error("Error searching airports", error);
                    setResults([]);
                }
            );
        } else {
            setResults([]);
            setShowDropdown(false);
        }
    };

    const handleSelect = (airport) => {
        setQuery(`${airport.city} (${airport.code})`);
        setResults([]);
        setShowDropdown(false);
        onSelect(airport); // Pass full airport object back to parent
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label}
            </label>
            <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search City, Name or Code"
                value={query}
                onChange={handleChange}
                onFocus={() => query.length > 1 && setShowDropdown(true)}
            />

            {showDropdown && results.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1 dark:bg-gray-700 dark:border-gray-600">
                    {results.map((airport) => (
                        <li
                            key={airport.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-600 dark:text-white"
                            onClick={() => handleSelect(airport)}
                        >
                            <div className="font-semibold">{airport.city} ({airport.code})</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{airport.name}</div>
                        </li>
                    ))}
                </ul>
            )}
            {showDropdown && results.length === 0 && query.length > 1 && (
                <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 p-2 text-sm text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                    No airports found
                </div>
            )}
        </div>
    );
};

export default AirportSearch;
