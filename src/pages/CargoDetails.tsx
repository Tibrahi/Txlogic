import { useState } from 'react';
import { useParams } from 'react-router-dom';

interface CargoData {
  id: string;
  status: string;
  type: string;
  currentLocation: string;
  destination: string;
  estimatedArrival: string;
  weight: string;
  dimensions: string;
  cargoType: string;
  insurance: string;
  hazardousMaterials: string;
  customsDeclaration: string;
}

interface ValidationErrors {
  id?: string;
  weight?: string;
  dimensions?: string;
}

const CargoDetails = () => {
  const { id } = useParams();
  const [cargoId, setCargoId] = useState(id || '');
  const [cargoData, setCargoData] = useState<CargoData | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateCargoId = (id: string): boolean => {
    // Cargo ID format: CRG followed by 6 digits
    const cargoIdRegex = /^CRG\d{6}$/;
    if (!cargoIdRegex.test(id)) {
      setErrors(prev => ({
        ...prev,
        id: 'Invalid cargo ID format. Expected format: CRG123456'
      }));
      return false;
    }
    return true;
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Validate cargo ID
    if (!validateCargoId(cargoId)) {
      setIsLoading(false);
      return;
    }

    try {
      // Simulated API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulated cargo data - in real app, this would come from an API
      const newCargoData: CargoData = {
        id: cargoId,
        status: 'In Transit',
        type: 'General Cargo',
        currentLocation: 'Distribution Center',
        destination: 'Warehouse A',
        estimatedArrival: '2024-03-22 14:00',
        weight: '5,000 kg',
        dimensions: '40x20x10 ft',
        cargoType: 'Dry Goods',
        insurance: 'Standard Coverage',
        hazardousMaterials: 'No',
        customsDeclaration: 'Completed'
      };

      // Validate the received data
      if (!/^\d{1,3}(,\d{3})*\s*kg$/.test(newCargoData.weight)) {
        setErrors(prev => ({
          ...prev,
          weight: 'Invalid weight format. Expected format: 5,000 kg'
        }));
        return;
      }

      if (!/^\d+x\d+x\d+\s*ft$/.test(newCargoData.dimensions)) {
        setErrors(prev => ({
          ...prev,
          dimensions: 'Invalid dimensions format. Expected format: 40x20x10 ft'
        }));
        return;
      }

      setCargoData(newCargoData);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        id: 'Error fetching cargo information. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col">
      <div className="w-full bg-green-600 p-8 text-white">
        <h1 className="text-3xl font-bold text-center">Cargo Tracking</h1>
      </div>
      
      <div className="flex-grow w-full">
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Track Your Cargo</h2>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label htmlFor="cargoId" className="block text-sm font-medium text-gray-700">
                  Cargo ID
                </label>
                <input
                  type="text"
                  id="cargoId"
                  value={cargoId}
                  onChange={(e) => {
                    setCargoId(e.target.value);
                    setErrors(prev => ({ ...prev, id: undefined }));
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    errors.id ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your cargo ID (e.g., CRG123456)"
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

        {cargoData && (
          <section className="w-full pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Cargo Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Cargo ID</p>
                  <p className="font-medium">{cargoData.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium text-green-600">{cargoData.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{cargoData.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Location</p>
                  <p className="font-medium">{cargoData.currentLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="font-medium">{cargoData.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Arrival</p>
                  <p className="font-medium">{cargoData.estimatedArrival}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-medium">{cargoData.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dimensions</p>
                  <p className="font-medium">{cargoData.dimensions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cargo Type</p>
                  <p className="font-medium">{cargoData.cargoType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Insurance</p>
                  <p className="font-medium">{cargoData.insurance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hazardous Materials</p>
                  <p className="font-medium">{cargoData.hazardousMaterials}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customs Declaration</p>
                  <p className="font-medium">{cargoData.customsDeclaration}</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CargoDetails; 