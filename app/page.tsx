"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Truck,
  Container,
  Warehouse,
  MapPin,
  Shield,
  BarChart3,
  Zap,
  Globe,
  ArrowRight,
  Search,
  Box,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  ChevronRight,
  Star,
  Users,
  TrendingUp,
} from "lucide-react";

const stats = [
  { label: "Shipments Delivered", value: "50,000+", icon: Package },
  { label: "Active Trucks", value: "1,200+", icon: Truck },
  { label: "Warehouses", value: "85+", icon: Warehouse },
  { label: "Countries Served", value: "40+", icon: Globe },
];

const services = [
  {
    icon: Package,
    title: "Package Delivery",
    description: "Door-to-door package delivery with real-time tracking and proof of delivery.",
  },
  {
    icon: Truck,
    title: "Freight Transport",
    description: "Full truckload and less-than-truckload freight services across continents.",
  },
  {
    icon: Container,
    title: "Container Shipping",
    description: "International container shipping with full container management and tracking.",
  },
  {
    icon: Warehouse,
    title: "Warehousing",
    description: "Strategic warehouse locations with inventory management and fulfillment.",
  },
  {
    icon: Globe,
    title: "Supply Chain",
    description: "End-to-end supply chain management with analytics and optimization.",
  },
  {
    icon: Shield,
    title: "Secure Logistics",
    description: "Enterprise-grade security with insurance and compliance management.",
  },
];

const features = [
  "Real-time GPS tracking for all shipments",
  "Automated delivery notifications",
  "Digital proof of delivery",
  "Advanced route optimization",
  "Multi-warehouse management",
  "Comprehensive analytics dashboard",
  "API integration support",
  "24/7 customer support",
];

export default function LandingPage() {
  const router = useRouter();
  const [trackingQuery, setTrackingQuery] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingQuery.trim()) {
      router.push(`/track/${encodeURIComponent(trackingQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Box size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Txlogic
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm font-medium text-secondary hover:text-foreground transition-colors">
                Services
              </a>
              <a href="#features" className="text-sm font-medium text-secondary hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#contact" className="text-sm font-medium text-secondary hover:text-foreground transition-colors">
                Contact
              </a>
              <Link
                href="/login"
                className="tx-btn tx-btn-primary"
              >
                Sign In
              </Link>
            </div>
            <Link
              href="/login"
              className="md:hidden tx-btn tx-btn-primary"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="tx-gradient pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Zap size={14} className="text-accent" />
              <span className="text-sm font-medium text-white/80">
                Enterprise Logistics Platform
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              The Operating System for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-300">
                Modern Logistics
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Manage shipments, cargo, containers, trucks, drivers, and warehouses
              from a single, powerful platform. Complete visibility from creation to delivery.
            </p>

            {/* Tracking Search */}
            <form onSubmit={handleTrack} className="mt-10 max-w-xl mx-auto">
              <div className="relative bg-white rounded-2xl p-2 shadow-2xl">
                <div className="flex items-center">
                  <Search size={20} className="ml-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter tracking number (e.g., TXL-ABC123)"
                    value={trackingQuery}
                    onChange={(e) => setTrackingQuery(e.target.value)}
                    className="flex-1 px-4 py-3 text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    Track
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="tx-card p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <stat.icon size={24} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Comprehensive Logistics Solutions
            </h2>
            <p className="mt-4 text-lg text-secondary">
              From local deliveries to international freight, we handle every aspect of
              your supply chain with precision and reliability.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="tx-card p-8 group hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  <service.icon size={28} className="text-primary group-hover:text-white transition-all" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-secondary leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Built for Enterprise Operations
              </h2>
              <p className="mt-4 text-lg text-secondary leading-relaxed">
                Txlogic is designed to handle the complexity of modern logistics operations.
                Every feature is built with performance, security, and scalability in mind.
              </p>
              <div className="mt-10 space-y-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={16} className="text-success" />
                    </div>
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 border border-slate-200">
              <div className="space-y-4">
                {[
                  { label: "Active Shipments", value: "2,847", change: "+12.5%", color: "bg-primary" },
                  { label: "Delivered Today", value: "1,234", change: "+8.2%", color: "bg-success" },
                  { label: "In Transit", value: "892", change: "-2.1%", color: "bg-warning" },
                  { label: "Pending Pickup", value: "421", change: "+5.7%", color: "bg-accent" },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-8 rounded-full ${item.color}`} />
                        <div>
                          <p className="text-sm text-secondary">{item.label}</p>
                          <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${item.change.startsWith("+") ? "text-success" : "text-danger"}`}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 tx-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-80 h-80 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Transform Your Logistics?
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Join thousands of companies that trust Txlogic for their supply chain operations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Start Free Trial
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <Box size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white">Txlogic</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Enterprise logistics and supply chain management platform.
                Complete visibility from creation to delivery.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Platform
              </h4>
              <div className="space-y-2">
                <Link href="/login" className="block text-slate-400 hover:text-white text-sm transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="block text-slate-400 hover:text-white text-sm transition-colors">
                  Create Account
                </Link>
                <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">
                  Documentation
                </a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">
                  API Access
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Services
              </h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">
                  Package Delivery
                </a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">
                  Freight Transport
                </a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">
                  Container Shipping
                </a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">
                  Warehousing
                </a>
              </div>
            </div>
            <div id="contact">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Contact
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Phone size={14} />
                  <span>+1 (800) TXLOGIC</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Mail size={14} />
                  <span>support@txlogic.com</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <MapPin size={14} />
                  <span>100 Logistics Way, Suite 200</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Txlogic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}