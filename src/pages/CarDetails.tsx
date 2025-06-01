import { useState } from 'react';
import { useParams } from 'react-router-dom';

interface CarData {
  id: string;
  status: string;
  type: string;
  currentLocation: string;
  destination: string;
  estimatedArrival: string;
  licensePlate: string;
  vin: string;
  driver: string;
  fuelLevel: string;
  registration: string;
}

const CarDetails = () => {
  const { id } = useParams();
  const [carId, setCarId] = useState(id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ id?: string }>({});
  const [carData, setCarData] = useState<CarData | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated car data
      setCarData({
        id: carId,
        status: 'In Transit',
        type: 'Delivery Truck',
        currentLocation: 'Distribution Center',
        destination: 'Warehouse A',
        estimatedArrival: '2024-03-22 14:00',
        licensePlate: 'ABC123',
        vin: '1HGCM82633A123456',
        driver: 'John Doe',
        fuelLevel: '75%',
        registration: 'Active'
      });
    } catch (error) {
      setErrors({ id: 'Error fetching vehicle information' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col">
      <div className="w-full bg-green-600 p-8 text-white">
        <h1 className="text-3xl font-bold text-center">Vehicle Tracking</h1>
      </div>
      
      <div className="flex-grow w-full">
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Track Your Vehicle</h2>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label htmlFor="carId" className="block text-sm font-medium text-gray-700">
                  Vehicle ID
                </label>
                <input
                  type="text"
                  id="carId"
                  value={carId}
                  onChange={(e) => {
                    setCarId(e.target.value);
                    setErrors(prev => ({ ...prev, id: undefined }));
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    errors.id ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your vehicle ID (e.g., VH123456)"
                  required
                />
                {errors.id && (
                  <p className="mt-1 text-sm text-red-600">{errors.id}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Tracking...' : 'Track'}
              </button>
            </form>
          </div>
        </section>

        {carData && (
          <section className="w-full pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Vehicle ID</p>
                  <p className="font-medium">{carData.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium text-blue-600">{carData.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{carData.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Location</p>
                  <p className="font-medium">{carData.currentLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="font-medium">{carData.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Arrival</p>
                  <p className="font-medium">{carData.estimatedArrival}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">License Plate</p>
                  <p className="font-medium">{carData.licensePlate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">VIN</p>
                  <p className="font-medium">{carData.vin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Driver</p>
                  <p className="font-medium">{carData.driver}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fuel Level</p>
                  <p className="font-medium">{carData.fuelLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Registration</p>
                  <p className="font-medium">{carData.registration}</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CarDetails; 