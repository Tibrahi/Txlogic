import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: string;
  estimatedTime: string;
  daysLeft: number;
}

interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  status: string;
  currentRoute: string;
  daysLeft: number;
}

const Search = () => {
  const [searchType, setSearchType] = useState<'route' | 'vehicle'>('route');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sample routes data
  const routes: Route[] = [
    {
      id: 'R001',
      name: 'Coastal Express',
      from: 'Los Angeles',
      to: 'San Francisco',
      distance: '382 miles',
      estimatedTime: '6 hours',
      daysLeft: 3
    },
    {
      id: 'R002',
      name: 'Mountain Route',
      from: 'Denver',
      to: 'Salt Lake City',
      distance: '525 miles',
      estimatedTime: '8 hours',
      daysLeft: 5
    },
    {
      id: 'R003',
      name: 'Desert Highway',
      from: 'Phoenix',
      to: 'Las Vegas',
      distance: '297 miles',
      estimatedTime: '4.5 hours',
      daysLeft: 2
    }
  ];

  // Sample vehicles data
  const vehicles: Vehicle[] = [
    {
      id: 'V001',
      plateNumber: 'ABC-1234',
      type: 'Delivery Van',
      status: 'In Transit',
      currentRoute: 'Coastal Express',
      daysLeft: 3
    },
    {
      id: 'V002',
      plateNumber: 'XYZ-5678',
      type: 'Truck',
      status: 'At Depot',
      currentRoute: 'Mountain Route',
      daysLeft: 5
    },
    {
      id: 'V003',
      plateNumber: 'DEF-9012',
      type: 'Refrigerated Truck',
      status: 'In Transit',
      currentRoute: 'Desert Highway',
      daysLeft: 2
    }
  ];

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.currentRoute.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRouteSelect = (route: Route) => {
    setSelectedRoute(route);
    setSelectedVehicle(null);
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedRoute(null);
  };

  return (
    <div className="w-screen min-h-screen flex flex-col">
      <div className="w-full bg-green-600 p-8 text-white">
        <h1 className="text-3xl font-bold text-center">Search Routes & Vehicles</h1>
      </div>
      
      <div className="flex-grow w-full">
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setSearchType('route')}
                className={`px-4 py-2 rounded-md ${
                  searchType === 'route'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Search Routes
              </button>
              <button
                onClick={() => setSearchType('vehicle')}
                className={`px-4 py-2 rounded-md ${
                  searchType === 'vehicle'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Search Vehicles
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  {searchType === 'route' ? 'Search Routes' : 'Search by Vehicle Plate Number'}
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder={searchType === 'route' ? 'Enter route name, origin, or destination' : 'Enter vehicle plate number'}
                />
              </div>

              {searchType === 'route' ? (
                <div className="space-y-4">
                  {filteredRoutes.map(route => (
                    <div
                      key={route.id}
                      onClick={() => handleRouteSelect(route)}
                      className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedRoute?.id === route.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{route.name}</h3>
                          <p className="text-sm text-gray-600">
                            {route.from} → {route.to}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{route.distance}</p>
                          <p className="text-sm text-gray-600">{route.estimatedTime}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {route.daysLeft} days left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredVehicles.map(vehicle => (
                    <div
                      key={vehicle.id}
                      onClick={() => handleVehicleSelect(vehicle)}
                      className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedVehicle?.id === vehicle.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{vehicle.plateNumber}</h3>
                          <p className="text-sm text-gray-600">{vehicle.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{vehicle.currentRoute}</p>
                          <p className="text-sm text-gray-600">{vehicle.status}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {vehicle.daysLeft} days left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(selectedRoute || selectedVehicle) && (
              <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Selected Details</h2>
                {selectedRoute && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Route Name</p>
                      <p className="font-medium">{selectedRoute.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">From</p>
                      <p className="font-medium">{selectedRoute.from}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">To</p>
                      <p className="font-medium">{selectedRoute.to}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Distance</p>
                      <p className="font-medium">{selectedRoute.distance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Time</p>
                      <p className="font-medium">{selectedRoute.estimatedTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Days Left</p>
                      <p className="font-medium">{selectedRoute.daysLeft}</p>
                    </div>
                  </div>
                )}
                {selectedVehicle && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Plate Number</p>
                      <p className="font-medium">{selectedVehicle.plateNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium">{selectedVehicle.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">{selectedVehicle.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Route</p>
                      <p className="font-medium">{selectedVehicle.currentRoute}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Days Left</p>
                      <p className="font-medium">{selectedVehicle.daysLeft}</p>
                    </div>
                  </div>
                )}
                <div className="mt-6">
                  <Link
                    to={selectedRoute ? `/route/${selectedRoute.id}` : `/car/${selectedVehicle?.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Search; 