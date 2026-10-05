// Sample assumptions for demonstrating the calculator. These are not Cabrera's
// prices or a vehicle-specific repair database. Replace with approved shop data.
window.CABRERA_ESTIMATOR_CONFIG = {
  pricingMode: 'sample',
  laborRate: 120,
  services: [
    { id: 'oil', name: 'Oil & filter change', parts: [35, 80], hours: [0.3, 0.6], scope: 'Oil and one filter. Oil type, quantity, and filter specification must be confirmed.' },
    { id: 'brake-pads', name: 'Brake pads — one axle', parts: [65, 160], hours: [1, 1.8], scope: 'One axle of brake pads. Rotors, calipers, brake fluid, and additional repairs are excluded.' },
    { id: 'brakes-rotors', name: 'Brake pads & rotors — one axle', parts: [180, 380], hours: [1.2, 2.2], scope: 'Pads and two rotors on one axle. Calipers and other braking-system work are excluded.' },
    { id: 'battery', name: 'Battery replacement', parts: [120, 260], hours: [0.3, 0.8], scope: 'One battery and basic installation. Registration, programming, and electrical diagnosis are excluded.' },
    { id: 'spark-plugs', name: 'Spark plug replacement', parts: [40, 160], hours: [1, 3], scope: 'Spark plugs only. Ignition coils and other tune-up work are excluded.' },
    { id: 'alternator', name: 'Alternator replacement', parts: [200, 500], hours: [1.5, 3.5], scope: 'Alternator and basic replacement labor. Belts, wiring, and diagnosis are excluded.' },
    { id: 'water-pump', name: 'Water pump replacement', parts: [100, 350], hours: [2, 5], scope: 'Sample allowance for a water pump and replacement labor. Electric pumps, timing-system work, coolant, and other related work require a separate quote.' },
    { id: 'struts', name: 'Front struts — pair', parts: [240, 600], hours: [2, 4], scope: 'Two front struts and replacement labor. Alignment, mounts, and additional suspension work are excluded.' }
  ]
};
