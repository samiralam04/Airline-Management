import { useNavigate } from "react-router-dom";

const FeaturedDestinations = () => {
  const navigate = useNavigate();

  const destinations = [
    {
      id: 1,
      city: "Paris",
      country: "France",
      price: "₹45,000",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Experience the romance and culture of the City of Light.",
    },
    {
      id: 2,
      city: "Tokyo",
      country: "Japan",
      price: "₹85,000",
      image:
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description:
        "Discover the perfect blend of tradition and futuristic technology.",
    },
    {
      id: 3,
      city: "New York",
      country: "USA",
      price: "₹30,000",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Explore the concrete jungle where dreams are made of.",
    },
    {
      id: 4,
      city: "Dubai",
      country: "UAE",
      price: "₹60,000",
      image:
        "https://img.veenaworld.com/group-tours/world/dubai-egypt-israel/meza/meza-thb-meza-12112022.jpg?imWidth=300",
      description:
        "Witness the architectural marvels and luxury of the desert.",
    },
    {
      id: 5,
      city: "Sydney",
      country: "Australia",
      price: "₹90,000",
      image:
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Enjoy stunning beaches and the iconic Opera House.",
    },
    {
      id: 6,
      city: "Rome",
      country: "Italy",
      price: "₹50,000",
      image:
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Walk through history in the Eternal City.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Destinations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our most popular destinations at unbeatable prices. Your
            next adventure is just a click away.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.city}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold text-gray-900 dark:text-white shadow-sm">
                  From {destination.price}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {destination.city}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {destination.country}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                  {destination.description}
                </p>

                <button
                  onClick={() => navigate("/flights")}
                  className="w-full bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 group-hover:gap-3"
                >
                  Book Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 transition-all"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
