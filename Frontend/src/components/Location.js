import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Location = () => {
  // Core refs and state
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const mapPins = useRef([]);
  const userMarkerRef = useRef(null);
  const activeInfoboxRef = useRef(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [routeHeading, setRouteHeading] = useState(0);

  // UI state
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  
  // Navigation state
  const [directionsManager, setDirectionsManager] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Initialize map
  useEffect(() => {
    const loadBingMapsScript = () => {
      if (window.Microsoft?.Maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.bing.com/api/maps/mapcontrol?key=ArSGwElpgs65UXUwCnZ4ibhLzkmxuScTxz0rCq_kgJy35pa2tSq229GIMzMPVQ8P`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.body.appendChild(script);
    };

    loadBingMapsScript();

    return () => {
      stopNavigation();
      if (mapRef.current) {
        mapRef.current.dispose();
        mapRef.current = null;
      }
    };
  }, []);

  // Expose functions to window for map interactions
  useEffect(() => {
    window.getDirections = getDirections;
    window.startNavigation = startNavigation;
    window.stopNavigation = stopNavigation;
    window.cancelDirections = cancelDirections;

    return () => {
      delete window.getDirections;
      delete window.startNavigation;
      delete window.stopNavigation;
      delete window.cancelDirections;
    };
  }, [directionsManager, userLocation]);

  const initMap = async () => {
    if (!mapContainerRef.current || !window.Microsoft?.Maps) return;

    try {
      mapRef.current = new window.Microsoft.Maps.Map(mapContainerRef.current, {
        credentials: 'ArSGwElpgs65UXUwCnZ4ibhLzkmxuScTxz0rCq_kgJy35pa2tSq229GIMzMPVQ8P',
        center: new window.Microsoft.Maps.Location(28.62821, 77.338091),
        zoom: 12,
        mapTypeId: window.Microsoft.Maps.MapTypeId.road
      });

      setIsMapLoaded(true);
      await loadDirectionsModule();
      getUserLocation();
      setTimeout(fetchCoordinates, 1000);
    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error('Failed to initialize map');
    }
  };
  const fetchCoordinates = () => {
    const token = localStorage.getItem("token"); 
  
    if (!token) {
      console.error("No token found, user might not be authenticated.");
      return;
    }
  
    fetch('https://cityassist-backend.onrender.com/admin/getUserIssueData', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Use all data without filtering
        const allData = Array.isArray(data) ? data : [];
  
        allData.forEach(entry => {
          const latitude = parseFloat(entry.latitude);
          const longitude = parseFloat(entry.longitude);
  
          if (isValidCoordinate(latitude, longitude)) {
            plotCoordinate(latitude, longitude, entry);
          } else {
            console.error(`Invalid coordinate: latitude ${latitude}, longitude ${longitude}`);
          }
        });
        setTimeout(fitMapToPins, 1000);
      })
      .catch(error => console.error('Error fetching coordinates:', error));
  };
  
  const plotCoordinate = (latitude, longitude, entry) => {
    if (!mapRef.current || !window.Microsoft) {
      console.error('Map reference or Microsoft Maps API is not available');
      return;
    }
  
    try {
      const location = new window.Microsoft.Maps.Location(latitude, longitude);
      const pin = new window.Microsoft.Maps.Pushpin(location, {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="red">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 4.42 5 10.44 6.39 11.92.37.39.97.39 1.34 0C14 19.44 19 13.42 19 9c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
        </svg>`,
        anchor: new window.Microsoft.Maps.Point(15, 30),
        title: entry.title || 'Issue'
      });
  
      // Create infobox
      const infobox = new window.Microsoft.Maps.Infobox(location, {
        visible: false,
        showCloseButton: true,
        htmlContent: `
    <div class="map-infobox" style="width: 250px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
      <img src="${entry.image}" 
           style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;"
           onerror="this.src='https://via.placeholder.com/150'">
      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">${entry.title || 'Issue'}</h3>
      <p style="margin-bottom: 4px;"><strong>Status:</strong> ${entry.status || 'Unknown'}</p>
      <p style="margin-bottom: 12px;"><strong>Address:</strong> ${entry.address || 'Not provided'}</p>
      <div style="display: flex; gap: 8px;">
        <button onclick="window.getDirections(${latitude}, ${longitude})" 
          style="flex: 1; background: #3B82F4; color: white; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: 500;">
          Get Directions
        </button>
        <button onclick="window.startNavigation(${latitude}, ${longitude})" 
          style="flex: 1; background: #10B981; color: white; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: 500;">
          Navigate
        </button>
      </div>
    </div>
  `
      });
  
      // Add the pin to the map
      mapRef.current.entities.push(pin);
      mapPins.current.push(pin);
      infobox.setMap(mapRef.current);
  
      // Add event handlers
      window.Microsoft.Maps.Events.addHandler(pin, "mouseover", () => infobox.setOptions({ visible: true }));
      window.Microsoft.Maps.Events.addHandler(pin, "mouseout", () => infobox.setOptions({ visible: false }));
      window.Microsoft.Maps.Events.addHandler(pin, "click", () => {
        mapRef.current.setView({ center: location, zoom: 15 });
        infobox.setOptions({ visible: true });
      });
    } catch (error) {
      console.error('Error plotting coordinate:', error);
    }
  };
  
  // Add this helper function for fitting map to pins
  const fitMapToPins = () => {
    if (mapPins.current.length === 0 || !mapRef.current) return;
  
    const locations = mapPins.current.map((pin) => pin.getLocation());
    const bounds = window.Microsoft.Maps.LocationRect.fromLocations(...locations);
  
    mapRef.current.setView({ bounds });
  };
  // Helper function to validate coordinates
  const isValidCoordinate = (latitude, longitude) => {
    return (
      typeof latitude === 'number' && 
      typeof longitude === 'number' &&
      !isNaN(latitude) && 
      !isNaN(longitude) &&
      latitude >= -90 && 
      latitude <= 90 &&
      longitude >= -180 && 
      longitude <= 180
    );
  };

  
  const stopNavigation = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsNavigating(false);
    
    if (userMarkerRef.current && mapRef.current?.entities) {
      mapRef.current.entities.remove(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (directionsManager) {
      directionsManager.clearAll();
    }

    const directionsPanel = document.getElementById('directionsPanel');
    if (directionsPanel) {
      directionsPanel.innerHTML = '';
    }

    setIsPanelExpanded(false);
    toast.info('Navigation stopped');
  };
  
  const cancelDirections = () => {
    if (directionsManager) {
      directionsManager.clearAll();
      setIsPanelExpanded(false);
    }
    const directionsPanel = document.getElementById('directionsPanel');
    if (directionsPanel) {
      directionsPanel.innerHTML = '';
    }
  };
  // First add this helper function at the top of your component
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};
const calculateHeading = (userLoc, destLoc) => {
  const dx = destLoc.longitude - userLoc.longitude;
  const dy = destLoc.latitude - userLoc.latitude;
  const heading = (Math.atan2(dx, dy) * 180 / Math.PI);
  return heading >= 0 ? heading : heading + 360;
};
  const startNavigation = (destLat, destLng) => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
  
    if (!mapRef.current || !directionsManager) {
      toast.error('Map is not initialized');
      return;
    }
    setIsNavigating(true);
    setIsPanelExpanded(true);
    if (userMarkerRef.current && mapRef.current.entities) {
      mapRef.current.entities.remove(userMarkerRef.current);
    }
  
  
  
    // Start watching user's position
    const id = navigator.geolocation.watchPosition(
      (position) => {
        try {
          if (!mapRef.current) {
            console.error('Map reference lost during navigation');
            stopNavigation();
            return;
          }
  
          const userLoc = new window.Microsoft.Maps.Location(
            position.coords.latitude,
            position.coords.longitude
          );
          const destLoc = new window.Microsoft.Maps.Location(destLat, destLng);
          const calculatedHeading = calculateHeading(userLoc, destLoc);
          setRouteHeading(calculatedHeading); // Update the route heading
  
          // Remove previous user marker if exists
          if (userMarkerRef.current) {
            mapRef.current.entities.remove(userMarkerRef.current);
          }
         
  
          // Create navigation arrow marker
          userMarkerRef.current = new window.Microsoft.Maps.Pushpin(userLoc, {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
              <path d="M12 2L7 21l5-5 5 5L12 2z" 
                fill="#4285F4"
                transform="rotate(${position.coords.heading || calculatedHeading} 12 12)"
              />
              <circle cx="12" cy="12" r="4" fill="white"/>
              <circle cx="12" cy="12" r="2" fill="#4285F4"/>
            </svg>`,
            anchor: new window.Microsoft.Maps.Point(20, 20)
        
        
           
          });
        
            mapRef.current.entities.push(userMarkerRef.current);
            mapRef.current.setView({
              center: userLoc,
              zoom: 18,
              heading: position.coords.heading || routeHeading
            });
          
  
          // Add new marker
          //mapRef.current.entities.push(userMarkerRef.current);
          setUserLocation(userLoc);

          if (directionsManager) {
            const waypoints = directionsManager.getAllWaypoints();
            if (waypoints && waypoints.length > 0) {
              waypoints[0].setLocation(userLoc);
              directionsManager.calculateDirections();
            }
          }
  
          

          const distance = window.Microsoft.Maps.SpatialMath.getDistanceTo(
            userLoc, 
            destLoc, 
            window.Microsoft.Maps.SpatialMath.DistanceUnits.Kilometers
          );
          const speed = position.coords.speed || 0;
          const eta = speed > 0 ? formatTime((distance * 1000) / speed) : 'calculating...';
  
  
         
          const directionsPanel = document.getElementById('directionsPanel');
          if (directionsPanel) {
            const navigationInfo = document.createElement('div');
            navigationInfo.className = 'navigation-info sticky top-0 bg-white p-4 border-b';
            navigationInfo.innerHTML = `
            <div class="flex flex-col gap-3">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
                  </svg>
                  <span class="font-medium">Distance: ${distance.toFixed(2)} km</span>
                </div>
                <span class="font-medium">ETA: ${eta}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium">Speed: ${(speed * 3.6).toFixed(1)} km/h</span>
                <span class="font-medium text-green-600">Time Left: ${formatTime((distance * 1000) / (speed || 1))}</span>
              </div>
              ${distance <= 0.05 ? `
                <div class="mt-2 p-3 bg-green-50 rounded-lg">
                  <span class="font-medium text-green-800">You have arrived!</span>
                </div>
              ` : ''}
            </div>
          `;
            
          const oldInfo = directionsPanel.querySelector('.navigation-info');
          if (oldInfo) oldInfo.remove();
          directionsPanel.insertBefore(navigationInfo, directionsPanel.firstChild);
        
          }
          // mapRef.current.setView({
          //   center: userLoc,
          //   zoom: 18,
          //   heading: position.coords.heading ||  routeHeading
          // });
         
  
          // Check if arrived
          if (distance <= 0.05) {
            toast.success('You have arrived at your destination!');
            stopNavigation();
            return;
          }
  
        } catch (error) {
          console.error('Error updating navigation:', error);
          toast.error('Navigation error occurred');
          stopNavigation();
        }
      },
      (error) => {
        console.error('Position tracking error:', error);
        toast.error('Failed to track location');
        stopNavigation();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );
  
    setWatchId(id);
    toast.success('Navigation started');
  
    // Add navigation controls to directions panel
    const directionsPanel = document.getElementById('directionsPanel');
    if (directionsPanel) {
      const controls = document.createElement('div');
      controls.className = 'navigation-controls sticky top-0 bg-white p-4 shadow-md';
      controls.innerHTML = `
      <div class="flex flex-col gap-3">
        <div class="flex justify-between items-center">
          <span class="font-medium text-lg">Turn-by-Turn Navigation</span>
        </div>
        <div class="flex gap-2">
          <button onclick="window.stopNavigation()" 
            class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Stop Navigation
          </button>
          <button onclick="window.cancelDirections()"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Close
          </button>
        </div>
      </div>
    `;
      directionsPanel.insertBefore(controls, directionsPanel.firstChild);
    }
  };
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = new window.Microsoft.Maps.Location(
          position.coords.latitude,
          position.coords.longitude
        );
        setUserLocation(location);
        mapRef.current.setView({ center: location, zoom: 15 });
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Failed to get your location');
      }
    );
  };

 
  // Add this function before the return statement
const getDirections = async (destLat, destLng) => {
  try {
    if (!directionsManager) {
      toast.error('Directions service not available');
      return;
    }

    // Clear previous directions
    directionsManager.clearAll();

    // Get user's current location
    const currentLocation = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }),
        error => reject(error)
      );
    });

    // Set waypoints
    const start = new window.Microsoft.Maps.Location(
      currentLocation.latitude,
      currentLocation.longitude
    );
    const end = new window.Microsoft.Maps.Location(destLat, destLng);

    // Add waypoints to directions manager
    directionsManager.addWaypoint(new window.Microsoft.Maps.Directions.Waypoint({
      location: start
    }));
    directionsManager.addWaypoint(new window.Microsoft.Maps.Directions.Waypoint({
      location: end
    }));

    // Set render options
    directionsManager.setRenderOptions({
      itineraryContainer: document.getElementById('directionsPanel'),
      showInputPanel: false,
      waypointPushpinOptions: {
        visible: false
      },
      drivingPolylineOptions: {
        strokeColor: '#4285F4',
        strokeThickness: 6
      }
    });

    // Calculate directions
    await directionsManager.calculateDirections();
    
    // Expand the directions panel
    setIsPanelExpanded(true);

    const directionsPanel = document.getElementById('directionsPanel');
    if (directionsPanel) {
      const navigationControls = document.createElement('div');
      navigationControls.className = 'navigation-controls sticky top-0 bg-white p-4 shadow-md';
      navigationControls.innerHTML = `
        <div class="flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Start Navigation?</h3>
          </div>
          <div class="flex gap-2">
            <button onclick="window.startNavigation(${destLat}, ${destLng})" 
              class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5l7 7-7 7-7-7 7-7z"/>
              </svg>
              Start Navigation
            </button>
            <button onclick="window.cancelDirections()"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Close
            </button>
          </div>
        </div>
      `;
      directionsPanel.insertBefore(navigationControls, directionsPanel.firstChild);
    }
    
    toast.success('Route calculated successfully');
  } catch (error) {
    console.error('Error getting directions:', error);
    toast.error('Failed to get directions');
  }
};

// Also add this helper function
const loadDirectionsModule = () => {
  return new Promise((resolve, reject) => {
    window.Microsoft.Maps.loadModule('Microsoft.Maps.Directions', {
      callback: () => {
        try {
          const directionsManager = new window.Microsoft.Maps.Directions.DirectionsManager(mapRef.current);
          setDirectionsManager(directionsManager);
          resolve(directionsManager);
        } catch (error) {
          reject(error);
        }
      },
      errorCallback: reject
    });
  });
};
  
  
    return (
      <div className="min-h-screen flex flex-col relative">
        {/* Map container */}
        <div
          ref={mapContainerRef}
          className="w-full h-screen absolute inset-0"
          style={{ minHeight: "500px" }}
        >
          {!isMapLoaded && (
            <div className="flex items-center justify-center h-full">
              <div className="text-xl">Loading map...</div>
            </div>
          )}
        </div>
  
        {/* Navigation status with Stop button */}
        {isNavigating && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-white px-4 py-3 rounded-lg shadow-lg space-y-2">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-blue-800">Navigation Active</span>
              </div>
              <button
                onClick={stopNavigation}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Stop Navigation
              </button>
            </div>
          </div>
        )}
  
        {/* Enhanced Directions panel */}
        // Update the directions panel JSX
<div className={`directions-panel ${isPanelExpanded ? 'expanded' : ''}`}>
  <div className="panel-header">
    <div className="flex justify-between items-center px-4">
      <h3 className="text-lg font-semibold text-gray-700">Directions</h3>
      <button
        onClick={() => setIsPanelExpanded(!isPanelExpanded)}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform duration-200 ${isPanelExpanded ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        {isPanelExpanded ? 'Hide Details' : 'Show Details'}
      </button>
    </div>
  </div>
  <div className="directions-content">
    <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 64px)' }}>
      <div id="directionsPanel"></div>
    </div>
  </div>
</div>
  
        <style>
          {`
            .directions-panel {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              background: white;
              border-top-left-radius: 20px;
              border-top-right-radius: 20px;
              box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
              transition: all 0.3s ease-in-out;
              max-height: 80vh;
              z-index: 1000;
              transform: translateY(85%);
            }
  
            .directions-panel.expanded {
              transform: translateY(0);
            }
  
            .panel-header {
              padding: 12px 0;
              text-align: center;
              border-bottom: 1px solid #e5e7eb;
            }
            // Update these styles in your existing style block
.directions-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease-in-out;
  max-height: 80vh;
  z-index: 1000;
  transform: translateY(calc(100% - 64px));
}

.directions-panel.expanded {
  transform: translateY(0);
}

.panel-header {
  padding: 12px 0;
  background: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.directions-content {
  background: #ffffff;
  height: calc(80vh - 64px);
  overflow-y: hidden;
}

#directionsPanel {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  padding: 16px;
}

#directionsPanel > div {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 8px;
}

#directionsPanel img {
  margin: 8px 0;
  border-radius: 4px;
}
           
  
        
  
            .directions-content {
              background: #ffffff;
              border-top: 1px solid #e5e7eb;
            }
  
            .map-infobox {
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              overflow: hidden;
              transition: all 0.2s ease;
            }
  
            .map-infobox:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(0,0,0,0.2);
            }
  
            #directionsPanel {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
  
            #directionsPanel > div {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
            }
  
            #directionsPanel img {
              margin: 8px 0;
            }
          `}
        </style>
      </div>
    );
  };
export default Location;
