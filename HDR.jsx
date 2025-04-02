import React, { useState, useEffect } from 'react';
import { scaleLog, scaleLinear } from 'd3';

const HRDiagram = () => {
  // Sample star data with temperature, luminosity, radius, and star type
  const [stars, setStars] = useState([
    { id: 1, name: "Sun", temp: 5778, lum: 1, radius: 1, type: "G-type main sequence" },
    { id: 2, name: "Sirius A", temp: 9940, lum: 25.4, radius: 1.71, type: "A-type main sequence" },
    { id: 3, name: "Betelgeuse", temp: 3500, lum: 126000, radius: 887, type: "Red supergiant" },
    { id: 4, name: "Rigel", temp: 12100, lum: 120000, radius: 78.9, type: "Blue supergiant" },
    { id: 5, name: "Proxima Centauri", temp: 3042, lum: 0.0017, radius: 0.141, type: "Red dwarf" },
    { id: 6, name: "Vega", temp: 9602, lum: 40.12, radius: 2.362, type: "A-type main sequence" },
    { id: 7, name: "Aldebaran", temp: 3910, lum: 518, radius: 44.2, type: "Red giant" },
    { id: 8, name: "Antares", temp: 3500, lum: 75900, radius: 680, type: "Red supergiant" },
    { id: 9, name: "Procyon A", temp: 6530, lum: 7.427, radius: 2.048, type: "F-type main sequence" },
    { id: 10, name: "Pollux", temp: 4666, lum: 43, radius: 8.8, type: "K-type giant" },
    { id: 11, name: "Deneb", temp: 8525, lum: 196000, radius: 203, type: "Blue-white supergiant" },
    { id: 12, name: "Canopus", temp: 7400, lum: 10700, radius: 71, type: "F-type bright giant" },
    { id: 13, name: "Arcturus", temp: 4286, lum: 170, radius: 25.4, type: "K-type giant" },
    { id: 14, name: "Spica", temp: 22400, lum: 20512, radius: 7.47, type: "B-type main sequence" },
    { id: 15, name: "Capella", temp: 5700, lum: 78.7, radius: 12, type: "G-type giant" }
  ]);

  const [selectedStar, setSelectedStar] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTypes, setFilteredTypes] = useState([]);

  // Extract unique star types for the filter
  const starTypes = [...new Set(stars.map(star => star.type))];

  // Define the dimensions and scales
  const width = 600;
  const height = 500;
  const margin = { top: 40, right: 40, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scales - temperature (x-axis) should be reversed and logarithmic
  const xScale = scaleLog()
    .domain([40000, 2000]) // Temperature range (reversed)
    .range([0, innerWidth]);

  const yScale = scaleLog()
    .domain([0.0001, 1000000]) // Luminosity range
    .range([innerHeight, 0]);

  // Filter stars based on search and type filters
  const filteredStars = stars.filter(star => {
    const matchesSearch = star.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filteredTypes.length === 0 || filteredTypes.includes(star.type);
    return matchesSearch && matchesType;
  });

  // Handler for star selection
  const handleStarClick = (star) => {
    setSelectedStar(star === selectedStar ? null : star);
  };

  // Toggle star type filter
  const toggleTypeFilter = (type) => {
    setFilteredTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  // Star size based on radius (logarithmic scale for visibility)
  const getStarSize = (radius) => {
    return Math.max(4, Math.min(20, 4 + Math.log10(radius) * 3));
  };

  // Star color based on temperature
  const getStarColor = (temp) => {
    if (temp > 30000) return "#9bb0ff"; // O-type
    if (temp > 10000) return "#aabfff"; // B-type
    if (temp > 7500) return "#cad7ff";  // A-type
    if (temp > 6000) return "#f8f7ff";  // F-type
    if (temp > 5200) return "#fff4ea";  // G-type
    if (temp > 3700) return "#ffd2a1";  // K-type
    return "#ffcc6f";                   // M-type
  };

  // Label for spectral class
  const getSpectralClass = (temp) => {
    if (temp > 30000) return "O";
    if (temp > 10000) return "B";
    if (temp > 7500) return "A";
    if (temp > 6000) return "F";
    if (temp > 5200) return "G";
    if (temp > 3700) return "K";
    return "M";
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Interactive Hertzsprung-Russell Diagram</h2>
      
      {/* Search and filters */}
      <div className="w-full flex flex-col sm:flex-row justify-between mb-4">
        <div className="mb-2 sm:mb-0">
          <input 
            type="text" 
            placeholder="Search stars..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {starTypes.map(type => (
            <button
              key={type}
              onClick={() => toggleTypeFilter(type)}
              className={`px-2 py-1 text-xs rounded ${
                filteredTypes.includes(type) 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
          {filteredTypes.length > 0 && (
            <button
              onClick={() => setFilteredTypes([])}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      
      {/* Main HR diagram */}
      <div className="relative bg-white rounded-lg shadow-md">
        <svg width={width} height={height}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            {/* Background grid */}
            <rect 
              x={0} 
              y={0} 
              width={innerWidth} 
              height={innerHeight} 
              fill="#f8f9fa" 
              stroke="#e9ecef"
            />
            
            {/* Main sequence line (simplified) */}
            <path 
              d={`M ${xScale(30000)} ${yScale(100000)} 
                  L ${xScale(10000)} ${yScale(1000)} 
                  L ${xScale(6000)} ${yScale(1)} 
                  L ${xScale(3000)} ${yScale(0.001)}`} 
              stroke="#aaa" 
              strokeDasharray="5,5" 
              fill="none" 
            />
            
            {/* Stars */}
            {filteredStars.map(star => (
              <g key={star.id}>
                <circle
                  cx={xScale(star.temp)}
                  cy={yScale(star.lum)}
                  r={getStarSize(star.radius)}
                  fill={getStarColor(star.temp)}
                  stroke={selectedStar === star || hoveredStar === star ? "#000" : "none"}
                  strokeWidth={2}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                  style={{ cursor: 'pointer' }}
                />
                {(selectedStar === star || hoveredStar === star) && (
                  <text
                    x={xScale(star.temp)}
                    y={yScale(star.lum) - getStarSize(star.radius) - 5}
                    textAnchor="middle"
                    fill="#333"
                    fontSize="12px"
                  >
                    {star.name}
                  </text>
                )}
              </g>
            ))}
            
            {/* X-axis */}
            <g transform={`translate(0,${innerHeight})`}>
              <line x1={0} y1={0} x2={innerWidth} y2={0} stroke="#333" />
              <text 
                x={innerWidth / 2} 
                y={40} 
                textAnchor="middle" 
                fill="#333"
                fontSize="14px"
              >
                Surface Temperature (K)
              </text>
              {[40000, 20000, 10000, 5000, 3000].map(temp => (
                <g key={temp} transform={`translate(${xScale(temp)},0)`}>
                  <line y1={0} y2={5} stroke="#333" />
                  <text 
                    y={20} 
                    textAnchor="middle" 
                    fill="#333"
                    fontSize="12px"
                  >
                    {temp.toLocaleString()}
                  </text>
                </g>
              ))}
              {/* Spectral classes */}
              {[35000, 15000, 8750, 6500, 5500, 4500, 3000].map((temp, i) => (
                <text 
                  key={i}
                  x={xScale(temp)} 
                  y={-innerHeight - 20} 
                  textAnchor="middle" 
                  fill={getStarColor(temp)}
                  stroke="#333"
                  strokeWidth="0.5"
                  fontSize="14px"
                  fontWeight="bold"
                >
                  {getSpectralClass(temp)}
                </text>
              ))}
            </g>
            
            {/* Y-axis */}
            <g>
              <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="#333" />
              <text 
                transform={`translate(-40,${innerHeight/2}) rotate(-90)`} 
                textAnchor="middle" 
                fill="#333"
                fontSize="14px"
              >
                Luminosity (L☉)
              </text>
              {[0.0001, 0.01, 1, 100, 10000, 1000000].map(lum => (
                <g key={lum} transform={`translate(0,${yScale(lum)})`}>
                  <line x1={-5} x2={0} stroke="#333" />
                  <text 
                    x={-10} 
                    textAnchor="end" 
                    alignmentBaseline="middle"
                    fill="#333"
                    fontSize="12px"
                  >
                    {lum === 1 ? '1' : lum.toExponential(0)}
                  </text>
                </g>
              ))}
            </g>
            
            {/* Labels for star categories */}
            <text x={xScale(3500)} y={yScale(50000)} fill="#333" fontSize="12px">Red Giants</text>
            <text x={xScale(25000)} y={yScale(100000)} fill="#333" fontSize="12px">Blue Giants</text>
            <text x={xScale(15000)} y={yScale(1)} fill="#333" fontSize="12px">Main Sequence</text>
            <text x={xScale(3500)} y={yScale(0.001)} fill="#333" fontSize="12px">Red Dwarfs</text>
            <text x={xScale(20000)} y={yScale(0.01)} fill="#333" fontSize="12px">White Dwarfs</text>
          </g>
        </svg>
      </div>
      
      {/* Star details panel */}
      {selectedStar && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md w-full">
          <h3 className="text-xl font-bold">{selectedStar.name}</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p><strong>Type:</strong> {selectedStar.type}</p>
              <p><strong>Temperature:</strong> {selectedStar.temp.toLocaleString()} K</p>
              <p><strong>Spectral Class:</strong> {getSpectralClass(selectedStar.temp)}</p>
            </div>
            <div>
              <p><strong>Luminosity:</strong> {selectedStar.lum} L☉</p>
              <p><strong>Radius:</strong> {selectedStar.radius} R☉</p>
              <p><strong>Color:</strong> <span className="inline-block w-4 h-4 rounded-full ml-2" style={{backgroundColor: getStarColor(selectedStar.temp)}}></span></p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Click on stars to view details. Use the filters to highlight specific star types.</p>
        <p>L☉ = Solar luminosity, R☉ = Solar radius</p>
      </div>
    </div>
  );
};

export default HRDiagram;
