import { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Anchor, Loader2, Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Port {
  code: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
}

// Comprehensive global ports database - 250+ major ports
const PORTS_DATABASE: Port[] = [
  // ==================== ASIA ====================
  // China - Major Ports
  { code: "CNSHA", name: "Port of Shanghai", city: "Shanghai", country: "China", lat: 31.2304, lon: 121.4737 },
  { code: "CNNGB", name: "Ningbo-Zhoushan Port", city: "Ningbo", country: "China", lat: 29.8683, lon: 121.5440 },
  { code: "CNSHE", name: "Port of Shenzhen", city: "Shenzhen", country: "China", lat: 22.5431, lon: 114.0579 },
  { code: "CNQIN", name: "Port of Qingdao", city: "Qingdao", country: "China", lat: 36.0671, lon: 120.3826 },
  { code: "CNTIA", name: "Port of Tianjin", city: "Tianjin", country: "China", lat: 38.9860, lon: 117.7115 },
  { code: "CNXIA", name: "Port of Xiamen", city: "Xiamen", country: "China", lat: 24.4798, lon: 118.0894 },
  { code: "CNGZU", name: "Port of Guangzhou", city: "Guangzhou", country: "China", lat: 23.1291, lon: 113.2644 },
  { code: "CNDAL", name: "Port of Dalian", city: "Dalian", country: "China", lat: 38.9140, lon: 121.6147 },
  { code: "CNFUZ", name: "Port of Fuzhou", city: "Fuzhou", country: "China", lat: 26.0745, lon: 119.2965 },
  { code: "CNLYG", name: "Port of Lianyungang", city: "Lianyungang", country: "China", lat: 34.5970, lon: 119.2220 },
  { code: "CNYAT", name: "Port of Yantai", city: "Yantai", country: "China", lat: 37.4638, lon: 121.4479 },
  { code: "CNZUH", name: "Port of Zhuhai", city: "Zhuhai", country: "China", lat: 22.2710, lon: 113.5767 },
  { code: "CNNTG", name: "Port of Nantong", city: "Nantong", country: "China", lat: 31.9816, lon: 120.8735 },
  { code: "CNWNZ", name: "Port of Wenzhou", city: "Wenzhou", country: "China", lat: 28.0193, lon: 120.6518 },
  { code: "CNTAO", name: "Port of Taizhou", city: "Taizhou", country: "China", lat: 28.6562, lon: 121.4207 },
  { code: "CNJIU", name: "Port of Jiujiang", city: "Jiujiang", country: "China", lat: 29.7050, lon: 116.0019 },
  
  // Hong Kong & Taiwan
  { code: "HKHKG", name: "Port of Hong Kong", city: "Hong Kong", country: "Hong Kong", lat: 22.3193, lon: 114.1694 },
  { code: "TWKHH", name: "Port of Kaohsiung", city: "Kaohsiung", country: "Taiwan", lat: 22.6273, lon: 120.3014 },
  { code: "TWKEL", name: "Port of Keelung", city: "Keelung", country: "Taiwan", lat: 25.1276, lon: 121.7392 },
  { code: "TWTXG", name: "Port of Taichung", city: "Taichung", country: "Taiwan", lat: 24.2854, lon: 120.5164 },
  
  // Japan
  { code: "JPYOK", name: "Port of Yokohama", city: "Yokohama", country: "Japan", lat: 35.4437, lon: 139.6380 },
  { code: "JPTYO", name: "Port of Tokyo", city: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { code: "JPKOB", name: "Port of Kobe", city: "Kobe", country: "Japan", lat: 34.6901, lon: 135.1956 },
  { code: "JPNGO", name: "Port of Nagoya", city: "Nagoya", country: "Japan", lat: 35.0940, lon: 136.8827 },
  { code: "JPOSK", name: "Port of Osaka", city: "Osaka", country: "Japan", lat: 34.6937, lon: 135.5023 },
  { code: "JPYKS", name: "Port of Yokkaichi", city: "Yokkaichi", country: "Japan", lat: 34.9679, lon: 136.6173 },
  { code: "JPHKT", name: "Port of Hakata", city: "Fukuoka", country: "Japan", lat: 33.5904, lon: 130.4017 },
  { code: "JPHIJ", name: "Port of Hiroshima", city: "Hiroshima", country: "Japan", lat: 34.3853, lon: 132.4553 },
  { code: "JPCHB", name: "Port of Chiba", city: "Chiba", country: "Japan", lat: 35.6072, lon: 140.1062 },
  { code: "JPMOJ", name: "Port of Moji", city: "Kitakyushu", country: "Japan", lat: 33.9468, lon: 130.9662 },
  { code: "JPSMZ", name: "Port of Shimizu", city: "Shizuoka", country: "Japan", lat: 35.0116, lon: 138.4893 },
  
  // South Korea
  { code: "KRPUS", name: "Port of Busan", city: "Busan", country: "South Korea", lat: 35.1796, lon: 129.0756 },
  { code: "KRINC", name: "Port of Incheon", city: "Incheon", country: "South Korea", lat: 37.4563, lon: 126.7052 },
  { code: "KRKAN", name: "Port of Gwangyang", city: "Gwangyang", country: "South Korea", lat: 34.9151, lon: 127.6920 },
  { code: "KRULS", name: "Port of Ulsan", city: "Ulsan", country: "South Korea", lat: 35.5384, lon: 129.3114 },
  { code: "KRMOK", name: "Port of Mokpo", city: "Mokpo", country: "South Korea", lat: 34.7936, lon: 126.3883 },
  { code: "KRPTK", name: "Port of Pyeongtaek", city: "Pyeongtaek", country: "South Korea", lat: 36.9920, lon: 126.8320 },
  
  // Singapore & Malaysia
  { code: "SGSIN", name: "Port of Singapore", city: "Singapore", country: "Singapore", lat: 1.2644, lon: 103.8198 },
  { code: "MYKLG", name: "Port Klang", city: "Klang", country: "Malaysia", lat: 3.0319, lon: 101.3673 },
  { code: "MYTPP", name: "Port of Tanjung Pelepas", city: "Johor Bahru", country: "Malaysia", lat: 1.3631, lon: 103.5505 },
  { code: "MYPEN", name: "Port of Penang", city: "George Town", country: "Malaysia", lat: 5.4141, lon: 100.3288 },
  { code: "MYKUA", name: "Port of Kuantan", city: "Kuantan", country: "Malaysia", lat: 3.9750, lon: 103.4300 },
  { code: "MYBTU", name: "Port of Bintulu", city: "Bintulu", country: "Malaysia", lat: 3.1667, lon: 113.0333 },
  { code: "MYJHB", name: "Port of Johor", city: "Pasir Gudang", country: "Malaysia", lat: 1.4655, lon: 103.9070 },
  
  // Thailand & Vietnam
  { code: "THBKK", name: "Port of Bangkok", city: "Bangkok", country: "Thailand", lat: 13.7563, lon: 100.5018 },
  { code: "THLCH", name: "Port of Laem Chabang", city: "Laem Chabang", country: "Thailand", lat: 13.0830, lon: 100.8833 },
  { code: "THSGZ", name: "Port of Songkhla", city: "Songkhla", country: "Thailand", lat: 7.2112, lon: 100.5963 },
  { code: "VNSGN", name: "Port of Ho Chi Minh", city: "Ho Chi Minh City", country: "Vietnam", lat: 10.7769, lon: 106.7009 },
  { code: "VNHPH", name: "Port of Hai Phong", city: "Hai Phong", country: "Vietnam", lat: 20.8449, lon: 106.6881 },
  { code: "VNDAN", name: "Port of Da Nang", city: "Da Nang", country: "Vietnam", lat: 16.0545, lon: 108.2022 },
  { code: "VNVUT", name: "Port of Vung Tau", city: "Vung Tau", country: "Vietnam", lat: 10.4114, lon: 107.1361 },
  { code: "VNQUI", name: "Port of Qui Nhon", city: "Qui Nhon", country: "Vietnam", lat: 13.7829, lon: 109.2196 },
  
  // Indonesia
  { code: "IDJKT", name: "Port of Jakarta (Tanjung Priok)", city: "Jakarta", country: "Indonesia", lat: -6.1051, lon: 106.8650 },
  { code: "IDSUB", name: "Port of Surabaya (Tanjung Perak)", city: "Surabaya", country: "Indonesia", lat: -7.2000, lon: 112.7350 },
  { code: "IDBEL", name: "Port of Belawan", city: "Medan", country: "Indonesia", lat: 3.7868, lon: 98.6843 },
  { code: "IDSEM", name: "Port of Semarang", city: "Semarang", country: "Indonesia", lat: -6.9563, lon: 110.4058 },
  { code: "IDBTM", name: "Port of Batam", city: "Batam", country: "Indonesia", lat: 1.0456, lon: 104.0305 },
  { code: "IDBPN", name: "Port of Balikpapan", city: "Balikpapan", country: "Indonesia", lat: -1.2654, lon: 116.8312 },
  { code: "IDMAK", name: "Port of Makassar", city: "Makassar", country: "Indonesia", lat: -5.1477, lon: 119.4327 },
  { code: "IDPNK", name: "Port of Pontianak", city: "Pontianak", country: "Indonesia", lat: -0.0263, lon: 109.3425 },
  
  // Philippines
  { code: "PHMNL", name: "Port of Manila", city: "Manila", country: "Philippines", lat: 14.5995, lon: 120.9842 },
  { code: "PHCEB", name: "Port of Cebu", city: "Cebu City", country: "Philippines", lat: 10.3157, lon: 123.8854 },
  { code: "PHSUB", name: "Port of Subic Bay", city: "Subic Bay", country: "Philippines", lat: 14.8220, lon: 120.2694 },
  { code: "PHBAT", name: "Port of Batangas", city: "Batangas", country: "Philippines", lat: 13.7565, lon: 121.0583 },
  { code: "PHDVO", name: "Port of Davao", city: "Davao", country: "Philippines", lat: 7.0731, lon: 125.6128 },
  { code: "PHGEN", name: "Port of General Santos", city: "General Santos", country: "Philippines", lat: 6.1108, lon: 125.1716 },
  
  // India & Sri Lanka
  { code: "INMUN", name: "Port of Mumbai (JNPT)", city: "Mumbai", country: "India", lat: 18.9489, lon: 72.9488 },
  { code: "INMAA", name: "Port of Chennai", city: "Chennai", country: "India", lat: 13.0827, lon: 80.2707 },
  { code: "INCCU", name: "Port of Kolkata", city: "Kolkata", country: "India", lat: 22.5726, lon: 88.3639 },
  { code: "INVTZ", name: "Port of Visakhapatnam", city: "Visakhapatnam", country: "India", lat: 17.6868, lon: 83.2185 },
  { code: "INTUT", name: "Port of Tuticorin", city: "Tuticorin", country: "India", lat: 8.7642, lon: 78.1348 },
  { code: "INCOK", name: "Port of Cochin", city: "Kochi", country: "India", lat: 9.9312, lon: 76.2673 },
  { code: "INKDL", name: "Port of Kandla", city: "Gandhidham", country: "India", lat: 23.0300, lon: 70.2200 },
  { code: "INPAV", name: "Port of Paradip", city: "Paradip", country: "India", lat: 20.2649, lon: 86.6113 },
  { code: "INMRM", name: "Port of Marmagao", city: "Goa", country: "India", lat: 15.4210, lon: 73.8000 },
  { code: "INNML", name: "Port of New Mangalore", city: "Mangalore", country: "India", lat: 12.9141, lon: 74.8080 },
  { code: "INMUN", name: "Port of Mundra", city: "Mundra", country: "India", lat: 22.8390, lon: 69.7060 },
  { code: "LKCMB", name: "Port of Colombo", city: "Colombo", country: "Sri Lanka", lat: 6.9271, lon: 79.8612 },
  { code: "LKHTB", name: "Port of Hambantota", city: "Hambantota", country: "Sri Lanka", lat: 6.1204, lon: 81.1185 },
  
  // Pakistan & Bangladesh
  { code: "PKKHI", name: "Port of Karachi", city: "Karachi", country: "Pakistan", lat: 24.8607, lon: 67.0011 },
  { code: "PKQAS", name: "Port Qasim", city: "Karachi", country: "Pakistan", lat: 24.7650, lon: 67.3500 },
  { code: "PKGWD", name: "Port of Gwadar", city: "Gwadar", country: "Pakistan", lat: 25.1264, lon: 62.3225 },
  { code: "BDCGP", name: "Port of Chittagong", city: "Chittagong", country: "Bangladesh", lat: 22.3569, lon: 91.7832 },
  { code: "BDMGL", name: "Port of Mongla", city: "Mongla", country: "Bangladesh", lat: 22.4910, lon: 89.5923 },
  
  // Myanmar & Cambodia
  { code: "MMRGN", name: "Port of Yangon", city: "Yangon", country: "Myanmar", lat: 16.8661, lon: 96.1951 },
  { code: "KHPNH", name: "Port of Sihanoukville", city: "Sihanoukville", country: "Cambodia", lat: 10.6093, lon: 103.5290 },
  
  // ==================== MIDDLE EAST ====================
  // UAE
  { code: "AEJEA", name: "Port of Jebel Ali", city: "Dubai", country: "UAE", lat: 25.0183, lon: 55.0610 },
  { code: "AEDXB", name: "Port Rashid Dubai", city: "Dubai", country: "UAE", lat: 25.2697, lon: 55.2963 },
  { code: "AEAUH", name: "Port of Abu Dhabi", city: "Abu Dhabi", country: "UAE", lat: 24.4539, lon: 54.3773 },
  { code: "AESHJ", name: "Port of Sharjah", city: "Sharjah", country: "UAE", lat: 25.3573, lon: 55.4033 },
  { code: "AEKLF", name: "Port of Khalifa", city: "Abu Dhabi", country: "UAE", lat: 24.8029, lon: 54.6451 },
  { code: "AEFJR", name: "Port of Fujairah", city: "Fujairah", country: "UAE", lat: 25.1122, lon: 56.3367 },
  
  // Saudi Arabia & Gulf States
  { code: "SAJED", name: "Port of Jeddah", city: "Jeddah", country: "Saudi Arabia", lat: 21.4858, lon: 39.1925 },
  { code: "SAKAC", name: "Port of King Abdullah", city: "Rabigh", country: "Saudi Arabia", lat: 22.4536, lon: 39.0653 },
  { code: "SADMM", name: "Port of Dammam", city: "Dammam", country: "Saudi Arabia", lat: 26.4344, lon: 50.1114 },
  { code: "SAJUB", name: "Port of Jubail", city: "Jubail", country: "Saudi Arabia", lat: 27.0174, lon: 49.6225 },
  { code: "SAYNB", name: "Port of Yanbu", city: "Yanbu", country: "Saudi Arabia", lat: 24.0893, lon: 38.0618 },
  { code: "OMSLL", name: "Port of Salalah", city: "Salalah", country: "Oman", lat: 16.9498, lon: 54.0048 },
  { code: "OMMCT", name: "Port of Muscat", city: "Muscat", country: "Oman", lat: 23.6345, lon: 58.5910 },
  { code: "OMSOH", name: "Port of Sohar", city: "Sohar", country: "Oman", lat: 24.3439, lon: 56.7353 },
  { code: "KWKWI", name: "Port of Kuwait", city: "Kuwait City", country: "Kuwait", lat: 29.3759, lon: 47.9774 },
  { code: "KWSHU", name: "Port of Shuwaikh", city: "Kuwait City", country: "Kuwait", lat: 29.3570, lon: 47.9495 },
  { code: "QADOH", name: "Port of Doha", city: "Doha", country: "Qatar", lat: 25.2854, lon: 51.5310 },
  { code: "QAHAM", name: "Port of Hamad", city: "Doha", country: "Qatar", lat: 25.0256, lon: 51.6167 },
  { code: "BHBAH", name: "Port of Bahrain (Mina Salman)", city: "Manama", country: "Bahrain", lat: 26.2285, lon: 50.5860 },
  { code: "BHKBS", name: "Port of Khalifa Bin Salman", city: "Hidd", country: "Bahrain", lat: 26.2089, lon: 50.6538 },
  
  // Iran & Iraq
  { code: "IRBND", name: "Port of Bandar Abbas", city: "Bandar Abbas", country: "Iran", lat: 27.1832, lon: 56.2666 },
  { code: "IRBSR", name: "Port of Bushehr", city: "Bushehr", country: "Iran", lat: 28.9684, lon: 50.8385 },
  { code: "IRKHO", name: "Port of Khorramshahr", city: "Khorramshahr", country: "Iran", lat: 30.4398, lon: 48.1832 },
  { code: "IRCHA", name: "Port of Chabahar", city: "Chabahar", country: "Iran", lat: 25.2969, lon: 60.6430 },
  { code: "IQBSR", name: "Port of Basra", city: "Basra", country: "Iraq", lat: 30.5089, lon: 47.7837 },
  { code: "IQUQR", name: "Port of Umm Qasr", city: "Umm Qasr", country: "Iraq", lat: 30.0344, lon: 47.9294 },
  
  // Red Sea & Suez
  { code: "EGPSD", name: "Port Said", city: "Port Said", country: "Egypt", lat: 31.2653, lon: 32.3019 },
  { code: "EGALY", name: "Port of Alexandria", city: "Alexandria", country: "Egypt", lat: 31.2001, lon: 29.9187 },
  { code: "EGSUZ", name: "Port of Suez", city: "Suez", country: "Egypt", lat: 29.9659, lon: 32.5511 },
  { code: "EGDAM", name: "Port of Damietta", city: "Damietta", country: "Egypt", lat: 31.4264, lon: 31.8131 },
  { code: "EGSKI", name: "Port of Sokhna", city: "Ain Sokhna", country: "Egypt", lat: 29.5940, lon: 32.3493 },
  { code: "DJJIB", name: "Port of Djibouti", city: "Djibouti", country: "Djibouti", lat: 11.5888, lon: 43.1456 },
  { code: "YEHOD", name: "Port of Hodeidah", city: "Hodeidah", country: "Yemen", lat: 14.7979, lon: 42.9540 },
  { code: "YEADE", name: "Port of Aden", city: "Aden", country: "Yemen", lat: 12.7855, lon: 45.0187 },
  { code: "ERMSW", name: "Port of Massawa", city: "Massawa", country: "Eritrea", lat: 15.6129, lon: 39.4653 },
  { code: "SDPZG", name: "Port Sudan", city: "Port Sudan", country: "Sudan", lat: 19.6158, lon: 37.2164 },
  
  // ==================== EUROPE ====================
  // Northern Europe
  { code: "NLRTM", name: "Port of Rotterdam", city: "Rotterdam", country: "Netherlands", lat: 51.9225, lon: 4.4792 },
  { code: "NLAMS", name: "Port of Amsterdam", city: "Amsterdam", country: "Netherlands", lat: 52.3676, lon: 4.9041 },
  { code: "BEANR", name: "Port of Antwerp", city: "Antwerp", country: "Belgium", lat: 51.2194, lon: 4.4025 },
  { code: "BEZEE", name: "Port of Zeebrugge", city: "Bruges", country: "Belgium", lat: 51.3279, lon: 3.1750 },
  { code: "DEHAM", name: "Port of Hamburg", city: "Hamburg", country: "Germany", lat: 53.5511, lon: 9.9937 },
  { code: "DEBRV", name: "Port of Bremerhaven", city: "Bremerhaven", country: "Germany", lat: 53.5396, lon: 8.5809 },
  { code: "DEWVN", name: "Port of Wilhelmshaven", city: "Wilhelmshaven", country: "Germany", lat: 53.5183, lon: 8.1453 },
  { code: "DEROS", name: "Port of Rostock", city: "Rostock", country: "Germany", lat: 54.0924, lon: 12.0991 },
  { code: "FRLEH", name: "Port of Le Havre", city: "Le Havre", country: "France", lat: 49.4944, lon: 0.1079 },
  { code: "FRDKK", name: "Port of Dunkirk", city: "Dunkirk", country: "France", lat: 51.0343, lon: 2.3767 },
  { code: "GBFXT", name: "Port of Felixstowe", city: "Felixstowe", country: "UK", lat: 51.9543, lon: 1.3511 },
  { code: "GBSOU", name: "Port of Southampton", city: "Southampton", country: "UK", lat: 50.9097, lon: -1.4044 },
  { code: "GBLGP", name: "Port of London Gateway", city: "London", country: "UK", lat: 51.4978, lon: 0.4657 },
  { code: "GBLIV", name: "Port of Liverpool", city: "Liverpool", country: "UK", lat: 53.4084, lon: -2.9916 },
  { code: "GBIMM", name: "Port of Immingham", city: "Immingham", country: "UK", lat: 53.6334, lon: -0.1872 },
  { code: "GBTIL", name: "Port of Tilbury", city: "Tilbury", country: "UK", lat: 51.4578, lon: 0.3536 },
  { code: "IEDUB", name: "Port of Dublin", city: "Dublin", country: "Ireland", lat: 53.3498, lon: -6.2603 },
  { code: "IECOK", name: "Port of Cork", city: "Cork", country: "Ireland", lat: 51.8985, lon: -8.4756 },
  
  // Baltic & Scandinavia
  { code: "PLGDY", name: "Port of Gdynia", city: "Gdynia", country: "Poland", lat: 54.5189, lon: 18.5305 },
  { code: "PLGDN", name: "Port of Gdansk", city: "Gdansk", country: "Poland", lat: 54.3520, lon: 18.6466 },
  { code: "RULED", name: "Port of St. Petersburg", city: "St. Petersburg", country: "Russia", lat: 59.9311, lon: 30.3609 },
  { code: "SEGOT", name: "Port of Gothenburg", city: "Gothenburg", country: "Sweden", lat: 57.7089, lon: 11.9746 },
  { code: "SESTO", name: "Port of Stockholm", city: "Stockholm", country: "Sweden", lat: 59.3293, lon: 18.0686 },
  { code: "SEMMA", name: "Port of Malmö", city: "Malmö", country: "Sweden", lat: 55.6050, lon: 13.0038 },
  { code: "NOOSL", name: "Port of Oslo", city: "Oslo", country: "Norway", lat: 59.9139, lon: 10.7522 },
  { code: "NOBGO", name: "Port of Bergen", city: "Bergen", country: "Norway", lat: 60.3913, lon: 5.3221 },
  { code: "NOSVG", name: "Port of Stavanger", city: "Stavanger", country: "Norway", lat: 58.9700, lon: 5.7331 },
  { code: "DKCPH", name: "Port of Copenhagen", city: "Copenhagen", country: "Denmark", lat: 55.6761, lon: 12.5683 },
  { code: "DKAAR", name: "Port of Aarhus", city: "Aarhus", country: "Denmark", lat: 56.1629, lon: 10.2039 },
  { code: "FIHEL", name: "Port of Helsinki", city: "Helsinki", country: "Finland", lat: 60.1699, lon: 24.9384 },
  { code: "FIKTK", name: "Port of Kotka", city: "Kotka", country: "Finland", lat: 60.4660, lon: 26.9457 },
  { code: "EEKPL", name: "Port of Tallinn", city: "Tallinn", country: "Estonia", lat: 59.4370, lon: 24.7536 },
  { code: "LVRIX", name: "Port of Riga", city: "Riga", country: "Latvia", lat: 56.9496, lon: 24.1052 },
  { code: "LTKLA", name: "Port of Klaipeda", city: "Klaipeda", country: "Lithuania", lat: 55.7033, lon: 21.1443 },
  
  // Mediterranean
  { code: "FRMAR", name: "Port of Marseille", city: "Marseille", country: "France", lat: 43.2965, lon: 5.3698 },
  { code: "FRFOS", name: "Port of Fos-sur-Mer", city: "Fos-sur-Mer", country: "France", lat: 43.4300, lon: 4.8940 },
  { code: "ESBCN", name: "Port of Barcelona", city: "Barcelona", country: "Spain", lat: 41.3851, lon: 2.1734 },
  { code: "ESVAL", name: "Port of Valencia", city: "Valencia", country: "Spain", lat: 39.4699, lon: -0.3763 },
  { code: "ESALG", name: "Port of Algeciras", city: "Algeciras", country: "Spain", lat: 36.1408, lon: -5.4556 },
  { code: "ESBIO", name: "Port of Bilbao", city: "Bilbao", country: "Spain", lat: 43.2630, lon: -2.9350 },
  { code: "ESLPA", name: "Port of Las Palmas", city: "Las Palmas", country: "Spain", lat: 28.1235, lon: -15.4363 },
  { code: "PTLIS", name: "Port of Lisbon", city: "Lisbon", country: "Portugal", lat: 38.7223, lon: -9.1393 },
  { code: "PTSIE", name: "Port of Sines", city: "Sines", country: "Portugal", lat: 37.9560, lon: -8.8670 },
  { code: "PTOPO", name: "Port of Porto/Leixões", city: "Porto", country: "Portugal", lat: 41.1860, lon: -8.7063 },
  { code: "ITGOA", name: "Port of Genoa", city: "Genoa", country: "Italy", lat: 44.4056, lon: 8.9463 },
  { code: "ITLSP", name: "Port of La Spezia", city: "La Spezia", country: "Italy", lat: 44.1024, lon: 9.8248 },
  { code: "ITGIT", name: "Port of Gioia Tauro", city: "Gioia Tauro", country: "Italy", lat: 38.4389, lon: 15.9014 },
  { code: "ITNAP", name: "Port of Naples", city: "Naples", country: "Italy", lat: 40.8518, lon: 14.2681 },
  { code: "ITTRS", name: "Port of Trieste", city: "Trieste", country: "Italy", lat: 45.6495, lon: 13.7768 },
  { code: "ITVCE", name: "Port of Venice", city: "Venice", country: "Italy", lat: 45.4408, lon: 12.3155 },
  { code: "ITLIV", name: "Port of Livorno", city: "Livorno", country: "Italy", lat: 43.5528, lon: 10.3089 },
  { code: "MTMAR", name: "Malta Freeport", city: "Marsaxlokk", country: "Malta", lat: 35.8167, lon: 14.5333 },
  { code: "GRPIR", name: "Port of Piraeus", city: "Athens", country: "Greece", lat: 37.9427, lon: 23.6477 },
  { code: "GRTHE", name: "Port of Thessaloniki", city: "Thessaloniki", country: "Greece", lat: 40.6401, lon: 22.9444 },
  { code: "TRIST", name: "Port of Istanbul (Ambarli)", city: "Istanbul", country: "Turkey", lat: 41.0082, lon: 28.6989 },
  { code: "TRMER", name: "Port of Mersin", city: "Mersin", country: "Turkey", lat: 36.8000, lon: 34.6333 },
  { code: "TRIZM", name: "Port of Izmir", city: "Izmir", country: "Turkey", lat: 38.4237, lon: 27.1428 },
  { code: "HRPLO", name: "Port of Ploče", city: "Ploče", country: "Croatia", lat: 43.0553, lon: 17.4337 },
  { code: "HRRJK", name: "Port of Rijeka", city: "Rijeka", country: "Croatia", lat: 45.3271, lon: 14.4422 },
  { code: "SIKOP", name: "Port of Koper", city: "Koper", country: "Slovenia", lat: 45.5463, lon: 13.7294 },
  { code: "MEBAR", name: "Port of Bar", city: "Bar", country: "Montenegro", lat: 42.0931, lon: 19.1003 },
  { code: "ALDRZ", name: "Port of Durrës", city: "Durrës", country: "Albania", lat: 41.3246, lon: 19.4565 },
  { code: "ROCON", name: "Port of Constanta", city: "Constanta", country: "Romania", lat: 44.1598, lon: 28.6348 },
  { code: "BGODR", name: "Port of Varna", city: "Varna", country: "Bulgaria", lat: 43.2141, lon: 27.9147 },
  { code: "UAODS", name: "Port of Odessa", city: "Odessa", country: "Ukraine", lat: 46.4825, lon: 30.7233 },
  { code: "RUGDX", name: "Port of Novorossiysk", city: "Novorossiysk", country: "Russia", lat: 44.7235, lon: 37.7687 },
  { code: "GETBS", name: "Port of Batumi", city: "Batumi", country: "Georgia", lat: 41.6457, lon: 41.6404 },
  
  // ==================== AFRICA ====================
  // North Africa
  { code: "MATNG", name: "Port of Tanger Med", city: "Tangier", country: "Morocco", lat: 35.8889, lon: -5.5006 },
  { code: "MACAS", name: "Port of Casablanca", city: "Casablanca", country: "Morocco", lat: 33.5731, lon: -7.5898 },
  { code: "DZALG", name: "Port of Algiers", city: "Algiers", country: "Algeria", lat: 36.7538, lon: 3.0588 },
  { code: "DZORN", name: "Port of Oran", city: "Oran", country: "Algeria", lat: 35.6969, lon: -0.6331 },
  { code: "TNHAL", name: "Port of Rades", city: "Tunis", country: "Tunisia", lat: 36.8015, lon: 10.2754 },
  { code: "LYSRT", name: "Port of Misurata", city: "Misurata", country: "Libya", lat: 32.3730, lon: 15.0906 },
  
  // West Africa
  { code: "NGLAG", name: "Port of Lagos (Apapa)", city: "Lagos", country: "Nigeria", lat: 6.4550, lon: 3.3841 },
  { code: "NGTIN", name: "Port of Tin Can Island", city: "Lagos", country: "Nigeria", lat: 6.4280, lon: 3.3280 },
  { code: "GHACC", name: "Port of Tema", city: "Tema", country: "Ghana", lat: 5.6280, lon: 0.0000 },
  { code: "CIABJ", name: "Port of Abidjan", city: "Abidjan", country: "Ivory Coast", lat: 5.3097, lon: -4.0127 },
  { code: "SNDKR", name: "Port of Dakar", city: "Dakar", country: "Senegal", lat: 14.6928, lon: -17.4467 },
  { code: "TGLOM", name: "Port of Lomé", city: "Lomé", country: "Togo", lat: 6.1256, lon: 1.2254 },
  { code: "BJCOO", name: "Port of Cotonou", city: "Cotonou", country: "Benin", lat: 6.3703, lon: 2.4267 },
  { code: "CMCMR", name: "Port of Douala", city: "Douala", country: "Cameroon", lat: 4.0511, lon: 9.7679 },
  { code: "GAGAB", name: "Port of Libreville", city: "Libreville", country: "Gabon", lat: -0.3890, lon: 9.4434 },
  { code: "CGPNR", name: "Port of Pointe-Noire", city: "Pointe-Noire", country: "Congo", lat: -4.7765, lon: 11.8635 },
  { code: "AOLAD", name: "Port of Luanda", city: "Luanda", country: "Angola", lat: -8.8383, lon: 13.2344 },
  
  // East Africa
  { code: "KEMBA", name: "Port of Mombasa", city: "Mombasa", country: "Kenya", lat: -4.0435, lon: 39.6682 },
  { code: "TZDAR", name: "Port of Dar es Salaam", city: "Dar es Salaam", country: "Tanzania", lat: -6.7924, lon: 39.2083 },
  { code: "MZMPM", name: "Port of Maputo", city: "Maputo", country: "Mozambique", lat: -25.9692, lon: 32.5732 },
  { code: "MZBEW", name: "Port of Beira", city: "Beira", country: "Mozambique", lat: -19.8436, lon: 34.8388 },
  { code: "MZNAC", name: "Port of Nacala", city: "Nacala", country: "Mozambique", lat: -14.5640, lon: 40.6863 },
  { code: "MUPRM", name: "Port Louis", city: "Port Louis", country: "Mauritius", lat: -20.1609, lon: 57.5012 },
  { code: "MGFNU", name: "Port of Toamasina", city: "Toamasina", country: "Madagascar", lat: -18.1492, lon: 49.4023 },
  { code: "SCPOV", name: "Port Victoria", city: "Victoria", country: "Seychelles", lat: -4.6191, lon: 55.4513 },
  { code: "REPDG", name: "Port of Port Reunion", city: "Saint-Denis", country: "Réunion", lat: -20.9325, lon: 55.2867 },
  
  // Southern Africa
  { code: "ZADUR", name: "Port of Durban", city: "Durban", country: "South Africa", lat: -29.8587, lon: 31.0218 },
  { code: "ZACPT", name: "Port of Cape Town", city: "Cape Town", country: "South Africa", lat: -33.9249, lon: 18.4241 },
  { code: "ZAPLZ", name: "Port of Port Elizabeth", city: "Port Elizabeth", country: "South Africa", lat: -33.9600, lon: 25.6022 },
  { code: "ZARCB", name: "Port of Richards Bay", city: "Richards Bay", country: "South Africa", lat: -28.7831, lon: 32.0528 },
  { code: "NAWAL", name: "Port of Walvis Bay", city: "Walvis Bay", country: "Namibia", lat: -22.9575, lon: 14.5053 },
  
  // ==================== AMERICAS - NORTH ====================
  // USA - West Coast
  { code: "USLAX", name: "Port of Los Angeles", city: "Los Angeles", country: "USA", lat: 33.7405, lon: -118.2720 },
  { code: "USLGB", name: "Port of Long Beach", city: "Long Beach", country: "USA", lat: 33.7572, lon: -118.2137 },
  { code: "USOAK", name: "Port of Oakland", city: "Oakland", country: "USA", lat: 37.8044, lon: -122.2712 },
  { code: "USSEA", name: "Port of Seattle", city: "Seattle", country: "USA", lat: 47.6062, lon: -122.3321 },
  { code: "USTAC", name: "Port of Tacoma", city: "Tacoma", country: "USA", lat: 47.2529, lon: -122.4443 },
  { code: "USPDX", name: "Port of Portland", city: "Portland", country: "USA", lat: 45.5051, lon: -122.6750 },
  { code: "USSAN", name: "Port of San Diego", city: "San Diego", country: "USA", lat: 32.7157, lon: -117.1611 },
  
  // USA - East Coast
  { code: "USNYC", name: "Port of New York/New Jersey", city: "Newark", country: "USA", lat: 40.6699, lon: -74.0368 },
  { code: "USSAV", name: "Port of Savannah", city: "Savannah", country: "USA", lat: 32.0835, lon: -81.0998 },
  { code: "USCHA", name: "Port of Charleston", city: "Charleston", country: "USA", lat: 32.7765, lon: -79.9311 },
  { code: "USMIA", name: "Port of Miami", city: "Miami", country: "USA", lat: 25.7617, lon: -80.1918 },
  { code: "USJAX", name: "Port of Jacksonville", city: "Jacksonville", country: "USA", lat: 30.3322, lon: -81.6557 },
  { code: "USPEV", name: "Port Everglades", city: "Fort Lauderdale", country: "USA", lat: 26.0883, lon: -80.1177 },
  { code: "USBOS", name: "Port of Boston", city: "Boston", country: "USA", lat: 42.3601, lon: -71.0589 },
  { code: "USPHL", name: "Port of Philadelphia", city: "Philadelphia", country: "USA", lat: 39.9526, lon: -75.1652 },
  { code: "USBAL", name: "Port of Baltimore", city: "Baltimore", country: "USA", lat: 39.2904, lon: -76.6122 },
  { code: "USNFK", name: "Port of Norfolk", city: "Norfolk", country: "USA", lat: 36.8508, lon: -76.2859 },
  { code: "USWIL", name: "Port of Wilmington NC", city: "Wilmington", country: "USA", lat: 34.2257, lon: -77.9447 },
  
  // USA - Gulf Coast
  { code: "USHOU", name: "Port of Houston", city: "Houston", country: "USA", lat: 29.7604, lon: -95.3698 },
  { code: "USNOR", name: "Port of New Orleans", city: "New Orleans", country: "USA", lat: 29.9511, lon: -90.0715 },
  { code: "USTPA", name: "Port of Tampa", city: "Tampa", country: "USA", lat: 27.9506, lon: -82.4572 },
  { code: "USMOB", name: "Port of Mobile", city: "Mobile", country: "USA", lat: 30.6954, lon: -88.0399 },
  { code: "USGPT", name: "Port of Gulfport", city: "Gulfport", country: "USA", lat: 30.3674, lon: -89.0928 },
  { code: "USCRP", name: "Port of Corpus Christi", city: "Corpus Christi", country: "USA", lat: 27.8006, lon: -97.3964 },
  { code: "USFPO", name: "Port of Freeport TX", city: "Freeport", country: "USA", lat: 28.9541, lon: -95.3598 },
  { code: "USTEX", name: "Port of Texas City", city: "Texas City", country: "USA", lat: 29.3839, lon: -94.9027 },
  
  // Canada
  { code: "CAVAN", name: "Port of Vancouver", city: "Vancouver", country: "Canada", lat: 49.2827, lon: -123.1207 },
  { code: "CAMTR", name: "Port of Montreal", city: "Montreal", country: "Canada", lat: 45.5017, lon: -73.5673 },
  { code: "CAHAL", name: "Port of Halifax", city: "Halifax", country: "Canada", lat: 44.6488, lon: -63.5752 },
  { code: "CATOR", name: "Port of Toronto", city: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832 },
  { code: "CAPRE", name: "Port of Prince Rupert", city: "Prince Rupert", country: "Canada", lat: 54.3150, lon: -130.3208 },
  { code: "CASJB", name: "Port of Saint John", city: "Saint John", country: "Canada", lat: 45.2733, lon: -66.0633 },
  { code: "CASTJ", name: "Port of St. John's", city: "St. John's", country: "Canada", lat: 47.5615, lon: -52.7126 },
  { code: "CAQUE", name: "Port of Quebec", city: "Quebec City", country: "Canada", lat: 46.8139, lon: -71.2080 },
  
  // Mexico
  { code: "MXMAN", name: "Port of Manzanillo", city: "Manzanillo", country: "Mexico", lat: 19.0514, lon: -104.3189 },
  { code: "MXLZC", name: "Port of Lazaro Cardenas", city: "Lázaro Cárdenas", country: "Mexico", lat: 17.9580, lon: -102.1964 },
  { code: "MXVER", name: "Port of Veracruz", city: "Veracruz", country: "Mexico", lat: 19.1738, lon: -96.1342 },
  { code: "MXALT", name: "Port of Altamira", city: "Altamira", country: "Mexico", lat: 22.4166, lon: -97.8699 },
  { code: "MXENS", name: "Port of Ensenada", city: "Ensenada", country: "Mexico", lat: 31.8667, lon: -116.6167 },
  { code: "MXPMS", name: "Port of Puerto Morelos", city: "Puerto Morelos", country: "Mexico", lat: 20.8474, lon: -86.8753 },
  
  // ==================== AMERICAS - CENTRAL & CARIBBEAN ====================
  { code: "PACOL", name: "Port of Colon", city: "Colon", country: "Panama", lat: 9.3591, lon: -79.9019 },
  { code: "PAPTB", name: "Port of Balboa", city: "Panama City", country: "Panama", lat: 8.9543, lon: -79.5619 },
  { code: "PAMIT", name: "Panama Canal (Miraflores)", city: "Panama City", country: "Panama", lat: 9.0150, lon: -79.5467 },
  { code: "KYKGN", name: "Port of Kingston", city: "Kingston", country: "Jamaica", lat: 17.9714, lon: -76.7930 },
  { code: "BSFPO", name: "Freeport Container Port", city: "Freeport", country: "Bahamas", lat: 26.5285, lon: -78.6964 },
  { code: "DOCAU", name: "Port of Caucedo", city: "Santo Domingo", country: "Dominican Republic", lat: 18.4361, lon: -69.6274 },
  { code: "PRSJN", name: "Port of San Juan", city: "San Juan", country: "Puerto Rico", lat: 18.4655, lon: -66.1057 },
  { code: "HNPCR", name: "Puerto Cortes", city: "Puerto Cortes", country: "Honduras", lat: 15.8399, lon: -87.9406 },
  { code: "GTPRQ", name: "Port of Quetzal", city: "San Jose", country: "Guatemala", lat: 13.9319, lon: -90.7838 },
  { code: "GTSTO", name: "Port of Santo Tomas", city: "Puerto Barrios", country: "Guatemala", lat: 15.7000, lon: -88.5833 },
  { code: "CRCAL", name: "Port of Caldera", city: "Caldera", country: "Costa Rica", lat: 9.9087, lon: -84.7149 },
  { code: "CRLIO", name: "Port of Limon", city: "Limon", country: "Costa Rica", lat: 9.9907, lon: -83.0359 },
  { code: "AWAUA", name: "Port of Oranjestad", city: "Oranjestad", country: "Aruba", lat: 12.5186, lon: -70.0358 },
  { code: "CWWIL", name: "Port of Willemstad", city: "Willemstad", country: "Curaçao", lat: 12.1696, lon: -68.9900 },
  { code: "TTPOS", name: "Port of Port of Spain", city: "Port of Spain", country: "Trinidad", lat: 10.6596, lon: -61.5086 },
  { code: "TTPTS", name: "Port of Point Lisas", city: "Point Lisas", country: "Trinidad", lat: 10.4194, lon: -61.4772 },
  { code: "BBBAR", name: "Port of Bridgetown", city: "Bridgetown", country: "Barbados", lat: 13.0969, lon: -59.6145 },
  { code: "GPPTF", name: "Port of Pointe-à-Pitre", city: "Pointe-à-Pitre", country: "Guadeloupe", lat: 16.2389, lon: -61.5347 },
  { code: "MQFDF", name: "Port of Fort-de-France", city: "Fort-de-France", country: "Martinique", lat: 14.6010, lon: -61.0742 },
  
  // ==================== AMERICAS - SOUTH ====================
  { code: "BRSSZ", name: "Port of Santos", city: "Santos", country: "Brazil", lat: -23.9608, lon: -46.3278 },
  { code: "BRPNG", name: "Port of Paranagua", city: "Paranagua", country: "Brazil", lat: -25.5162, lon: -48.5223 },
  { code: "BRRIO", name: "Port of Rio de Janeiro", city: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lon: -43.1729 },
  { code: "BRITJ", name: "Port of Itajaí", city: "Itajaí", country: "Brazil", lat: -26.9078, lon: -48.6619 },
  { code: "BRSFS", name: "Port of São Francisco do Sul", city: "São Francisco do Sul", country: "Brazil", lat: -26.2436, lon: -48.6389 },
  { code: "BRVIT", name: "Port of Vitoria", city: "Vitoria", country: "Brazil", lat: -20.3155, lon: -40.3128 },
  { code: "BRREC", name: "Port of Recife", city: "Recife", country: "Brazil", lat: -8.0476, lon: -34.8770 },
  { code: "BRSAL", name: "Port of Salvador", city: "Salvador", country: "Brazil", lat: -12.9714, lon: -38.5014 },
  { code: "BRFOR", name: "Port of Fortaleza", city: "Fortaleza", country: "Brazil", lat: -3.7172, lon: -38.5433 },
  { code: "BRMAO", name: "Port of Manaus", city: "Manaus", country: "Brazil", lat: -3.1190, lon: -60.0217 },
  { code: "BRBEL", name: "Port of Belem", city: "Belem", country: "Brazil", lat: -1.4558, lon: -48.5044 },
  { code: "BRPEC", name: "Port of Pecem", city: "São Gonçalo do Amarante", country: "Brazil", lat: -3.5447, lon: -38.7896 },
  { code: "BRSUA", name: "Port of Suape", city: "Ipojuca", country: "Brazil", lat: -8.3933, lon: -34.9547 },
  { code: "ARBUE", name: "Port of Buenos Aires", city: "Buenos Aires", country: "Argentina", lat: -34.6037, lon: -58.3816 },
  { code: "ARZAE", name: "Port of Zarate", city: "Zarate", country: "Argentina", lat: -34.0892, lon: -59.0283 },
  { code: "ARBHI", name: "Port of Bahia Blanca", city: "Bahia Blanca", country: "Argentina", lat: -38.7196, lon: -62.2724 },
  { code: "ARROS", name: "Port of Rosario", city: "Rosario", country: "Argentina", lat: -32.9468, lon: -60.6393 },
  { code: "CLSAI", name: "Port of San Antonio", city: "San Antonio", country: "Chile", lat: -33.5932, lon: -71.6127 },
  { code: "CLVAP", name: "Port of Valparaiso", city: "Valparaiso", country: "Chile", lat: -33.0472, lon: -71.6127 },
  { code: "CLTAL", name: "Port of Talcahuano", city: "Talcahuano", country: "Chile", lat: -36.7167, lon: -73.1167 },
  { code: "CLPUQ", name: "Port of Punta Arenas", city: "Punta Arenas", country: "Chile", lat: -53.1638, lon: -70.9171 },
  { code: "CLIQQ", name: "Port of Iquique", city: "Iquique", country: "Chile", lat: -20.2141, lon: -70.1524 },
  { code: "CLARI", name: "Port of Arica", city: "Arica", country: "Chile", lat: -18.4783, lon: -70.3126 },
  { code: "PECLL", name: "Port of Callao", city: "Lima", country: "Peru", lat: -12.0464, lon: -77.0428 },
  { code: "PEIQT", name: "Port of Ilo", city: "Ilo", country: "Peru", lat: -17.6392, lon: -71.3378 },
  { code: "PEMAT", name: "Port of Matarani", city: "Matarani", country: "Peru", lat: -17.0000, lon: -72.1000 },
  { code: "COGAQ", name: "Port of Cartagena", city: "Cartagena", country: "Colombia", lat: 10.3910, lon: -75.4794 },
  { code: "COBUN", name: "Port of Buenaventura", city: "Buenaventura", country: "Colombia", lat: 3.8801, lon: -77.0190 },
  { code: "COBAR", name: "Port of Barranquilla", city: "Barranquilla", country: "Colombia", lat: 10.9639, lon: -74.7964 },
  { code: "ECGYE", name: "Port of Guayaquil", city: "Guayaquil", country: "Ecuador", lat: -2.1894, lon: -79.8891 },
  { code: "ECMEC", name: "Port of Manta", city: "Manta", country: "Ecuador", lat: -0.9498, lon: -80.7089 },
  { code: "ECPTB", name: "Port of Puerto Bolivar", city: "Machala", country: "Ecuador", lat: -3.2617, lon: -79.9553 },
  { code: "UYMVD", name: "Port of Montevideo", city: "Montevideo", country: "Uruguay", lat: -34.9011, lon: -56.1915 },
  { code: "VELAG", name: "Port of La Guaira", city: "Caracas", country: "Venezuela", lat: 10.5945, lon: -66.9336 },
  { code: "VEPBL", name: "Port of Puerto Cabello", city: "Puerto Cabello", country: "Venezuela", lat: 10.4731, lon: -68.0155 },
  { code: "SRPAR", name: "Port of Paramaribo", city: "Paramaribo", country: "Suriname", lat: 5.8520, lon: -55.2038 },
  { code: "GYGEO", name: "Port of Georgetown", city: "Georgetown", country: "Guyana", lat: 6.8013, lon: -58.1551 },
  
  // ==================== OCEANIA ====================
  { code: "AUMEL", name: "Port of Melbourne", city: "Melbourne", country: "Australia", lat: -37.8136, lon: 144.9631 },
  { code: "AUSYD", name: "Port of Sydney", city: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
  { code: "AUBNE", name: "Port of Brisbane", city: "Brisbane", country: "Australia", lat: -27.4698, lon: 153.0251 },
  { code: "AUFRE", name: "Port of Fremantle", city: "Perth", country: "Australia", lat: -32.0569, lon: 115.7439 },
  { code: "AUADL", name: "Port of Adelaide", city: "Adelaide", country: "Australia", lat: -34.9285, lon: 138.6007 },
  { code: "AUDWN", name: "Port of Darwin", city: "Darwin", country: "Australia", lat: -12.4634, lon: 130.8456 },
  { code: "AUTOW", name: "Port of Townsville", city: "Townsville", country: "Australia", lat: -19.2590, lon: 146.8169 },
  { code: "AUNTL", name: "Port of Newcastle", city: "Newcastle", country: "Australia", lat: -32.9283, lon: 151.7817 },
  { code: "AUCNS", name: "Port of Cairns", city: "Cairns", country: "Australia", lat: -16.9186, lon: 145.7781 },
  { code: "NZAKL", name: "Port of Auckland", city: "Auckland", country: "New Zealand", lat: -36.8485, lon: 174.7633 },
  { code: "NZTRG", name: "Port of Tauranga", city: "Tauranga", country: "New Zealand", lat: -37.6878, lon: 176.1651 },
  { code: "NZLYT", name: "Port of Lyttelton", city: "Christchurch", country: "New Zealand", lat: -43.6100, lon: 172.7206 },
  { code: "NZWLG", name: "Port of Wellington", city: "Wellington", country: "New Zealand", lat: -41.2865, lon: 174.7762 },
  { code: "NZNSN", name: "Port of Nelson", city: "Nelson", country: "New Zealand", lat: -41.2706, lon: 173.2840 },
  { code: "PGPOM", name: "Port Moresby", city: "Port Moresby", country: "Papua New Guinea", lat: -9.4438, lon: 147.1803 },
  { code: "PGLAE", name: "Port of Lae", city: "Lae", country: "Papua New Guinea", lat: -6.7340, lon: 147.0027 },
  { code: "FJSUV", name: "Port of Suva", city: "Suva", country: "Fiji", lat: -18.1416, lon: 178.4419 },
  { code: "FJLTK", name: "Port of Lautoka", city: "Lautoka", country: "Fiji", lat: -17.6034, lon: 177.4544 },
  { code: "WSAPW", name: "Port of Apia", city: "Apia", country: "Samoa", lat: -13.8333, lon: -171.7500 },
  { code: "VUVLI", name: "Port of Vila", city: "Port Vila", country: "Vanuatu", lat: -17.7333, lon: 168.3167 },
  { code: "NCNOU", name: "Port of Noumea", city: "Noumea", country: "New Caledonia", lat: -22.2763, lon: 166.4572 },
  { code: "PFPPT", name: "Port of Papeete", city: "Papeete", country: "French Polynesia", lat: -17.5333, lon: -149.5667 },
  { code: "GUAPR", name: "Port of Apra", city: "Hagatna", country: "Guam", lat: 13.4443, lon: 144.6564 },
  { code: "TONU", name: "Port of Nuku'alofa", city: "Nuku'alofa", country: "Tonga", lat: -21.1383, lon: -175.1950 },
];

interface PortSearchProps {
  value: string;
  onChange: (port: Port | null) => void;
  placeholder?: string;
  label?: string;
}

export const PortSearch = ({ value, onChange, placeholder = "Search port...", label }: PortSearchProps) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find selected port when value changes externally
  useEffect(() => {
    if (value) {
      const found = PORTS_DATABASE.find(p => p.code === value);
      if (found) {
        setSelectedPort(found);
        setQuery(`${found.city} (${found.code})`);
      }
    } else {
      setSelectedPort(null);
      setQuery('');
    }
  }, [value]);

  // Filter ports based on query
  const filteredPorts = useMemo(() => {
    if (!query || selectedPort) return [];
    
    const searchTerm = query.toLowerCase().trim();
    if (searchTerm.length < 1) return [];
    
    return PORTS_DATABASE
      .filter(port => 
        port.city.toLowerCase().includes(searchTerm) ||
        port.code.toLowerCase().includes(searchTerm) ||
        port.name.toLowerCase().includes(searchTerm) ||
        port.country.toLowerCase().includes(searchTerm)
      )
      .slice(0, 8);
  }, [query, selectedPort]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setSelectedPort(null);
    setShowDropdown(true);
    
    if (!newValue) {
      onChange(null);
    }
  };

  const handleSelect = (port: Port) => {
    setSelectedPort(port);
    setQuery(`${port.city} (${port.code})`);
    onChange(port);
    setShowDropdown(false);
  };

  const handleFocus = () => {
    if (!selectedPort && query.length >= 1) {
      setShowDropdown(true);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSelectedPort(null);
    onChange(null);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="pl-9 pr-8 rounded-xl border-[#E5E7EB] focus:border-[#0EA5E9] focus:ring-[#0EA5E9] transition-all"
        />
        {selectedPort && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569] hover:text-[#1E293B] transition-colors"
          >
            ×
          </button>
        )}
      </div>
      
      {/* Dropdown */}
      {showDropdown && filteredPorts.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg max-h-64 overflow-y-auto"
        >
          {filteredPorts.map((port) => (
            <button
              key={port.code}
              type="button"
              onClick={() => handleSelect(port)}
              className={cn(
                "w-full px-3 py-2.5 flex items-start gap-3 hover:bg-[#F0F9FF] transition-colors text-left",
                "first:rounded-t-xl last:rounded-b-xl"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-8 w-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
                  <Anchor className="h-4 w-4 text-[#0EA5E9]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1E293B]">{port.code}</span>
                  <span className="text-sm text-[#475569] truncate">{port.city}</span>
                </div>
                <div className="text-xs text-[#64748B] truncate">
                  {port.name} • {port.country}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* No results message */}
      {showDropdown && query.length >= 1 && !selectedPort && filteredPorts.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-2 text-[#475569]">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">No ports found for "{query}"</span>
          </div>
        </div>
      )}
    </div>
  );
};

export { PORTS_DATABASE };
