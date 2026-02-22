// Data statis untuk wilayah Asia Tenggara
// country: negara, region: provinsi, zone: kota/kabupaten

export const countries = [
  { id: 'ID', name: 'Indonesia' },
  { id: 'MY', name: 'Malaysia' },
  { id: 'SG', name: 'Singapura' },
  { id: 'TH', name: 'Thailand' },
  { id: 'VN', name: 'Vietnam' },
  { id: 'PH', name: 'Filipina' },
  { id: 'MM', name: 'Myanmar' },
  { id: 'KH', name: 'Kamboja' },
  { id: 'LA', name: 'Laos' },
  { id: 'BN', name: 'Brunei' },
  { id: 'TL', name: 'Timor Leste' },
];

// Region (provinsi) per negara, kecuali Singapura (tidak ada region)
export const regions = {
  ID: [
    { id: 'ID-AC', name: 'Aceh' },
    { id: 'ID-SU', name: 'Sumatera Utara' },
    { id: 'ID-SB', name: 'Sumatera Barat' },
    { id: 'ID-RI', name: 'Riau' },
    { id: 'ID-JA', name: 'Jambi' },
    { id: 'ID-SS', name: 'Sumatera Selatan' },
    { id: 'ID-BE', name: 'Bengkulu' },
    { id: 'ID-LA', name: 'Lampung' },
    { id: 'ID-BB', name: 'Bangka Belitung' },
    { id: 'ID-KR', name: 'Kepulauan Riau' },
    { id: 'ID-JK', name: 'DKI Jakarta' },
    { id: 'ID-JB', name: 'Jawa Barat' },
    { id: 'ID-JT', name: 'Jawa Tengah' },
    { id: 'ID-DI', name: 'DI Yogyakarta' },
    { id: 'ID-JI', name: 'Jawa Timur' },
    { id: 'ID-BT', name: 'Banten' },
    { id: 'ID-BA', name: 'Bali' },
    { id: 'ID-NB', name: 'Nusa Tenggara Barat' },
    { id: 'ID-NT', name: 'Nusa Tenggara Timur' },
    { id: 'ID-KB', name: 'Kalimantan Barat' },
    { id: 'ID-KT', name: 'Kalimantan Tengah' },
    { id: 'ID-KS', name: 'Kalimantan Selatan' },
    { id: 'ID-KI', name: 'Kalimantan Timur' },
    { id: 'ID-KU', name: 'Kalimantan Utara' },
    { id: 'ID-SA', name: 'Sulawesi Utara' },
    { id: 'ID-ST', name: 'Sulawesi Tengah' },
    { id: 'ID-SG', name: 'Sulawesi Selatan' },
    { id: 'ID-SE', name: 'Sulawesi Tenggara' },
    { id: 'ID-GO', name: 'Gorontalo' },
    { id: 'ID-SR', name: 'Sulawesi Barat' },
    { id: 'ID-MA', name: 'Maluku' },
    { id: 'ID-MU', name: 'Maluku Utara' },
    { id: 'ID-PA', name: 'Papua' },
    { id: 'ID-PB', name: 'Papua Barat' },
    { id: 'ID-PT', name: 'Papua Tengah' },
    { id: 'ID-PS', name: 'Papua Selatan' },
    { id: 'ID-PP', name: 'Papua Pegunungan' },
    { id: 'ID-PD', name: 'Papua Barat Daya' },
  ],
  MY: [
    { id: 'MY-JH', name: 'Johor' },
    { id: 'MY-KD', name: 'Kedah' },
    { id: 'MY-KL', name: 'Kelantan' },
    { id: 'MY-ML', name: 'Melaka' },
    { id: 'MY-NS', name: 'Negeri Sembilan' },
    { id: 'MY-PH', name: 'Pahang' },
    { id: 'MY-PK', name: 'Perak' },
    { id: 'MY-PL', name: 'Perlis' },
    { id: 'MY-PG', name: 'Pulau Pinang' },
    { id: 'MY-SB', name: 'Sabah' },
    { id: 'MY-SK', name: 'Sarawak' },
    { id: 'MY-SL', name: 'Selangor' },
    { id: 'MY-TR', name: 'Terengganu' },
    { id: 'MY-KL', name: 'Kuala Lumpur' },
    { id: 'MY-LB', name: 'Labuan' },
    { id: 'MY-PJ', name: 'Putrajaya' },
  ],
  TH: [
    { id: 'TH-BK', name: 'Bangkok' },
    { id: 'TH-CM', name: 'Chiang Mai' },
    { id: 'TH-PH', name: 'Phuket' },
    // ... can add for future expansion
  ],
  VN: [
    { id: 'VN-HN', name: 'Hanoi' },
    { id: 'VN-HC', name: 'Ho Chi Minh' },
    // ... can add for future expansion
  ],
  PH: [
    { id: 'PH-MN', name: 'Metro Manila' },
    { id: 'PH-CB', name: 'Cebu' },
    // ... can add for future expansion
  ],
  MM: [
    { id: 'MM-YG', name: 'Yangon' },
    // ... can add for future expansion
  ],
  KH: [
    { id: 'KH-PP', name: 'Phnom Penh' },
    // ... can add for future expansion
  ],
  LA: [
    { id: 'LA-VT', name: 'Vientiane' },
    // ... can add for future expansion
  ],
  BN: [
    { id: 'BN-BM', name: 'Brunei-Muara' },
    // ... can add for future expansion
  ],
  TL: [
    { id: 'TL-DI', name: 'Dili' },
    // ... can add for future expansion
  ],
};

// Zone (kota/kabupaten) per region atau langsung per negara (untuk Singapura)
export const zones = {
  // Contoh untuk beberapa region Indonesia
  'ID-AC': [
    { id: 'ID-AC-BA', name: 'Kabupaten Aceh Barat' },
    { id: 'ID-AC-BD', name: 'Kabupaten Aceh Besar' },
    { id: 'ID-AC-BH', name: 'Kota Banda Aceh' },
  ],
  'ID-JB': [
    { id: 'ID-JB-BD', name: 'Kabupaten Bandung' },
    { id: 'ID-JB-CI', name: 'Kabupaten Cianjur' },
    { id: 'ID-JB-BG', name: 'Kota Bandung' },
    { id: 'ID-JB-BK', name: 'Kota Bekasi' },
  ],
  'ID-JT': [
    { id: 'ID-JT-SM', name: 'Kota Semarang' },
    { id: 'ID-JT-SK', name: 'Kabupaten Sukoharjo' },
  ],
  // Contoh Malaysia
  'MY-SL': [
    { id: 'MY-SL-PJ', name: 'Petaling Jaya' },
    { id: 'MY-SL-SH', name: 'Shah Alam' },
  ],
  // Singapura: langsung di bawah negara
  SG: [
    { id: 'SG-CE', name: 'Central' },
    { id: 'SG-NO', name: 'North' },
    { id: 'SG-EA', name: 'East' },
    { id: 'SG-WE', name: 'West' },
    { id: 'SG-NE', name: 'North-East' },
  ],
  // Tambahkan sesuai kebutuhan
};