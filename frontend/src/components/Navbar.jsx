import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";
import {
    Plane,
    User,
    LogOut,
    LogIn,
    UserPlus,
    Home,
    Ticket,
    Shield,
    Menu,
    X,
    ChevronDown,
    Bell,
    Settings,
    UserCircle,
    Briefcase
} from "lucide-react";

const Navbar = () => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    useEffect(() => {
        // Close mobile menu when route changes
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
    }, [location.pathname]);

    const logOut = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        setUserDropdownOpen(false);
        navigate("/login");
    };

    const navLinks = [
        { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
        { path: "/flights", label: "Flights", icon: <Plane className="w-4 h-4" /> },
        { path: "/bookings", label: "My Bookings", icon: <Ticket className="w-4 h-4" /> },
    ];

    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-xl backdrop-blur-md bg-opacity-95">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-all">
                                <Plane className="w-6 h-6 transform group-hover:rotate-12 transition-transform" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                    SkyWings
                                </h1>
                                <p className="text-xs text-blue-200 opacity-80">Premium Air Travel</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive(link.path)
                                        ? "bg-white/10 text-white backdrop-blur-sm"
                                        : "text-blue-100 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    {link.icon}
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            ))}

                            {currentUser?.roles?.includes("ROLE_ADMIN") && (
                                <Link
                                    to="/admin"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-amber-100 hover:bg-amber-500/20 hover:text-amber-50"
                                >
                                    <Shield className="w-4 h-4" />
                                    <span className="font-medium">Admin</span>
                                </Link>
                            )}
                        </div>

                        {/* User Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            {currentUser ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all group"
                                    >
                                        <div className="relative">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-900"></div>
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-sm">{currentUser.username}</div>
                                            <div className="text-xs text-blue-200 opacity-80">Premium Member</div>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* User Dropdown */}
                                    {userDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in">
                                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                                                        <UserCircle className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-white">{currentUser.username}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">{currentUser.email}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="py-2">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <User className="w-4 h-4" />
                                                    My Profile
                                                </Link>
                                                <Link
                                                    to="/bookings"
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <Ticket className="w-4 h-4" />
                                                    My Bookings
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    Settings
                                                </Link>

                                                {currentUser?.roles?.includes("ROLE_ADMIN") && (
                                                    <Link
                                                        to="/admin"
                                                        className="flex items-center gap-3 px-4 py-3 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                                                    >
                                                        <Shield className="w-4 h-4" />
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="border-t border-gray-100 dark:border-gray-700">
                                                <button
                                                    onClick={logOut}
                                                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-blue-100 hover:bg-white/10 transition-colors"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span className="font-medium">Login</span>
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        <span>Sign Up</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden animate-slide-down">
                        <div className="px-4 pt-2 pb-4 space-y-2 bg-gradient-to-b from-blue-800/95 to-indigo-900/95 backdrop-blur-lg border-t border-white/10">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(link.path)
                                        ? "bg-white/10 text-white"
                                        : "text-blue-100 hover:bg-white/5"
                                        }`}
                                >
                                    {link.icon}
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            ))}

                            {currentUser?.roles?.includes("ROLE_ADMIN") && (
                                <Link
                                    to="/admin"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-100 hover:bg-amber-500/20 transition-colors"
                                >
                                    <Shield className="w-4 h-4" />
                                    <span className="font-medium">Admin Dashboard</span>
                                </Link>
                            )}

                            <div className="pt-4 border-t border-white/10">
                                {currentUser ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 px-4 py-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">{currentUser.username}</div>
                                                <div className="text-sm text-blue-200 opacity-80">Premium Member</div>
                                            </div>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-white/10 rounded-xl transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-white/10 rounded-xl transition-colors"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </Link>

                                        <button
                                            onClick={logOut}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-red-500/20 rounded-xl transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Link
                                            to="/login"
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg transition-all"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Sign Up Free
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Backdrop for user dropdown */}
            {userDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                />
            )}
        </>
    );
};

export default Navbar;