import { useState, useMemo, useCallback, type JSX } from 'react';
import { useParams } from 'react-router-dom';
// import { format } from 'date-fns'; // <-- Use this if you have date-fns installed!

// --- 1. Database Schema Blueprint ---
interface CarData {
  id: string; // The primary tracking identifier (e.g., VH123456)
  status: 'In Transit' | 'Delivered' | 'Pending' | 'Delayed'; // Current state
  type: string; // Vehicle model or type (e.g., 'Delivery Truck')
  currentLocation: string; // Real-time GPS location/address
  destination: string; // Final delivery address
  estimatedArrival: string; // ISO 8601 Timestamp string for ETA
  licensePlate: string; // Vehicle administrative detail
  vin: string; // Vehicle Identification Number
  driver: string; // Driver name and/or contact info
  fuelLevel: string; // Current fuel status (e.g., '75%')
  registration: string; // Vehicle registration status (e.g., 'Active')
}

// --- 2. Helper Functions ---

const STATUS_CLASS_MAP: Record<CarData['status'], string> = {
  'In Transit': 'bg-blue-100 text-blue-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Delayed': 'bg-red-100 text-red-800',
};

const getStatusClasses = (status: CarData['status']): string => {
  return STATUS_CLASS_MAP[status] || 'bg-gray-100 text-gray-800';
};

// --- 3. Functional Component: CarDetails ---

type DetailSection = 'driver' | 'vehicle';

