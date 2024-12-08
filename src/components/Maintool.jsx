"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Satellite, Map, Bell, Database, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// This is to ensure the marker icon shows correctly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function Maintool() {
  const [coordinates, setCoordinates] = useState('');
  const [cloudCover, setCloudCover] = useState(15);
  const [timespan, setTimespan] = useState('recent');
  const [selectedBand, setSelectedBand] = useState('natural');
  const [metadata, setMetadata] = useState({
    wrsInfo: '---',
    acqDate: '---',
    cloudPercent: '---',
    satellite: '---',
    qualityScores: { geometric: 0, radiometric: 0, atmospheric: 0 },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [position, setPosition] = useState([40.0, -100.0]); // Default coordinates

  const handleCoordinatesChange = (newCoordinates) => {
    setCoordinates(newCoordinates);
  };

  const imageUrls = [
    'https://landsatlook.usgs.gov/gen-browse?size=rrb&type=refl&product_id=LC09_L1TP_146040_20240924_20240924_02_T1',
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150',
  ];
const [showImages, setShowImages] = useState(false);
  
  const handleUpdateData = () => {
    setShowImages(true);  
    setIsLoading(true);
    setTimeout(() => {
      const newMetadata = generateSceneMetadata(lat, lng);
      setMetadata({
        wrsInfo: `Path: ${newMetadata.wrsPath}, Row: ${newMetadata.wrsRow}`,
        acqDate: `${newMetadata.acquisitionDate} ${newMetadata.acquisitionTime}`,
        cloudPercent: `${newMetadata.cloudCover}%`,
        satellite: `${newMetadata.satellite} (${newMetadata.satelliteId})`,
        qualityScores: newMetadata.qualityScores,
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleDownloadData = () => {
    console.log('Downloading data...');
  };

  // Custom hook to handle map events
  const MapClick = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLat(lat);
        setLng(lng);
        setCoordinates(`${lat}, ${lng}`);
        setPosition([lat, lng]);
      },
    });
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      <header className="sticky top-0 z-10 bg-black bg-opacity-90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Satellite className="h-6 w-6 text-white" />
              <span className="text-xl font-semibold text-white">LandsatCompare</span>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4">
        <div className="container mx-auto max-w-6xl">
          {/* Move the Map Container to the top */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Map</h2>
            <MapContainer center={position} zoom={4} className="h-96">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={position}>
                <Popup>
                  Coordinates: {coordinates}
                </Popup>
              </Marker>
              <MapClick />
            </MapContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Location Selection</h2>

              <div className="mt-4">
                <label htmlFor="coordinates" className="block text-sm font-medium text-gray-300">
                  Selected Coordinates:
                </label>
                <input
                  type="text"
                  id="coordinates"
                  value={coordinates}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="cloudCover" className="block text-sm font-medium text-gray-300">
                  Maximum Cloud Cover: {cloudCover}%
                </label>
                <input
                  type="range"
                  id="cloudCover"
                  min="0"
                  max="100"
                  value={cloudCover}
                  onChange={(e) => setCloudCover(Number(e.target.value))}
                  className="mt-1 block w-full"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="timespan" className="block text-sm font-medium text-gray-300">Time Span:</label>
                <select
                  id="timespan"
                  value={timespan}
                  onChange={(e) => setTimespan(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="recent">Most Recent</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                  <option value="year">Past Year</option>
                </select>
              </div>

              <button
                onClick={handleUpdateData}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Update Data
              </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Landsat Data Analysis</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p><strong>WRS Path/Row:</strong> {metadata.wrsInfo}</p>
                  <p><strong>Acquisition Date:</strong> {metadata.acqDate}</p>
                </div>
                <div>
                  <p><strong>Cloud Cover:</strong> {metadata.cloudPercent}</p>
                  <p><strong>Satellite:</strong> {metadata.satellite}</p>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Quality Scores+></h3>
                <ul className="list-disc list-inside">
                  <li>Geometric: {metadata.qualityScores.geometric}/10</li>
                  <li>Radiometric: {metadata.qualityScores.radiometric}/10</li>
                  <li>Atmospheric: {metadata.qualityScores.atmospheric}/10</li>
                </ul>
              </div>
              <div className="mb-4">
                <label htmlFor="bandSelector" className="block text-sm font-medium text-gray-300">Display Band:</label>
                <select
                  id="bandSelector"
                  value={selectedBand}
                  onChange={(e) => setSelectedBand(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="natural">Natural Color</option>
                  <option value="ndvi">NDVI</option>
                  <option value="swir">SWIR</option>
                </select>
              </div>
              <h3 className="text-lg font-semibold mb-2">Pixel Grid (3x3)</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
      {imageUrls.map((url, index) => (
       <div>
       {showImages && (
         <div className="grid grid-cols-3 gap-2 mt-4">
           {imageUrls.map((url, index) => (
             <div key={index} className="bg-gray-700 p-4 rounded-md text-center">
               <img src={url} alt={`Image ${index}`} className="rounded-md" />
             </div>
           ))}
         </div>
       )}
     </div>
      ))}
    </div>

              <h3 className="text-lg font-semibold mb-2">Spectral Response</h3>
              <Bar
                data={{
                  labels: ['Band 1', 'Band 2', 'Band 3', 'Band 4', 'Band 5', 'Band 6', 'Band 7', 'Band 8'],
                  datasets: [{
                    label: 'Spectral Response',
                    data: Array(8).fill(null).map(() => Math.random()),
                    backgroundColor: 'rgba(52, 152, 219, 0.5)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1,
                  }],
                }}
                options={{
                  responsive: true,
                  scales: {
                    x: {
                      type: 'category',
                    },
                    y: {
                      beginAtZero: true,
                      type: 'linear',
                    },
                  },
                }}
              />
              <button
                onClick={handleDownloadData}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="mr-2" />
                Download Data (CSV)
              </button>
            </div>
          </div>
        </div>
      </main>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
}

function generateSceneMetadata(lat, lon) {
  const satellites = [
    { name: 'Landsat 8', id: 'LC08' },
    { name: 'Landsat 9', id: 'LC09' },
  ];
  const selectedSatellite = satellites[Math.floor(Math.random() * satellites.length)];

  const path = Math.floor((180 + parseFloat(lon)) / 360 * 233) + 1;
  const row = Math.floor((82.5 - parseFloat(lat)) / 165 * 248) + 1;

  const currentDate = new Date();
  const pastDate = new Date(currentDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
  const acquisitionDate = pastDate.toISOString().split('T')[0];

  const hours = Math.floor(Math.random() * 4) + 9;
  const minutes = Math.floor(Math.random() * 60);
  const acquisitionTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  const cloudCover = (Math.random() * Math.random() * 100).toFixed(2);

  const qualityScores = {
    geometric: Math.floor(Math.random() * 3) + 8,
    radiometric: Math.floor(Math.random() * 3) + 8,
    atmospheric: Math.floor(Math.random() * 3) + 8,
  };

  return {
    satellite: selectedSatellite.name,
    satelliteId: selectedSatellite.id,
    wrsPath: path,
    wrsRow: row,
    acquisitionDate: acquisitionDate,
    acquisitionTime: acquisitionTime,
    cloudCover: cloudCover,
    qualityScores: qualityScores,
    sceneCenterCoordinates: {
      latitude: parseFloat(lat).toFixed(6),
      longitude: parseFloat(lon).toFixed(6),
    },
  };
}
