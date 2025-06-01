import { useState } from 'react';
import { useParams } from 'react-router-dom';

// Interface for future container data implementation
interface ContainerData {
  id: string;
  status: string;
  type: string;
  currentLocation: string;
  destination: string;
  estimatedArrival: string;
  containerType: string;
  contents: string;
  weight: string;
  customsStatus: string;
  containerNumber: string;
  sealNumber: string;
}

const ContainerDetails = () => {
  const { id } = useParams();
  const [containerId, setContainerId] = useState(id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ id?: string }>({});
  const [containerData, setContainerData] = useState<ContainerData | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated container data
      setContainerData({
        id: containerId,
        status: 'In Transit',
        type: 'Standard',
        currentLocation: 'Port of Entry',
        destination: 'Warehouse B',
        estimatedArrival: '2024-03-22 14:00',
        containerType: '20ft Standard',
        contents: 'General Cargo',
        weight: '15,000 kg',
        customsStatus: 'Cleared',
        containerNumber: 'CONT123456',
        sealNumber: 'SEAL789012'
      });
    } catch (error) {
      setErrors({ id: 'Error fetching container information' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col">
      <div className="w-full bg-green-600 p-8 text-white">
        <h1 className="text-3xl font-bold text-center">Container Tracking</h1>
      </div>
      
      <div className="flex-grow w-full">
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Track Your Container</h2>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label htmlFor="containerId" className="block text-sm font-medium text-gray-700">
                  Container ID
                </label>
                <input
                  type="text"
                  id="containerId"
                  value={containerId}
                  onChange={(e) => {
                    setContainerId(e.target.value);
                    setErrors(prev => ({ ...prev, id: undefined }));
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    errors.id ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your container ID (e.g., CNT123456)"
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

        {containerData && (
          <section className="w-full pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Container Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Container ID</p>
                  <p className="font-medium">{containerData.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium text-blue-600">{containerData.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{containerData.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Location</p>
                  <p className="font-medium">{containerData.currentLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="font-medium">{containerData.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Arrival</p>
                  <p className="font-medium">{containerData.estimatedArrival}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Container Type</p>
                  <p className="font-medium">{containerData.containerType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contents</p>
                  <p className="font-medium">{containerData.contents}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-medium">{containerData.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customs Status</p>
                  <p className="font-medium">{containerData.customsStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Container Number</p>
                  <p className="font-medium">{containerData.containerNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Seal Number</p>
                  <p className="font-medium">{containerData.sealNumber}</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ContainerDetails; 