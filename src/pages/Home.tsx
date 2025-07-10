import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    {
      title: "Track Your Shipments",
      description: "Real-time tracking for all your logistics needs. Monitor your cargo, containers, packages, and vehicles with our advanced tracking system.",
      subDescription: "Get instant updates, delivery notifications, and detailed status reports.",
      image: "🚢",
      color: "bg-green-600"
    },
    {
      title: "Global Logistics Solutions",
      description: "Seamless international shipping solutions with comprehensive customs clearance support and real-time documentation management.",
      subDescription: "Connect with trusted partners worldwide and expand your business globally.",
      image: "🌍",
      color: "bg-green-700"
    },
    {
      title: "Smart Analytics & Insights",
      description: "Data-driven insights for better decisions. Monitor performance metrics, optimize routes, and reduce operational costs.",
      subDescription: "Leverage AI-powered analytics to streamline your supply chain operations.",
      image: "📊",
      color: "bg-green-800"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: 'Cargo Tracking',
      description: 'Track your cargo shipments in real-time',
      link: '/cargo',
      icon: '📦'
    },
    {
      title: 'Container Management',
      description: 'Manage and monitor container status',
      link: '/container',
      icon: '🚢'
    },
    {
      title: 'Package Details',
      description: 'View detailed package information',
      link: '/package',
      icon: '📝'
    },
    {
      title: 'Vehicle Tracking',
      description: 'Track vehicle movements and status',
      link: '/car',
      icon: '🚛'
    }
  ];

  const services = [
    {
      title: 'Global Shipping',
      description: 'International shipping solutions with real-time tracking and customs clearance support.',
      icon: '🌍'
    },
    {
      title: 'Warehouse Management',
      description: 'Efficient warehouse operations with inventory tracking and automated management systems.',
      icon: '🏭'
    },
    {
      title: 'Supply Chain Analytics',
      description: 'Advanced analytics and reporting tools for optimizing your supply chain operations.',
      icon: '📊'
    }
  ];

  const workflow = [
    {
      step: '1',
      title: 'Shipment Creation',
      description: 'Create and register your shipment with detailed information and requirements.'
    },
    {
      step: '2',
      title: 'Real-time Tracking',
      description: 'Monitor your shipment\'s location and status through our advanced tracking system.'
    },
    {
      step: '3',
      title: 'Documentation',
      description: 'Manage all shipping documents digitally with our comprehensive documentation system.'
    },
    {
      step: '4',
      title: 'Delivery Confirmation',
      description: 'Receive instant notifications and proof of delivery when your shipment arrives.'
    }
  ];

  return (
    <div className="w-full min-h-screen">
      <section className="relative h-screen w-full overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`${slide.color} h-full flex items-center`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between py-12 lg:py-0">
                <div className="text-white max-w-2xl text-center lg:text-left mb-8 lg:mb-0">
                  <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6">{slide.title}</h1>
                  <p className="text-lg sm:text-xl mb-3 sm:mb-4">{slide.description}</p>
                  <p className="text-base sm:text-lg mb-6 sm:mb-8 text-green-100">{slide.subDescription}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link
                      to="/cargo"
                      className="inline-block bg-white text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors duration-300"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/tracking"
                      className="inline-block border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-white/10 transition-colors duration-300"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
                <div className="text-6xl sm:text-7xl lg:text-8xl">
                  {slide.image}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300 hover:border-green-500 hover:border-2 flex flex-col items-center text-center"
          >
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 bg-green-100 text-green-600 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
              {feature.icon}
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              {feature.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
          </Link>
        ))}
      </section>

      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col items-center text-center">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 bg-green-100 text-green-600 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
                  {service.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 mb-12 sm:mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {workflow.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 h-full">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">{step.description}</p>
                </div>
                {index < workflow.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-green-600"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 