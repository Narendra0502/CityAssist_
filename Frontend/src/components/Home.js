import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  AlertCircle, 
  CheckCircle, 
  Zap, 
  TrendingUp, 
  Shield, 
  Heart, 
  Truck,
  Filter,
  Globe,
  Users,
  Database,
  PieChart,
  Award,
  Clipboard
} from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dynamicData, setDynamicData] = useState({
    realTimeStats: {
      activeIssues: 352,
      resolvedIssues: 287,
      averageResolutionTime: '3.2 days',
      citizenEngagement: '78%'
    },
    cityPerformanceMetrics: [
      {
        category: 'Infrastructure',
        score: 88,
        icon: <Truck className="text-blue-500" />,
        details: '892 out of 1243 roads maintained',
        impact: 'Improved road connectivity and transportation efficiency'
      },
      {
        category: 'Public Safety',
        score: 92,
        icon: <Shield className="text-green-500" />,
        details: '15% crime rate reduction year-on-year',
        impact: 'Enhanced community security and emergency response'
      },
      {
        category: 'Health Services',
        score: 85,
        icon: <Heart className="text-red-500" />,
        details: '32 health clinics, 98% vaccination coverage',
        impact: 'Comprehensive healthcare accessibility'
      },
      {
        category: 'Environmental Sustainability',
        score: 79,
        icon: <Filter className="text-teal-500" />,
        details: '18% green spaces, improving air quality',
        impact: 'Promoting ecological balance and urban wellness'
      }
    ]
  });

  const [departmentEfficiency, setDepartmentEfficiency] = useState({
    Infrastructure: {
      score: 89,
      projects: 127,
      completedProjects: 112,
      budget: '$45.6M',
      keyMetrics: [
        'Road Maintenance',
        'Public Utilities',
        'Urban Planning'
      ]
    },
    Sanitation: {
      score: 82,
      projects: 93,
      completedProjects: 78,
      budget: '$22.3M',
      keyMetrics: [
        'Waste Management',
        'Recycling Programs',
        'Clean City Initiatives'
      ]
    },
    Transportation: {
      score: 76,
      projects: 64,
      completedProjects: 52,
      budget: '$35.2M',
      keyMetrics: [
        'Public Transit',
        'Traffic Management',
        'Mobility Solutions'
      ]
    },
    PublicSafety: {
      score: 94,
      projects: 86,
      completedProjects: 81,
      budget: '$55.7M',
      keyMetrics: [
        'Emergency Response',
        'Crime Prevention',
        'Community Policing'
      ]
    }
  });

  const cityData = {
    overview: {
      totalPopulation: 852670,
      urbanArea: '327 sq km',
      avgHousehold: 3.2,
      medianIncome: '$65,420'
    }
  };

  const footerData = {
    quickLinks: [
      { 
        title: 'City Services', 
        links: [
          { name: 'Waste Management', visitors: 45000 },
          { name: 'Public Transport', visitors: 62000 },
          { name: 'Healthcare', visitors: 38000 }
        ]
      },
      { 
        title: 'Community Programs', 
        links: [
          { name: 'Education Initiatives', visitors: 29000 },
          { name: 'Senior Citizens Support', visitors: 18000 },
          { name: 'Youth Engagement', visitors: 35000 }
        ]
      },
      { 
        title: 'Contact Departments', 
        links: [
          { name: 'Mayor\'s Office', calls: 5200 },
          { name: 'Citizen Support', calls: 7500 },
          { name: 'Emergency Services', calls: 12000 }
        ]
      }
    ],
    socialStats: {
      websiteVisitors: 425000,
      activeUsers: 185000,
      monthlyInteractions: 672500,
      averageSessionDuration: '7.5 minutes'
    }
  };

  const cityAssistInfo = {
    mission: 'Transforming urban management through data-driven solutions and citizen-centric technology.',
    keyFeatures: [
      'Real-time Performance Tracking',
      'Predictive Analytics',
      'Transparent Governance',
      'Citizen Engagement Platform'
    ],
    impact: [
      'Reduced operational costs by 22%',
      'Improved service delivery efficiency',
      'Enhanced citizen satisfaction',
      'Data-powered decision making'
    ]
  };

  // Simulate dynamic data update with more complex logic
  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicData(prev => {
        const newActiveIssues = prev.realTimeStats.activeIssues + Math.floor(Math.random() * 5);
        const newResolvedIssues = prev.realTimeStats.resolvedIssues + Math.floor(Math.random() * 3);
        
        // Dynamically adjust performance metrics
        const updatedMetrics = prev.cityPerformanceMetrics.map(metric => ({
          ...metric,
          score: Math.min(100, Math.max(70, metric.score + (Math.random() * 2 - 1)))
        }));

        return {
          ...prev,
          realTimeStats: {
            ...prev.realTimeStats,
            activeIssues: newActiveIssues,
            resolvedIssues: newResolvedIssues,
            citizenEngagement: `${Math.min(100, Math.max(70, parseFloat(prev.realTimeStats.citizenEngagement) + (Math.random() * 2 - 1))).toFixed(1)}%`
          },
          cityPerformanceMetrics: updatedMetrics
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen mt-12">
      {/* Hero Section with Real-Time Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16 px-6"
      >
        <div className="container mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <motion.h2 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-bold mb-6 text-white"
            >
              CityAssist Platform
            </motion.h2>
            <motion.p 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl mb-8 text-blue-100"
            >
              {cityAssistInfo.mission}
            </motion.p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-4"
          >
            {Object.entries(dynamicData.realTimeStats).map(([key, value]) => (
              <motion.div 
                key={key}
                variants={itemVariants}
                className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-all"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <AlertCircle className="text-yellow-400" />
                  <span className="font-bold text-2xl">{value}</span>
                </div>
                <p className="text-sm text-blue-100 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* CityAssist Impact Section */}
      <div className="container mx-auto px-6 py-12 bg-white">
        <h3 className="text-3xl font-bold text-center mb-8 text-blue-800">
          CityAssist Impact
        </h3>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-blue-50 p-6 rounded-lg"
          >
            <h4 className="text-xl font-bold mb-4 flex items-center">
              <Award className="mr-3 text-blue-600" /> Key Features
            </h4>
            <ul className="space-y-2">
              {cityAssistInfo.keyFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Zap className="mr-2 text-blue-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            className="bg-green-50 p-6 rounded-lg"
          >
            <h4 className="text-xl font-bold mb-4 flex items-center">
              <Clipboard className="mr-3 text-green-600" /> Measured Impact
            </h4>
            <ul className="space-y-2">
              {cityAssistInfo.impact.map((impact, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="mr-2 text-green-500" />
                  {impact}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Department Performance Section with Detailed Metrics */}
      <div className="container mx-auto px-6 py-12">
        <h3 className="text-3xl font-bold text-center mb-8 text-blue-800">
          Comprehensive Department Performance
        </h3>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {Object.entries(departmentEfficiency).map(([dept, data]) => (
            <motion.div 
              key={dept} 
              variants={itemVariants}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between mb-4">
                <span className="font-bold text-xl">{dept.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-blue-600 font-semibold">{data.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${data.score}%` }}
                ></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Projects:</span>
                  <span>{data.completedProjects}/{data.projects}</span>
                </div>
                <div className="flex justify-between">
                  <span>Budget:</span>
                  <span>{data.budget}</span>
                </div>
                <div>
                  <span className="font-semibold">Key Metrics:</span>
                  <ul className="text-sm text-gray-600 mt-1">
                    {data.keyMetrics.map((metric, index) => (
                      <li key={index}>• {metric}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer with Comprehensive Stats */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto grid md:grid-cols-3 gap-10">
          {/* Quick Links Section */}
          <div>
            {footerData.quickLinks.map((section, index) => (
              <div key={index} className="mb-6">
                <h4 className="text-xl font-bold mb-4 text-blue-400">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li 
                      key={linkIndex} 
                      className="flex justify-between border-b border-gray-700 pb-2"
                    >
                      <span>{link.name}</span>
                      <span className="text-gray-400">
                        {link.visitors ? `${link.visitors.toLocaleString()} visitors` : `${link.calls.toLocaleString()} calls`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social and Engagement Stats */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h4 className="text-2xl font-bold mb-6 text-blue-400">
              Platform Engagement
            </h4>
            <div className="space-y-4">
              {Object.entries(footerData.socialStats).map(([key, value]) => (
                <div 
                  key={key} 
                  className="flex justify-between items-center border-b border-gray-700 pb-3"
                >
                  <div className="flex items-center space-x-3">
                    {key === 'websiteVisitors' && <Globe className="text-blue-500" />}
                    {key === 'activeUsers' && <Users className="text-green-500" />}
                    {key === 'monthlyInteractions' && <Database className="text-purple-500" />}
                    {key === 'averageSessionDuration' && <TrendingUp className="text-red-500" />}
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </div>
                  <span className="font-bold">{value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* City Overview */}
          <div>
            <h4 className="text-2xl font-bold mb-6 text-blue-400">
              City at a Glance
            </h4>
            <div className="bg-gray-800 rounded-lg p-6">
              {Object.entries(cityData.overview).map(([key, value]) => (
                <div 
                  key={key} 
                  className="flex justify-between border-b border-gray-700 pb-3 mb-3"
                >
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-10 border-t border-gray-700 pt-6">
          <p>&copy; 2025 CityAssist. Powering Smarter Urban Living.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;