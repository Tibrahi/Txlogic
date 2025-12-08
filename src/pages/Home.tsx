import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  TruckIcon,
  GlobeAltIcon,
  ChartBarSquareIcon,
  CubeIcon,
  ClipboardDocumentCheckIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // STRICT COLOR THEME: BLACK backgrounds for Hero
  const heroSlides = [
    {
      title: "Real-time Shipment Tracking",
      description: "Monitor your cargo, containers, packages, and vehicles with our advanced, reliable tracking system.",
      Icon: MapPinIcon,
      color: "bg-black" // Pure Black
    },
    {
      title: "Global Supply Chain Management",
      description: "Seamless international shipping solutions with comprehensive customs support and digital documentation.",
      Icon: GlobeAltIcon,
      color: "bg-gray-900" // Very Dark Gray (almost black)
    },
    {
      title: "Smart Logistics Analytics",
      description: "Data-driven insights for better decisions. Optimize routes and significantly reduce operational costs.",
      Icon: ChartBarSquareIcon,
      color: "bg-black" // Pure Black
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const features = [
    {
      title: 'Cargo Tracking',
      description: 'Track your large cargo shipments and freight in real-time.',
      link: '/cargo',
      Icon: CubeIcon
    },
    {
      title: 'Container Management',
      description: 'View and manage the status and location of all shipping containers.',
      link: '/container',
      Icon: TagIcon
    },
    {
      title: 'Package Details',
      description: 'Get granular, step-by-step updates for individual packages.',
      link: '/package',
      Icon: ClipboardDocumentCheckIcon
    },
    {
      title: 'Vehicle Tracking',
      description: 'Monitor fleet movements, routes, and vehicle maintenance status.',
      link: '/car',
      Icon: TruckIcon
    }
  ];

  const services = [
    {
      title: 'Global Shipping',
      description: 'Reliable door-to-door international shipping with full customs support.',
      Icon: GlobeAltIcon
    },
    {
      title: 'Warehouse Management',
      description: 'Automated inventory tracking and efficient inbound/outbound operations.',
      Icon: WrenchScrewdriverIcon
    },
    {
      title: 'Supply Chain Analytics',
      description: 'Predictive analytics and comprehensive reporting for optimization.',
      Icon: ChartBarSquareIcon
    }
  ];

  const workflow = [
    {
      step: '1',
      title: 'Shipment Booking',
      description: 'Quickly create and register your shipment with detailed requirements and digital booking.'
    },
    {
      step: '2',
      title: 'Real-time Monitoring',
      description: 'Track the precise location and status of your consignment across all checkpoints.'
    },
    {
      step: '3',
      title: 'Digital Documentation',
      description: 'Access and manage all necessary shipping documents and customs paperwork digitally.'
    },
    {
      step: '4',
      title: 'Secure Delivery',
      description: 'Receive instant confirmation and proof of delivery upon successful, secure arrival.'
    }
  ];

  return (
    <div className="w-full bg-white text-gray-900">
      
      {/* Hero Section - FIXED: Uses w-screen to force full width coverage */}
      <section className="relative h-screen w-screen overflow-hidden bg-black">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`${slide.color} h-full w-full relative`}> 
              {/* Optional Texture Overlay */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              
              <div className="relative max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center">
                <div className="flex flex-col lg:flex-row items-center justify-between w-full py-16 lg:py-0">
                  <div className="text-white max-w-xl text-center lg:text-left mb-10 lg:mb-0 z-10">
                    <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl mb-8 text-gray-300">
                      {slide.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <Link
                        to="/tracking"
                        className="inline-flex items-center justify-center bg-green-600 text-white w-full sm:w-auto px-8 py-4 rounded-none font-bold text-lg hover:bg-green-500 transition-all duration-300"
                      >
                        Start Tracking
                      </Link>
                      <Link
                        to="/contact"
                        className="inline-flex items-center justify-center border-2 border-white text-white w-full sm:w-auto px-8 py-4 rounded-none font-semibold text-lg hover:bg-white hover:text-black transition-colors duration-300"
                      >
                        Get a Quote
                      </Link>
                    </div>
                  </div>
                  {/* Large Icon for Desktop */}
                  <div className="text-green-500 opacity-90 z-10 hidden lg:block">
                    <slide.Icon className="w-64 h-64" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Dots */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 transition-all duration-300 ${
                index === currentSlide ? 'bg-green-500 w-12' : 'bg-gray-600 w-4'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
      
      {/* Features - Black Icons on White Cards */}
      <section className="bg-white py-20 w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-16">
            Focused Tracking Solutions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group w-full bg-white border border-gray-200 p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-green-600 hover:shadow-xl"
              >
                <div className="mb-6 p-4 bg-black rounded-full group-hover:bg-green-600 transition-colors duration-300">
                  <feature.Icon className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services - Gray Background for contrast */}
      <section className="bg-gray-50 py-20 w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-16">
            Comprehensive Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <div key={index} className="w-full bg-white shadow-lg p-10 border-t-4 border-green-600 hover:-translate-y-2 transition-transform duration-300">
                <div className="mb-6">
                  <service.Icon className="w-12 h-12 text-green-600" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow - White Background */}
      <section className="bg-white py-20 w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {workflow.map((step, index) => (
              <div key={index} className="relative group text-center">
                <div className="w-16 h-16 mx-auto bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 ring-4 ring-gray-100 group-hover:bg-green-600 group-hover:ring-green-100 transition-all duration-300">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-black mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500">{step.description}</p>
                
                {/* Connector Lines */}
                {index < workflow.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gray-200 -z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Green Background */}
    <section className="py-20 w-full">
    <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6">
            Ready to Optimize Your Logistics?
        </h2>
        <p className="text-xl text-gray-600 mb-10">
            Join thousands of businesses who trust us with their global supply chain needs.
        </p>
        <Link
            to="/tracking"
            className="inline-block bg-black text-white px-10 py-4 font-bold text-lg rounded-lg shadow-xl hover:bg-gray-700 transition-colors duration-300 transform hover:scale-105"
        >
            Track Shipment Now
        </Link>
    </div>
</section>
    </div>
  );
};

export default Home;