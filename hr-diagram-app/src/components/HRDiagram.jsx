import React, { useState } from 'react';
import './HRDiagram.css';

const HRDiagram = () => {
  const stars = [
    { id: 1, name: "Our Sun", temp: 5778, lum: 1, type: "Medium Star", description: "Our Sun!" },
    { id: 2, name: "Altair", temp: 7509.2942473638800, lum: 9.979192445462430, description: "A bright, hot star in the constellation Aquila." },
    { id: 3, name: "Deneb", temp: 8503.284796430230, lum: 196002.62785575100, description: "One of the most luminous stars known, a blue-white supergiant." },
    { id: 5, name: "Barnard's Star", temp: 3165.9596392449000, lum: 0.0044, description: "One of the nearest stars to our solar system, a small red dwarf." },
    { id: 6, name: "Polaris", temp: 6048.326914763770, lum: 2196.241933606860, description: "The North Star, a yellow supergiant star." },
    { id: 7, name: "Sirius B", temp: 25200, lum: 0.0025, description: "A white dwarf companion to Sirius A, very hot but dim." },
    { id: 8, name: "Fomalhaut", temp: 8541.195355142640, lum: 19.314803198342800, description: "A bright star surrounded by a debris disk, similar to our early solar system." },
    { id: 9, name: "Capella", temp: 4979.492462093150, lum: 77.4665468627819, description: "Actually a system of four stars, with the main star being a yellow giant." },
    { id: 10, name: "Bellatrix", temp: 22573.286177203300, lum: 6399.344000391580, description: "A hot blue giant star in the constellation Orion." },
    { id: 11, name: "Castor", temp: 10334.140338882200, lum: 59.933641755721200, description: "A sextuple star system with the main star being hot and bright." },
    { id: 12, name: "Betelgeuse", temp: 3472.6066444708500, lum: 125997.20910038500, description: "A massive red supergiant that may explode as a supernova in the relatively near future." },
    { id: 13, name: "Regulus", temp: 12478.930088621600, lum: 290.3679076360730, description: "The brightest star in the constellation Leo." },
    { id: 14, name: "Lalande 21185", temp: 3420.0741335824800, lum: 0.0046, description: "One of the nearest stars to Earth, a small red dwarf star." },
    { id: 15, name: "Vega", temp: 9631.823941413110, lum: 43.21333423901170, description: "One of the brightest stars in the night sky, a relatively young star." },
    { id: 16, name: "Wolf 359", temp: 2786.809004459220, lum: 0.0010, description: "One of the lowest-mass stars known that still undergoes nuclear fusion." },
    { id: 17, name: "40 Eridani B", temp: 5126, lum: 0.0055, description: "A white dwarf star that is part of a triple star system." },
    { id: 18, name: "Procyon B", temp: 7740, lum: 0.00049, description: "A white dwarf companion to Procyon A, much dimmer than its companion." }
  ];

  const [currSelectStar, setCurrStar] = useState(null);
  const [showStarInfo, setshowStarInfo] = useState(false);

  const maxTemp = 27000;
  const minTemp = 2000;
  const minLum = -3.5; 
  const maxLum = 6;

  const width = 1000;
  const height = 600;
  const margin = { top: 50, right: 50, bottom: 70, left: 70 }; // Increased margins for axis labels
  
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  
  const findX = (temp) => {
    return plotWidth - ((temp - minTemp) / (maxTemp - minTemp) * plotWidth);
  };
  const findY = (lum) => {
    const logLum = Math.log10(lum);
    return plotHeight - ((logLum - minLum) / (maxLum - minLum) * plotHeight);
  };
  
  // blue, white, yellow, orange, red
  const chartColor = (temp) => { 
    if (temp > 10000) return "#AFEEEE"; 
    if (temp > 7500) return "#FFFFFF";  
    if (temp > 5000) return "#FFFF99";  
    if (temp > 3500) return "#FFA07A";  
    return "#FF6347";                    
  };
  
  const chartStarSize = (lum) => {
    if (lum > 1000) return 19;  
    if (lum > 10) return 13;   
    if (lum > 0.1) return 9;    
    return 6;                   
  };
  
  const tempTicks = [3000, 5000, 10000, 20000];
  const lumTicks = [0.0003, 0.001, 0.01, 0.1, 1, 10, 100, 1000, 10000, 100000];
  
  const onStarClick = (star) => {
    setCurrStar(star);
    setshowStarInfo(true);
  };
  const closeInfoBox = () => {
    setshowStarInfo(false);
  };

  return (
    <div className="hr-container">
      <h2 className="hr-title">Interactive Hertzsprung-Russell Diagram</h2>

      <div className="hr-diagram">
        <svg width={width} height={height}>
          <line 
            x1={margin.left} 
            y1={height - margin.bottom} 
            x2={width - margin.right} 
            y2={height - margin.bottom} 
            stroke="white" 
            strokeWidth="2" 
          />
          <text 
            x={width/2} 
            y={height - 10} 
            textAnchor="middle" 
            fill="white" 
            fontSize="14px"
          >
            Temperature (K) - Hot → Cool
          </text>
        
          {tempTicks.map((temp) => (
            <g key={`temp-${temp}`}>
              <line 
                x1={margin.left + findX(temp)} 
                y1={height - margin.bottom} 
                x2={margin.left + findX(temp)} 
                y2={height - margin.bottom + 5} 
                stroke="white" 
                strokeWidth="1" 
              />
              <text 
                x={margin.left + findX(temp)} 
                y={height - margin.bottom + 20} 
                textAnchor="middle" 
                fill="white" 
                fontSize="12px"
              >
                {temp.toLocaleString()}K
              </text>
            </g>
          ))}
          
          <line 
            x1={margin.left} 
            y1={margin.top} 
            x2={margin.left} 
            y2={height - margin.bottom} 
            stroke="white" 
            strokeWidth="2" 
          />
          <text 
            transform={`translate(15, ${height/2}) rotate(-90)`} 
            textAnchor="middle" 
            fill="white" 
            fontSize="14px"
          >
            Brightness (Luminosity)
          </text>
          
          {lumTicks.map((lum) => (
            <g key={`lum-${lum}`}>
              <line 
                x1={margin.left} 
                y1={margin.top + findY(lum)} 
                x2={margin.left - 5} 
                y2={margin.top + findY(lum)} 
                stroke="white" 
                strokeWidth="1" 
              />
              <text 
                x={margin.left - 10} 
                y={margin.top + findY(lum)} 
                textAnchor="end" 
                dominantBaseline="middle"
                fill="white" 
                fontSize="12px"
              >
                {lum < 1 ? lum.toFixed(3) : lum >= 1000 ? lum.toExponential(0) : lum}
              </text>
            </g>
          ))}
          
          <text x={margin.left + plotWidth - 250} y={margin.top + 100} fill="white" fontSize="12px" fontWeight="bold">
            Giants & Super Giants
          </text>
          <text x={margin.left + plotWidth/2 - 50} y={margin.top + plotHeight/2} fill="white" fontSize="12px" fontWeight="bold">
            Main Sequence Stars
          </text>
          <text x={margin.left + 200} y={margin.top + plotHeight - 50} fill="white" fontSize="12px" fontWeight="bold">
            White Dwarves
          </text>
          
          <path 
            d={`M ${margin.left + findX(19000)} ${margin.top + findY(11000)} 
                L ${margin.left + findX(9000)} ${margin.top + findY(50)} 
                L ${margin.left + findX(2500)} ${margin.top + findY(0.01)} `} 
            stroke="yellow" 
            strokeWidth="2" 
            fill="none" 
            strokeDasharray="5,5" 
          />
          
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {stars.map(star => (
              <circle
                key={star.id}
                cx={findX(star.temp)}
                cy={findY(star.lum)}
                r={chartStarSize(star.lum)}
                fill={chartColor(star.temp)}
                stroke="white"
                strokeWidth="1"
                onClick={() => onStarClick(star)}
                style={{ cursor: 'pointer' }}
                
              />
            ))}
            
            {stars.map(star => (
              <text
                key={`label-${star.id}`}
                x={findX(star.temp)}
                y={findY(star.lum) - chartStarSize(star.lum) - 5}
                textAnchor="middle"
                fill="white"
                fontSize="10px"
              >
                {star.name}
              </text>
            ))}
          </g>
          
        </svg>
      </div>
      
      {showStarInfo && currSelectStar && (
        <div className="hr-info-card">
          <div className="hr-info-header">
            <h3 className="hr-info-title">{currSelectStar.name}</h3>
            <button onClick={closeInfoBox} className="hr-close-button">✖</button>
          </div>
          
          <div className="hr-star-details">
            <div 
              className="hr-star-color" 
              style={{backgroundColor: chartColor(currSelectStar.temp)}}
            ></div>
            <div>
              <p className="hr-star-type">{currSelectStar.type}</p>
              <p>Temperature: {currSelectStar.temp.toLocaleString()} Kelvin</p>
              <p>Brightness: {currSelectStar.lum > 100 ? currSelectStar.lum.toExponential(2) : currSelectStar.lum.toFixed(2)} × Sun</p>
            </div>
          </div>
          <p className="hr-description">{currSelectStar.description}</p>
        </div>
      )}
      
    </div>
  );
};

export default HRDiagram;