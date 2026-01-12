// Detailed GeoJSON forest cover boundaries for Global Forest Change Map
// Contains more accurate polygon shapes following actual forest region boundaries

export const detailedForestCoverGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    // ==================== AMAZON BASIN (Detailed) ====================
    {
      type: "Feature",
      properties: { name: "Western Amazon", coverage: 92, region: "South America", area_km2: 2100000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-78, 2], [-75, 4], [-70, 3], [-67, 2], [-65, 0], [-67, -3], [-70, -5], [-75, -4], [-78, -2], [-78, 2]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Central Amazon", coverage: 88, region: "South America", area_km2: 1800000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-67, 2], [-60, 3], [-55, 2], [-52, 0], [-53, -4], [-58, -6], [-63, -5], [-67, -3], [-67, 2]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Eastern Amazon", coverage: 75, region: "South America", area_km2: 1200000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-55, 2], [-50, 3], [-46, 1], [-44, -2], [-46, -6], [-50, -8], [-55, -6], [-55, 2]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Southern Amazon / Arc of Deforestation", coverage: 58, region: "South America", area_km2: 900000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-67, -5], [-60, -6], [-54, -8], [-52, -12], [-56, -15], [-62, -14], [-68, -12], [-70, -8], [-67, -5]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Guiana Shield", coverage: 94, region: "South America", area_km2: 450000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-65, 8], [-60, 9], [-54, 7], [-52, 4], [-54, 2], [-60, 2], [-65, 4], [-65, 8]
        ]]
      }
    },
    
    // ==================== CONGO BASIN (Detailed) ====================
    {
      type: "Feature",
      properties: { name: "Western Congo Basin", coverage: 82, region: "Africa", area_km2: 600000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [9, 4], [12, 5], [15, 4], [16, 1], [14, -2], [11, -3], [9, -1], [8, 2], [9, 4]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Central Congo Basin", coverage: 85, region: "Africa", area_km2: 800000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [16, 4], [20, 5], [24, 4], [26, 1], [25, -3], [21, -5], [17, -4], [15, -1], [16, 4]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Eastern Congo Basin", coverage: 78, region: "Africa", area_km2: 500000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [26, 4], [29, 3], [31, 1], [30, -2], [28, -5], [25, -4], [24, -1], [25, 2], [26, 4]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Cameroon Highlands", coverage: 65, region: "Africa", area_km2: 180000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [8, 7], [11, 8], [13, 6], [12, 4], [10, 3], [8, 4], [7, 6], [8, 7]
        ]]
      }
    },
    
    // ==================== SOUTHEAST ASIA (Detailed) ====================
    {
      type: "Feature",
      properties: { name: "Northern Borneo", coverage: 68, region: "Asia", area_km2: 220000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [109, 7], [113, 7], [117, 6], [119, 4], [118, 2], [115, 1], [112, 2], [109, 4], [109, 7]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Central Borneo (Heart of Borneo)", coverage: 75, region: "Asia", area_km2: 180000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [112, 2], [115, 2], [117, 0], [116, -2], [113, -3], [110, -2], [110, 0], [112, 2]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Southern Borneo", coverage: 45, region: "Asia", area_km2: 150000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [110, -2], [114, -2], [117, -3], [116, -4], [112, -4], [109, -3], [110, -2]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Northern Sumatra", coverage: 52, region: "Asia", area_km2: 120000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [95, 5], [98, 5.5], [100, 4], [99, 2], [97, 1], [95, 2], [95, 5]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Central Sumatra", coverage: 38, region: "Asia", area_km2: 100000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [99, 2], [102, 2], [104, 0], [103, -2], [100, -2], [98, 0], [99, 2]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Southern Sumatra", coverage: 42, region: "Asia", area_km2: 80000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [102, -2], [105, -2], [106, -4], [105, -6], [102, -5], [101, -3], [102, -2]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Papua (Indonesian)", coverage: 88, region: "Asia", area_km2: 320000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [130, 0], [135, 0], [140, -2], [141, -5], [140, -8], [135, -8], [131, -6], [130, -3], [130, 0]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Papua New Guinea", coverage: 82, region: "Oceania", area_km2: 290000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [141, -2], [145, -2], [149, -4], [152, -6], [150, -9], [146, -10], [142, -8], [141, -5], [141, -2]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Sulawesi", coverage: 55, region: "Asia", area_km2: 65000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [119, 2], [121, 1], [124, 0], [125, -2], [123, -4], [121, -5], [119, -3], [118, 0], [119, 2]
        ]]
      }
    },
    
    // ==================== INDOCHINA (Detailed) ====================
    {
      type: "Feature",
      properties: { name: "Northern Myanmar", coverage: 62, region: "Asia", area_km2: 180000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [94, 28], [97, 28], [99, 25], [98, 22], [96, 20], [93, 22], [92, 25], [94, 28]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Central Myanmar", coverage: 48, region: "Asia", area_km2: 120000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [94, 22], [97, 22], [99, 19], [98, 16], [95, 15], [93, 17], [94, 22]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Laos Highlands", coverage: 58, region: "Asia", area_km2: 110000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [100, 22], [104, 22], [106, 19], [105, 16], [102, 14], [100, 16], [99, 19], [100, 22]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Vietnam Central Highlands", coverage: 45, region: "Asia", area_km2: 55000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106, 16], [109, 16], [109, 12], [108, 10], [106, 11], [105, 14], [106, 16]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Cambodia Forests", coverage: 42, region: "Asia", area_km2: 80000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [102, 14], [105, 15], [107, 13], [107, 11], [104, 10], [102, 11], [102, 14]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Thailand Eastern Forests", coverage: 35, region: "Asia", area_km2: 65000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [101, 18], [104, 18], [105, 15], [103, 13], [100, 14], [99, 16], [101, 18]
        ]]
      }
    },
    
    // ==================== BOREAL - CANADA (Detailed) ====================
    {
      type: "Feature",
      properties: { name: "Western Canadian Boreal", coverage: 72, region: "North America", area_km2: 1200000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-140, 68], [-125, 70], [-115, 68], [-110, 60], [-115, 52], [-125, 50], [-135, 55], [-140, 62], [-140, 68]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Central Canadian Boreal", coverage: 75, region: "North America", area_km2: 1500000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-110, 65], [-95, 68], [-85, 65], [-82, 55], [-90, 50], [-105, 50], [-112, 55], [-110, 65]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Eastern Canadian Boreal", coverage: 68, region: "North America", area_km2: 800000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-82, 60], [-70, 62], [-58, 58], [-55, 52], [-60, 48], [-72, 48], [-80, 52], [-82, 60]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "British Columbia Rainforest", coverage: 65, region: "North America", area_km2: 350000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-135, 60], [-128, 58], [-123, 54], [-123, 49], [-128, 48], [-132, 52], [-135, 56], [-135, 60]
        ]]
      }
    },
    
    // ==================== BOREAL - RUSSIA (Detailed) ====================
    {
      type: "Feature",
      properties: { name: "Western Siberian Taiga", coverage: 78, region: "Europe/Asia", area_km2: 2200000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [60, 70], [75, 72], [90, 70], [95, 62], [90, 55], [75, 52], [62, 55], [58, 62], [60, 70]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Central Siberian Taiga", coverage: 82, region: "Asia", area_km2: 2800000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [95, 72], [115, 74], [130, 72], [135, 62], [130, 52], [115, 50], [100, 52], [95, 60], [95, 72]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Eastern Siberian Taiga", coverage: 75, region: "Asia", area_km2: 2000000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [135, 72], [150, 70], [165, 68], [168, 58], [162, 50], [145, 48], [135, 52], [132, 62], [135, 72]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Russian Far East", coverage: 70, region: "Asia", area_km2: 1200000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [130, 55], [138, 58], [145, 55], [142, 48], [135, 43], [130, 45], [128, 50], [130, 55]
        ]]
      }
    },
    
    // ==================== EUROPEAN FORESTS (Detailed) ====================
    {
      type: "Feature",
      properties: { name: "Scandinavian Boreal", coverage: 72, region: "Europe", area_km2: 450000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [8, 70], [15, 71], [25, 70], [30, 65], [28, 60], [20, 58], [10, 60], [5, 65], [8, 70]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Baltic Forests", coverage: 48, region: "Europe", area_km2: 120000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [20, 60], [26, 60], [28, 56], [26, 54], [22, 54], [19, 56], [20, 60]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Central European Forests", coverage: 32, region: "Europe", area_km2: 180000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [5, 52], [12, 54], [18, 52], [20, 48], [15, 45], [8, 46], [3, 48], [5, 52]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Carpathian Forests", coverage: 55, region: "Europe", area_km2: 85000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [18, 50], [24, 50], [27, 47], [26, 44], [22, 44], [18, 46], [17, 48], [18, 50]
        ]]
      }
    },
    
    // ==================== US FORESTS (Detailed) ====================
    {
      type: "Feature",
      properties: { name: "Pacific Northwest Rainforest", coverage: 62, region: "North America", area_km2: 180000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-125, 50], [-122, 49], [-120, 46], [-121, 42], [-124, 40], [-126, 44], [-125, 48], [-125, 50]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Sierra Nevada Forests", coverage: 45, region: "North America", area_km2: 65000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-122, 42], [-120, 40], [-118, 37], [-119, 35], [-121, 36], [-123, 39], [-122, 42]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Rocky Mountain Forests", coverage: 38, region: "North America", area_km2: 250000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-118, 50], [-112, 48], [-108, 42], [-106, 35], [-110, 32], [-115, 38], [-116, 45], [-118, 50]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Appalachian Forests", coverage: 52, region: "North America", area_km2: 180000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-85, 42], [-80, 40], [-76, 38], [-78, 34], [-82, 32], [-86, 35], [-88, 38], [-85, 42]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Alaskan Forests", coverage: 68, region: "North America", area_km2: 520000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-165, 68], [-155, 70], [-145, 68], [-138, 62], [-145, 58], [-155, 55], [-165, 58], [-168, 64], [-165, 68]
        ]]
      }
    },
    
    // ==================== CENTRAL AMERICA & CARIBBEAN ====================
    {
      type: "Feature",
      properties: { name: "Mesoamerican Corridor", coverage: 45, region: "Central America", area_km2: 120000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-92, 20], [-88, 18], [-84, 15], [-82, 10], [-85, 8], [-88, 10], [-92, 14], [-94, 18], [-92, 20]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Maya Forest", coverage: 55, region: "Central America", area_km2: 45000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-92, 20], [-89, 21], [-87, 19], [-88, 16], [-91, 16], [-93, 18], [-92, 20]
        ]]
      }
    },
    
    // ==================== WEST AFRICA (Detailed) ====================
    {
      type: "Feature",
      properties: { name: "Upper Guinea Forests", coverage: 28, region: "Africa", area_km2: 95000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-15, 12], [-10, 11], [-5, 8], [-3, 5], [-8, 4], [-12, 6], [-15, 9], [-15, 12]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Côte d'Ivoire/Ghana Forests", coverage: 22, region: "Africa", area_km2: 55000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-8, 8], [-5, 9], [-1, 8], [1, 6], [0, 5], [-4, 5], [-7, 6], [-8, 8]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Nigerian Cross River", coverage: 35, region: "Africa", area_km2: 25000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [5, 8], [8, 9], [10, 7], [9, 5], [6, 5], [4, 6], [5, 8]
        ]]
      }
    },
    
    // ==================== EAST AFRICA ====================
    {
      type: "Feature",
      properties: { name: "Ethiopian Highlands", coverage: 15, region: "Africa", area_km2: 45000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [35, 14], [40, 14], [42, 10], [40, 6], [36, 5], [34, 8], [35, 14]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "East African Montane", coverage: 25, region: "Africa", area_km2: 65000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [28, 3], [32, 4], [38, 2], [40, -4], [38, -8], [32, -10], [28, -6], [27, 0], [28, 3]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Miombo Woodlands", coverage: 42, region: "Africa", area_km2: 280000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [22, -5], [32, -4], [38, -8], [36, -15], [30, -18], [24, -16], [20, -10], [22, -5]
        ]]
      }
    },
    
    // ==================== MADAGASCAR ====================
    {
      type: "Feature",
      properties: { name: "Eastern Madagascar Rainforest", coverage: 38, region: "Africa", area_km2: 35000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [48, -14], [50, -14], [50, -22], [48, -24], [46, -22], [46, -16], [48, -14]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Western Madagascar Dry Forest", coverage: 25, region: "Africa", area_km2: 28000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [43, -14], [46, -14], [46, -22], [44, -24], [42, -20], [43, -14]
        ]]
      }
    },
    
    // ==================== AUSTRALIA ====================
    {
      type: "Feature",
      properties: { name: "Queensland Rainforest", coverage: 55, region: "Oceania", area_km2: 25000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [144, -14], [148, -14], [150, -18], [148, -22], [144, -20], [143, -16], [144, -14]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Tasmanian Wilderness", coverage: 62, region: "Oceania", area_km2: 18000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [144, -41], [147, -40], [149, -42], [148, -44], [145, -44], [143, -42], [144, -41]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Victorian Forests", coverage: 35, region: "Oceania", area_km2: 45000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [140, -35], [145, -34], [150, -36], [149, -39], [145, -39], [140, -37], [140, -35]
        ]]
      }
    },
    
    // ==================== NEW ZEALAND ====================
    {
      type: "Feature",
      properties: { name: "New Zealand Native Forests", coverage: 38, region: "Oceania", area_km2: 65000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [166, -34], [174, -34], [178, -38], [177, -42], [173, -46], [167, -45], [165, -40], [166, -34]
        ]]
      }
    },
    
    // ==================== SOUTH AMERICA - ANDES ====================
    {
      type: "Feature",
      properties: { name: "Colombian Cloud Forests", coverage: 52, region: "South America", area_km2: 45000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-78, 8], [-74, 10], [-72, 7], [-73, 2], [-76, 0], [-78, 3], [-79, 6], [-78, 8]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Ecuadorian Andes Forests", coverage: 48, region: "South America", area_km2: 25000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-80, 2], [-78, 2], [-77, -2], [-79, -5], [-81, -3], [-81, 0], [-80, 2]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Peruvian Yungas", coverage: 65, region: "South America", area_km2: 120000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-79, -4], [-76, -4], [-72, -8], [-70, -14], [-73, -15], [-77, -12], [-79, -8], [-79, -4]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Valdivian Temperate Rainforest", coverage: 58, region: "South America", area_km2: 35000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74, -38], [-72, -38], [-71, -42], [-72, -46], [-74, -45], [-75, -41], [-74, -38]
        ]]
      }
    },
    
    // ==================== ATLANTIC FOREST (Brazil) ====================
    {
      type: "Feature",
      properties: { name: "Brazilian Atlantic Forest", coverage: 12, region: "South America", area_km2: 130000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-48, -8], [-35, -6], [-34, -12], [-38, -18], [-42, -24], [-50, -28], [-52, -24], [-48, -8]
        ]]
      }
    },
    
    // ==================== JAPAN ====================
    {
      type: "Feature",
      properties: { name: "Hokkaido Forests", coverage: 72, region: "Asia", area_km2: 55000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [139, 45], [143, 45], [146, 43], [145, 41], [141, 41], [139, 43], [139, 45]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Honshu Mountain Forests", coverage: 65, region: "Asia", area_km2: 85000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [136, 40], [140, 40], [142, 36], [140, 34], [135, 34], [132, 36], [134, 39], [136, 40]
        ]]
      }
    },
    
    // ==================== CHINA ====================
    {
      type: "Feature",
      properties: { name: "Northeast China Forests", coverage: 45, region: "Asia", area_km2: 280000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [118, 52], [128, 53], [135, 48], [132, 42], [124, 40], [118, 42], [116, 48], [118, 52]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Southwest China Mountains", coverage: 55, region: "Asia", area_km2: 180000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [98, 32], [105, 32], [108, 28], [106, 24], [100, 22], [96, 25], [97, 30], [98, 32]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Hainan Island", coverage: 42, region: "Asia", area_km2: 12000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [108, 20], [111, 20], [111, 18], [109, 18], [108, 19], [108, 20]
        ]]
      }
    },
    
    // ==================== INDIAN SUBCONTINENT ====================
    {
      type: "Feature",
      properties: { name: "Western Ghats", coverage: 35, region: "Asia", area_km2: 45000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [73, 20], [76, 20], [78, 14], [77, 8], [74, 10], [72, 16], [73, 20]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Eastern Himalayas", coverage: 48, region: "Asia", area_km2: 75000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [84, 28], [92, 28], [96, 26], [94, 22], [88, 22], [84, 24], [84, 28]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Northeast India Forests", coverage: 52, region: "Asia", area_km2: 55000 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [90, 28], [95, 28], [97, 25], [95, 22], [91, 22], [89, 25], [90, 28]
        ]]
      }
    },
  ]
};

export default detailedForestCoverGeoJSON;
