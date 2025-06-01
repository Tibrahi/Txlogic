import { useState } from 'react';
import { Link } from 'react-router-dom';

interface TrackingItem {
  id: string;
  type: 'cargo' | 'container' | 'package' | 'vehicle';
  status: string;
  currentLocation: string;
  destination: string;
  estimatedArrival: string;
  progress: number;
  purchaseDate: string;
  purchaseLocation: string;
  price: string;
  additionalInfo: {
    [key: string]: string;
  };
  validation: {
    isValid: boolean;
    errors?: string[];
  };
}

const TrackingDashboard = () => {
  const [trackingItems] = useState<TrackingItem[]>([
    {
      id: 'CRG001',
      type: 'cargo',
      status: 'In Transit',
      currentLocation: 'Distribution Center',
      destination: 'Warehouse A',
      estimatedArrival: '2024-03-22 14:00',
      progress: 65,
      purchaseDate: '2024-03-15',
      purchaseLocation: 'Online Platform',
      price: '$5,000',
      additionalInfo: {
        'Weight': '5,000 kg',
        'Dimensions': '40x20x10 ft',
        'Cargo Type': 'General Cargo',
        'Insurance': 'Covered',
        'Hazardous Materials': 'No',
        'Customs Declaration': 'Completed'
      },
      validation: {
        isValid: true,
        errors: []
      }
    },
    {
      id: 'CNT002',
      type: 'container',
      status: 'At Port',
      currentLocation: 'Port of Loading',
      destination: 'Port of Destination',
      estimatedArrival: '2024-03-25 08:00',
      progress: 30,
      purchaseDate: '2024-03-10',
      purchaseLocation: 'Port Authority',
      price: '$8,000',
      additionalInfo: {
        'Container Type': 'Standard 20ft',
        'Contents': 'Electronics',
        'Weight': '15,000 kg',
        'Customs Status': 'Cleared',
        'Container Number': 'MSCU1234567',
        'Seal Number': 'SEAL789012'
      },
      validation: {
        isValid: true,
        errors: []
      }
    },
    {
      id: 'PKG003',
      type: 'package',
      status: 'Out for Delivery',
      currentLocation: 'Local Distribution',
      destination: 'Customer Address',
      estimatedArrival: '2024-03-20 15:30',
      progress: 85,
      purchaseDate: '2024-03-18',
      purchaseLocation: 'E-commerce Store',
      price: '$150',
      additionalInfo: {
        'Weight': '2.5 kg',
        'Dimensions': '30x20x15 cm',
        'Service Type': 'Express Delivery',
        'Signature Required': 'Yes',
        'Tracking Number': '1Z999AA10123456789',
        'Barcode': '8901234567890'
      },
      validation: {
        isValid: true,
        errors: []
      }
    },
    {
      id: 'VH004',
      type: 'vehicle',
      status: 'In Transit',
      currentLocation: 'Highway 101',
      destination: 'Delivery Point',
      estimatedArrival: '2024-03-21 10:00',
      progress: 45,
      purchaseDate: '2024-03-16',
      purchaseLocation: 'Fleet Management',
      price: '$2,000',
      additionalInfo: {
        'Vehicle Type': 'Delivery Van',
        'Driver': 'Mike Johnson',
        'License Plate': 'ABC-1234',
        'Fuel Level': '75%',
        'VIN': '1HGCM82633A123456',
        'Registration': 'REG-2024-1234'
      },
      validation: {
        isValid: true,
        errors: []
      }
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cargo':
        return '📦';
      case 'container':
        return '🚢';
      case 'package':
        return '📝';
      case 'vehicle':
        return '🚛';
      default:
        return '📦';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit':
        return 'text-blue-600';
      case 'At Port':
        return 'text-yellow-600';
      case 'Out for Delivery':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrackingRoute = (type: string, id: string) => {
    switch (type) {
      case 'cargo':
        return `/cargo/${id}`;
      case 'container':
        return `/container/${id}`;
      case 'package':
        return `/package/${id}`;
      case 'vehicle':
        return `/car/${id}`;
      default:
        return '/';
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col">
      <div className="w-full bg-green-600 p-8 text-white">
        <h1 className="text-3xl font-bold text-center">Tracking Dashboard</h1>
      </div>
      
      <div className="flex-grow w-full">
        <section className="w-full py-16">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Tracking List</h2>
              
              <div className="space-y-6">
                {trackingItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl">{getTypeIcon(item.type)}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} {item.id}
                          </h3>
                          <p className={`font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Estimated Arrival</p>
                        <p className="font-medium">{item.estimatedArrival}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Purchase Date</p>
                        <p className="font-medium">{item.purchaseDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Purchase Location</p>
                        <p className="font-medium">{item.purchaseLocation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-medium">{item.price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Current Location</p>
                        <p className="font-medium">{item.currentLocation}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Additional Information</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(item.additionalInfo).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-sm text-gray-600">{key}</p>
                            <p className="font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Link
                        to={getTrackingRoute(item.type, item.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TrackingDashboard; 