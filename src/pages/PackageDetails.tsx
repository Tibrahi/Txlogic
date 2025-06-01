import { useState } from 'react';
import { useParams } from 'react-router-dom';

interface PackageData {
  id: string;
  status: string;
  type: string;
  currentLocation: string;
  destination: string;
  estimatedArrival: string;
  weight: string;
  dimensions: string;
  serviceType: string;
  signatureRequired: string;
  trackingNumber: string;
  barcode: string;
}

const PackageDetails = () => {
  const { id } = useParams();
  const [packageId, setPackageId] = useState(id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ id?: string }>({});

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="w-screen min-h-screen flex flex-col">
      <div className="w-full bg-green-600 p-8 text-white">
        <h1 className="text-3xl font-bold text-center">Package Tracking</h1>
      </div>
      
      <div className="flex-grow w-full">
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Track Your Package</h2>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label htmlFor="packageId" className="block text-sm font-medium text-gray-700">
                  Package ID
                </label>
                <input
                  type="text"
                  id="packageId"
                  value={packageId}
                  onChange={(e) => {
                    setPackageId(e.target.value);
                    setErrors(prev => ({ ...prev, id: undefined }));
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    errors.id ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your package ID (e.g., PKG123456)"
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
      </div>
    </div>
  );
};

export default PackageDetails; 