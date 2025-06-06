import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section id="home" className="hero-section py-20">
        <div className="container mx-auto text-center px-4">
          <div className="hero-content max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 text-gradient">Welcome to Our School Health System</h2>
            <p className="text-xl mb-8 text-gray-700">Manage student health records, track medical events, and stay informed about health policies.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#learn-more" className="hero-btn text-white px-8 py-4 rounded-lg font-medium flex items-center">
                <i className="fas fa-info-circle mr-2"></i> Learn More
              </a>
              <a href="#docs" className="bg-white border-2 border-indigo-500 text-indigo-600 px-8 py-4 rounded-lg font-medium hover:bg-indigo-50 transition-all flex items-center">
                <i className="fas fa-file-medical mr-2"></i> Health Documents
              </a>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md hover-scale">
                <div className="text-indigo-500 text-3xl mb-4">
                  <i className="fas fa-user-md"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Professional Care</h3>
                <p className="text-gray-600">Expert healthcare professionals dedicated to student wellbeing.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover-scale">
                <div className="text-indigo-500 text-3xl mb-4">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Health Tracking</h3>
                <p className="text-gray-600">Comprehensive health monitoring and record keeping.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover-scale">
                <div className="text-indigo-500 text-3xl mb-4">
                  <i className="fas fa-shield-virus"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Preventive Measures</h3>
                <p className="text-gray-600">Proactive health initiatives to prevent illness.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Documentation Section */}
      <section id="docs" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fadeIn">
            <h3 className="text-4xl font-bold mb-4">Health Documentation</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Access important health documents and guidelines for students and parents.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="docs-card bg-white p-8 rounded-lg shadow-md">
              <div className="text-indigo-500 text-4xl mb-6">
                <i className="fas fa-book-medical"></i>
              </div>
              <h4 className="text-2xl font-semibold mb-3">Health Policy</h4>
              <p className="text-gray-600 mb-6">Comprehensive school health policies and procedures for students and staff.</p>
              <a href="#" className="flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-all">
                <i className="fas fa-file-pdf mr-2"></i> Download PDF
                <i className="fas fa-arrow-right ml-2 text-sm"></i>
              </a>
            </div>
            <div className="docs-card bg-white p-8 rounded-lg shadow-md">
              <div className="text-indigo-500 text-4xl mb-6">
                <i className="fas fa-syringe"></i>
              </div>
              <h4 className="text-2xl font-semibold mb-3">Vaccination Guidelines</h4>
              <p className="text-gray-600 mb-6">Essential guidelines and schedules for required and recommended student vaccinations.</p>
              <a href="#" className="flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-all">
                <i className="fas fa-file-pdf mr-2"></i> Download PDF
                <i className="fas fa-arrow-right ml-2 text-sm"></i>
              </a>
            </div>
            <div className="docs-card bg-white p-8 rounded-lg shadow-md">
              <div className="text-indigo-500 text-4xl mb-6">
                <i className="fas fa-first-aid"></i>
              </div>
              <h4 className="text-2xl font-semibold mb-3">Emergency Procedures</h4>
              <p className="text-gray-600 mb-6">Critical procedures and protocols for handling various medical emergencies at school.</p>
              <a href="#" className="flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-all">
                <i className="fas fa-file-pdf mr-2"></i> Download PDF
                <i className="fas fa-arrow-right ml-2 text-sm"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fadeIn">
            <h3 className="text-4xl font-bold mb-4">Health Blog</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Stay informed with the latest health news, tips, and updates for school-aged children.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="blog-card rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                     alt="Wellness" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  WELLNESS
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-3">Tips for Student Wellness</h4>
                <p className="text-gray-600 mb-4">Learn how to keep your child healthy and thriving at school with these expert wellness tips.</p>
                <div className="flex items-center justify-between">
                  <a href="#" className="flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-all">
                    Read More <i className="fas fa-arrow-right ml-2 text-sm"></i>
                  </a>
                  <span className="text-gray-500 text-sm"><i className="far fa-calendar-alt mr-1"></i> May 15, 2023</span>
                </div>
              </div>
            </div>

            <div className="blog-card rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1584634731339-252c581abfc5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                     alt="Vaccination" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  VACCINATION
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-3">Vaccination Updates</h4>
                <p className="text-gray-600 mb-4">Stay current with the latest updates and information on school vaccination programs and requirements.</p>
                <div className="flex items-center justify-between">
                  <a href="#" className="flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-all">
                    Read More <i className="fas fa-arrow-right ml-2 text-sm"></i>
                  </a>
                  <span className="text-gray-500 text-sm"><i className="far fa-calendar-alt mr-1"></i> June 2, 2023</span>
                </div>
              </div>
            </div>

            <div className="blog-card rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                     alt="Allergies" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  ALLERGIES
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-3">Managing Allergies</h4>
                <p className="text-gray-600 mb-4">Comprehensive guide to understanding and managing various allergies in the school environment.</p>
                <div className="flex items-center justify-between">
                  <a href="#" className="flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-all">
                    Read More <i className="fas fa-arrow-right ml-2 text-sm"></i>
                  </a>
                  <span className="text-gray-500 text-sm"><i className="far fa-calendar-alt mr-1"></i> June 18, 2023</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="#" className="inline-flex items-center px-6 py-3 border-2 border-indigo-500 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-all">
              <i className="fas fa-book-reader mr-2"></i> View All Articles
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;