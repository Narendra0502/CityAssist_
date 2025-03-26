import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const Location = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapPins = useRef([]);

  useEffect(() => {
    const loadBingMapsScript = () => {
      if (window.Microsoft && window.Microsoft.Maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.bing.com/api/maps/mapcontrol?key=ArSGwElpgs65UXUwCnZ4ibhLzkmxuScTxz0rCq_kgJy35pa2tSq229GIMzMPVQ8P`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.Microsoft && window.Microsoft.Maps) {
          initMap();
        }
      };
      document.body.appendChild(script);
    };

    const initMap = async () => {

      if (!mapContainerRef.current) {
        console.error('Map container reference is not available');
        return;
      }
      
      try {

        if (!window.Microsoft || !window.Microsoft.Maps) {
          console.error('Bing Maps API not loaded yet!');
          return;
        }

        // Create map instance
        mapRef.current = new window.Microsoft.Maps.Map(mapContainerRef.current, {
          credentials: 'ArSGwElpgs65UXUwCnZ4ibhLzkmxuScTxz0rCq_kgJy35pa2tSq229GIMzMPVQ8P',
          center: new window.Microsoft.Maps.Location(28.62821, 77.338091), // Set to your default coordinates
          zoom: 12,
          mapTypeId: window.Microsoft.Maps.MapTypeId.road
        });
        
        //console.log('Map initialized successfully');
        setIsMapLoaded(true);
        
        // Fetch coordinates after map is initialized
        setTimeout(fetchCoordinates, 2000); 
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };
    
    // Also update the loadBingMapsScript function:
    // const loadBingMapsScript = () => {
    //   // Check if script is already loaded
    //   if (window.Microsoft && window.Microsoft.Maps && window.Microsoft.Maps.Location) {
    //     initMap();
    //     return;
    //   }
    
    //   const script = document.createElement('script');
    //   script.type = 'text/javascript';
    //   script.src = `https://www.bing.com/api/maps/mapcontrol?key=ArSGwElpgs65UXUwCnZ4ibhLzkmxuScTxz0rCq_kgJy35pa2tSq229GIMzMPVQ8P`;
    //   script.async = true;
    //   script.defer = true;
    //   script.onload = () => {
    //     initMap();
    //   };
    //   document.body.appendChild(script);
    // };

    const fetchCoordinates = () => {
      const token = localStorage.getItem("token"); // Retrieve token from local storage

      if (!token) {
        console.error("No token found, user might not be authenticated.");
        return;
      }
    
      fetch('http://localhost:5000/admin/getUserIssueData',{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Send token in Authorization header
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        //console.log("Raw data from API:", data);
          
          // Use all data without filtering
          const allData = Array.isArray(data) ? data : [];
          
          //console.log('Data to plot:', allData);
          
          allData.forEach(entry => {
            const latitude = parseFloat(entry.latitude);
            const longitude = parseFloat(entry.longitude);
            //console.log(`Plotting point: lat ${latitude}, lng ${longitude}`);
            
            if (isValidCoordinate(latitude, longitude)) {
              plotCoordinate(latitude, longitude, entry);
            }  else {
              console.error(`Invalid coordinate: latitude ${latitude}, longitude ${longitude}`);
            }
          });
          setTimeout(fitMapToPins, 1000);
        })
        .catch(error => console.error('Error fetching coordinates:', error));
    };

    const isValidCoordinate = (latitude, longitude) => {
      return (
          !isNaN(latitude) && latitude >= -90 && latitude <= 90 &&
          !isNaN(longitude) && longitude >= -180 && longitude <= 180
      );
  };
  
    const plotCoordinate = (latitude, longitude, entry) => {
      //console.log('Attempting to plot coordinate:', { latitude, longitude, entry });
      
      if (!mapRef.current || !window.Microsoft) {
        console.error('Map reference or Microsoft Maps API is not available');
        return;
      }
     
      
      try {
        const location = new window.Microsoft.Maps.Location(latitude, longitude);
        const pin = new window.Microsoft.Maps.Pushpin(location, {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="red"><path d="M12 2C8.13 2 5 5.13 5 9c0 4.42 5 10.44 6.39 11.92.37.39.97.39 1.34 0C14 19.44 19 13.42 19 9c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>`,
          anchor: new window.Microsoft.Maps.Point(15, 30),
          title: entry.title || 'Issue'
        });
    
        // Create infobox
        const infobox = new window.Microsoft.Maps.Infobox(location, {
          visible: false,
          showCloseButton: true,
          htmlContent: `
          <div style="width: 200px; padding: 10px; background: white; border: 1px solid #ccc;">
            <img src="${entry.image}" style="max-width: 100%; height: auto;">
            <h3>${entry.title || 'Issue'}</h3>
            <p><strong>Status:</strong> ${entry.status || 'Unknown'}</p>
            <p><strong>Address:</strong> ${entry.address || 'Not provided'}</p>
          </div>
        `
        });
    
        // Add the pin to the map
        mapRef.current.entities.push(pin);
        mapPins.current.push(pin);
        infobox.setMap(mapRef.current);
        //console.log('Successfully added pin to map');
    
        // Center and zoom the map to show the pin
        window.Microsoft.Maps.Events.addHandler(pin, "mouseover", () => infobox.setOptions({ visible: true }));
        window.Microsoft.Maps.Events.addHandler(pin, "mouseout", () => infobox.setOptions({ visible: false }));
        window.Microsoft.Maps.Events.addHandler(pin, "click", () => {
          mapRef.current.setView({ center: location, zoom: 15 });
          infobox.setOptions({ visible: true });
        // Add event handlers
        });
      } catch (error) {
        console.error('Error plotting coordinate:', error);
      }
    };
    const fitMapToPins = () => {
      if (mapPins.current.length === 0 || !mapRef.current) return;

      const locations = mapPins.current.map((pin) => pin.getLocation());
      const bounds = window.Microsoft.Maps.LocationRect.fromLocations(...locations);

      mapRef.current.setView({ bounds });
      //console.log("Map view adjusted to fit all pins");
    };

    loadBingMapsScript();

    // Cleanup function
    return () => {
      // No need to remove the script as it might be used by other components
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, []);

  // const toggleMenu = () => {
  //   const menuOptions = document.getElementById('menu-options');
  //   if (menuOptions.style.display === 'none' || menuOptions.style.display === '') {
  //     menuOptions.style.display = 'block';
  //   } else {
  //     menuOptions.style.display = 'none';
  //   }
  // };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     const menuOptions = document.getElementById('menu-options');
  //     const menuIcon = document.getElementById('menu-icon');

  //     if (menuOptions && menuIcon && !menuOptions.contains(event.target) && event.target !== menuIcon) {
  //       menuOptions.style.display = 'none';
  //     }
  //   };

  //   document.addEventListener('click', handleClickOutside);

  //   return () => {
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, []);

  return (
    <div className="min-h-screen flex flex-col">
     

      {/* Map container */}
      <div 
        ref={mapContainerRef} 
        className="flex-grow w-full h-screen"
        style={{ minHeight: "500px" }}
      >
        {!isMapLoaded && (
          <div className="flex items-center justify-center h-full">
            <div className="text-xl">Loading map...</div>
          </div>
        )}
      </div>
      <style>
        {`
          .bing-map-popup {
            width: 220px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
          }
          .bing-map-popup img {
            max-width: 100%;
            border-radius: 5px;
          }
          .bing-map-popup h3 {
            font-size: 16px;
            margin: 5px 0;
          }
          .bing-map-popup p {
            font-size: 14px;
            margin: 2px 0;
          }
          .bing-map-popup.visible {
            opacity: 1;
            transform: translateY(0);
          }
        `}
      </style>
    </div>
  );
};

export default Location;