const CarDetails = (): JSX.Element => {
  const { id } = useParams<{ id: string }>(); 
  
  const [carId, setCarId] = useState(id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ id?: string }>({});
  const [carData, setCarData] = useState<CarData | null>(null);
  
  const [activeSection, setActiveSection] = useState<DetailSection | null>(id ? 'driver' : null);

  // FIX: Corrected event type from React.FormFormEvent to React.FormEvent<HTMLFormElement>
  const handleTrack = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setCarData(null); 

    const trimmedId = carId.trim();

    if (!trimmedId) {
        setErrors({ id: 'Please enter a valid vehicle ID.' });
        setIsLoading(false);
        return;
    }

    try {
      // --- Simulated API Call ---
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fetchedData: CarData = {
        id: trimmedId,
        status: 'In Transit', 
        type: 'Heavy Transport Lorry',
        currentLocation: 'Industrial Park Zone 3 (Lat: 34.05, Lon: -118.24)',
        destination: 'Central Logistics Hub, 456 Storage Rd, Atlanta, GA',
        estimatedArrival: '2025-12-09T18:30:00Z',
        licensePlate: 'RWA789X',
        vin: 'ABCDE12345FGHIJ678',
        driver: 'Jane Smith (+250 788 123 456)',
        fuelLevel: '90%',
        registration: 'Active'
      };

      setCarData(fetchedData);
      setActiveSection('driver');

    } catch (error) {
      console.error("Tracking error:", error);
      setErrors({ id: 'Vehicle ID not found or service error. Please check the ID.' });
    } finally {
      setIsLoading(false);
    }
  }, [carId]); 

  const toggleDetails = useCallback((section: DetailSection) => {
    setActiveSection(prev => (prev === section ? null : section));
  }, []);

  const formattedLocation = useMemo(() => {
    if (!carData) return 'N/A';
    return carData.currentLocation.split('(')[0].trim();
  }, [carData]);

  const formattedETA = useMemo(() => {
    if (!carData || !carData.estimatedArrival) return 'N/A';
    try {
        const date = new Date(carData.estimatedArrival);
        // If date-fns is installed, uncomment and use 'return format(date, 'p');'
        // Otherwise, use native JS for basic formatting:
        return date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
    } catch (e) {
        console.error("Date formatting error:", e);
        return carData.estimatedArrival.split(' ')[1] || 'N/A';
    }
  }, [carData]);

  // --- 4. UI Components (Standardized helper components) ---

  const DetailCard = ({ title, value, icon, className = '' }: { title: string, value: string, icon: JSX.Element, className?: string }): JSX.Element => (
    <div className={`p-5 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col space-y-2 ${className}`}>
      <div className="flex items-center text-gray-500">
        {icon}
        <p className="ml-2 text-sm font-semibold uppercase tracking-wider">{title}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
    </div>
  );

  const ItemDisplay = ({ label, value }: { label: string, value: string }): JSX.Element => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="text-sm font-semibold text-gray-800 text-right">{value}</span>
    </div>
  );
  
  const Icons = {
      Location: <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.899l-4.243-4.242A6 6 0 1117.657 16.657zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      ETA: <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      Driver: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
      Vehicle: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
      ChevronDown: <svg className="w-5 h-5 ml-2 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
      ChevronUp: <svg className="w-5 h-5 ml-2 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>,
  };

  // --- 5. Main Render Function ---
  return (
    <div className="w-screen min-h-screen flex flex-col bg-gray-50">
      
      {/* Header (Branding) */}
      <div className="w-full bg-green-600 p-6 text-white shadow-md">
        <h1 className="text-2xl font-extrabold tracking-tight text-center">TXLOGIC <span className="font-light">Tracking Portal</span></h1>
      </div>
      
      <div className="flex-grow w-full max-w-4xl mx-auto p-4 sm:p-8">
        
        {/* Track Form Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Track Your Vehicle Shipment</h2>
          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="carId" className="sr-only">Vehicle ID</label>
                <input
                  type="text"
                  id="carId"
                  value={carId}
                  onChange={(e) => {
                    setCarId(e.target.value);
                    setErrors(prev => ({ ...prev, id: undefined }));
                  }}
                  className={`block w-full rounded-lg px-4 py-3 shadow-sm placeholder:text-gray-400 text-gray-800 focus:ring-2 focus:ring-green-500 border-2 ${
                    errors.id ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter Tracking ID (e.g., VH123456)"
                  required
                />
                {errors.id && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.id}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-shrink-0 bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50
                  ${isLoading ? 'opacity-60 cursor-not-allowed' : 'shadow-md shadow-green-200/50'}
                `}
              >
                {isLoading ? 'SEARCHING...' : 'TRACK NOW'}
              </button>
            </form>
          </div>
        </section>

        {/* --- RESULTS DISPLAY ELEMENT --- */}
        {carData && (
          <section className="space-y-8">
            {/* Status Header: Displays ID and status field */}
            <div className="flex justify-between items-baseline mb-6 border-b border-gray-200 pb-3">
                <h3 className="text-2xl font-bold text-gray-800">Tracking ID: <span className="text-green-600">{carData.id}</span></h3>
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-base font-extrabold tracking-wide ${getStatusClasses(carData.status)}`}>
                    {carData.status}
                </span>
            </div>

            {/* Key Metric Cards: Uses currentLocation and estimatedArrival */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailCard
                    title="Current Location"
                    value={formattedLocation}
                    icon={Icons.Location}
                    className="md:col-span-2"
                />
                <DetailCard
                    title="Est. Arrival Time"
                    value={formattedETA}
                    icon={Icons.ETA}
                />
            </div>
            
            {/* Destination Detail: Full Address */}
             <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100">
                <p className="text-sm font-semibold text-gray-500">Destination Address</p>
                <p className="text-lg font-medium text-gray-800 mt-1">{carData.destination}</p>
            </div>

            {/* Secondary Details (Collapsible Sections) */}
            <div className="space-y-4">
                
                {/* Driver/Contact Information */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                    <button 
                        onClick={() => toggleDetails('driver')}
                        className="w-full text-left p-4 flex justify-between items-center text-lg font-semibold text-gray-800 hover:bg-gray-50 rounded-t-xl"
                    >
                        <div className="flex items-center space-x-2 text-blue-600">
                            {Icons.Driver}
                            <span>Driver & Contact Details</span>
                        </div>
                        {activeSection === 'driver' ? Icons.ChevronUp : Icons.ChevronDown}
                    </button>
                    {activeSection === 'driver' && (
                        <div className="p-4 pt-0 border-t border-gray-100 transition-all duration-300">
                            <ItemDisplay label="Driver Name/Contact" value={carData.driver} />
                            <ItemDisplay label="License Plate" value={carData.licensePlate} />
                            <ItemDisplay label="Fuel Level" value={carData.fuelLevel} />
                        </div>
                    )}
                </div>

                {/* Vehicle/Administrative Information */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                    <button 
                        onClick={() => toggleDetails('vehicle')}
                        className="w-full text-left p-4 flex justify-between items-center text-lg font-semibold text-gray-800 hover:bg-gray-50 rounded-t-xl"
                    >
                        <div className="flex items-center space-x-2 text-purple-600">
                            {Icons.Vehicle}
                            <span>Vehicle & Administrative Info</span>
                        </div>
                        {activeSection === 'vehicle' ? Icons.ChevronUp : Icons.ChevronDown}
                    </button>
                    {activeSection === 'vehicle' && (
                        <div className="p-4 pt-0 border-t border-gray-100 transition-all duration-300">
                            <ItemDisplay label="Vehicle Type" value={carData.type} />
                            <ItemDisplay label="VIN (Vehicle ID Number)" value={carData.vin} />
                            <ItemDisplay label="Registration Status" value={carData.registration} />
                        </div>
                    )}
                </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="mt-8">
                 <p className="text-lg font-semibold text-gray-800 mb-2">Live Map View (Approximate Location)</p>
                 <div className="w-full h-80 bg-gray-200 rounded-xl flex items-center justify-center border-2 border-gray-300">
                    <span className="text-gray-500 font-medium">
                        
                    </span>
                 </div>
            </div>
          </section>
        )}
        {/* --- END RESULTS DISPLAY ELEMENT --- */}
      </div>
    </div>
  );
};

export default CarDetails;