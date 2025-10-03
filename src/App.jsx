import React, { useState, useEffect } from 'react';
import { Calculator, Coffee, Droplets, Clock, Thermometer, Beaker, Wine } from 'lucide-react';

const ColdBrewCalculator = () => {
  // Phase management
  const [phase, setPhase] = useState('prepare'); // 'prepare' or 'serve'

  // Preparation phase states
  const [inputMode, setInputMode] = useState('coffee');
  const [coffeeAmount, setCoffeeAmount] = useState(150);
  const [waterAmount, setWaterAmount] = useState(600);
  const [targetRatio, setTargetRatio] = useState(4);
  const [roastLevel, setRoastLevel] = useState('medium');
  const [strengthPreference, setStrengthPreference] = useState('concentrate');

  // Serving phase states
  const [savedConcentrateRatio, setSavedConcentrateRatio] = useState(null);
  const [savedConcentrateStrength, setSavedConcentrateStrength] = useState(null);
  const [dispenserCapacity, setDispenserCapacity] = useState(500);
  const [concentrateAmount, setConcentrateAmount] = useState(200);
  const [desiredStrength, setDesiredStrength] = useState('medium');

  const roastAdjustments = {
    light: { ratioMultiplier: 0.9, steepTime: '20-24', notes: 'Light roasts extract slower, use slightly less water' },
    medium: { ratioMultiplier: 1.0, steepTime: '18-20', notes: 'Standard extraction time and ratio' },
    dark: { ratioMultiplier: 1.1, steepTime: '16-18', notes: 'Dark roasts extract faster, use slightly more water' },
    'very-dark': { ratioMultiplier: 1.2, steepTime: '14-16', notes: 'Very dark roasts can become bitter, shorter steep recommended' }
  };

  const strengthPresets = {
    'mega-concentrate': { ratio: 3, dilution: '1:4-5', strength: 'Mega Strong', name: 'Mega Concentrate (1:3)' },
    'concentrate': { ratio: 4, dilution: '1:3-4', strength: 'Strong', name: 'Strong Concentrate (1:4)' },
    'medium-concentrate': { ratio: 6, dilution: '1:2-3', strength: 'Medium', name: 'Medium Concentrate (1:6)' },
    'ready-to-drink': { ratio: 8, dilution: 'Ready to drink', strength: 'Light-Medium', name: 'Ready to Drink (1:8)' }
  };

  const servingStrengths = {
    'strong': { multiplier: 3, name: 'Strong' },
    'medium': { multiplier: 4, name: 'Medium' },
    'mild': { multiplier: 5, name: 'Mild' }
  };

  useEffect(() => {
    const adjustedRatio = targetRatio * roastAdjustments[roastLevel].ratioMultiplier;

    if (inputMode === 'coffee') {
      setWaterAmount(Math.round(coffeeAmount * adjustedRatio));
    } else {
      setCoffeeAmount(Math.round(waterAmount / adjustedRatio));
    }
  }, [coffeeAmount, waterAmount, targetRatio, roastLevel, inputMode]);

  const handleStrengthChange = (strength) => {
    setStrengthPreference(strength);
    setTargetRatio(strengthPresets[strength].ratio);
  };

  const actualRatio = waterAmount / coffeeAmount;
  const estimatedYield = Math.round(waterAmount * 0.85);

  const saveConcentrateAndSwitchToServe = () => {
    setSavedConcentrateRatio(actualRatio);
    setSavedConcentrateStrength(strengthPreference);
    setPhase('serve');
  };

  // Serving calculations
  const waterNeeded = Math.round(dispenserCapacity - concentrateAmount);
  const finalRatio = concentrateAmount > 0 ? dispenserCapacity / concentrateAmount : 0;
  const effectiveStrength = savedConcentrateRatio ? (savedConcentrateRatio * finalRatio) : 0;

  // Calculate recommended amounts based on desired strength
  const recommendedConcentrate = Math.round(dispenserCapacity / (1 + servingStrengths[desiredStrength].multiplier));
  const recommendedWater = dispenserCapacity - recommendedConcentrate;

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
      {/* Phase Toggle */}
      <div className="bg-white rounded-lg shadow-lg p-2 sm:p-4 mb-3 sm:mb-6">
        <div className="flex gap-2 sm:gap-4 justify-center">
          <button
            onClick={() => setPhase('prepare')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-base font-bold transition-all ${
              phase === 'prepare'
                ? 'bg-amber-600 text-white shadow-lg scale-105'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <Beaker size={16} className="sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">STEP 1: Prepare Concentrate</span>
            <span className="sm:hidden">Prepare</span>
          </button>
          <button
            onClick={() => setPhase('serve')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-base font-bold transition-all ${
              phase === 'serve'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <Wine size={16} className="sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">STEP 2: Serve & Dilute</span>
            <span className="sm:hidden">Serve</span>
          </button>
        </div>
      </div>

      {/* PREPARATION PHASE */}
      {phase === 'prepare' && (
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
            <Beaker className="text-amber-600" size={20} />
            <h1 className="text-lg sm:text-3xl font-bold text-gray-800">Step 1: Prepare Your Concentrate</h1>
          </div>

          <div className="mb-3 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">What do you want to control?</label>
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() => setInputMode('coffee')}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-colors ${
                  inputMode === 'coffee' ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Coffee size={16} />
                Coffee Amount
              </button>
              <button
                onClick={() => setInputMode('water')}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-colors ${
                  inputMode === 'water' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Droplets size={16} />
                Water Amount
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-6">
            <div className="space-y-3 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-3">Concentrate Strength</label>
                <select
                  value={strengthPreference}
                  onChange={(e) => handleStrengthChange(e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {Object.entries(strengthPresets).map(([key, preset]) => (
                    <option key={key} value={key}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-3">
                  <Coffee className="inline mr-1 sm:mr-2" size={14} />
                  Coffee ({inputMode === 'coffee' ? 'Control' : 'Calculated'})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={coffeeAmount}
                    onChange={(e) => setCoffeeAmount(Number(e.target.value))}
                    disabled={inputMode !== 'coffee'}
                    className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-base border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      inputMode !== 'coffee' ? 'bg-gray-100 text-gray-600' : 'border-gray-300'
                    }`}
                    min="1"
                  />
                  <span className="absolute right-2 sm:right-3 top-1.5 sm:top-2.5 text-xs sm:text-sm text-gray-500">g</span>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-3">
                  <Droplets className="inline mr-1 sm:mr-2" size={14} />
                  Water ({inputMode === 'water' ? 'Control' : 'Calculated'})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={waterAmount}
                    onChange={(e) => setWaterAmount(Number(e.target.value))}
                    disabled={inputMode !== 'water'}
                    className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      inputMode !== 'water' ? 'bg-gray-100 text-gray-600' : 'border-gray-300'
                    }`}
                    min="1"
                  />
                  <span className="absolute right-2 sm:right-3 top-1.5 sm:top-2.5 text-xs sm:text-sm text-gray-500">ml</span>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-3">
                  <Thermometer className="inline mr-1 sm:mr-2" size={14} />
                  Roast Level
                </label>
                <select
                  value={roastLevel}
                  onChange={(e) => setRoastLevel(e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="light">Light Roast</option>
                  <option value="medium">Medium Roast</option>
                  <option value="dark">Dark Roast</option>
                  <option value="very-dark">Very Dark Roast</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-6">
              <div className="bg-amber-50 p-2.5 sm:p-4 rounded-lg border-l-4 border-amber-600">
                <h3 className="font-bold text-amber-800 mb-2 sm:mb-3 text-sm sm:text-base">Your Concentrate Recipe</h3>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span>Coffee:</span>
                    <span className="font-medium">{coffeeAmount}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Water:</span>
                    <span className="font-medium">{waterAmount}ml</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ratio:</span>
                    <span className="font-medium">1:{actualRatio.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Yield:</span>
                    <span className="font-medium">{estimatedYield}ml concentrate</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-2.5 sm:p-4 rounded-lg border-l-4 border-blue-600">
                <h3 className="font-bold text-blue-800 mb-2 sm:mb-3 text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                  <Clock size={14} />
                  Brewing Instructions
                </h3>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-700">
                  <p><strong>Grind:</strong> Coarse (Baratza 30-35)</p>
                  <p><strong>Steep Time:</strong> {roastAdjustments[roastLevel].steepTime} hours</p>
                  <p><strong>Method:</strong> Room temp or fridge</p>
                  <p><strong>Strain:</strong> Double strain for clarity</p>
                </div>
              </div>

              <div className="bg-orange-50 p-2.5 sm:p-4 rounded-lg border-l-4 border-orange-600">
                <h3 className="font-bold text-orange-800 mb-1.5 sm:mb-2 text-sm sm:text-base">Roast Notes</h3>
                <p className="text-xs sm:text-sm text-orange-700">{roastAdjustments[roastLevel].notes}</p>
              </div>

              <button
                onClick={saveConcentrateAndSwitchToServe}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 text-xs sm:text-base rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                ✓ Done Brewing - Go to Serving →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SERVING PHASE */}
      {phase === 'serve' && (
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
            <Wine className="text-blue-600" size={20} />
            <h1 className="text-lg sm:text-3xl font-bold text-gray-800">Step 2: Serve Your Cold Brew</h1>
          </div>

          {savedConcentrateRatio && (
            <div className="bg-green-50 p-2.5 sm:p-4 rounded-lg mb-3 sm:mb-6 border-l-4 border-green-600">
              <h3 className="font-bold text-green-800 mb-1 sm:mb-2 text-sm sm:text-base">Your Concentrate Info</h3>
              <p className="text-xs sm:text-sm text-green-700">
                You made: <strong>{strengthPresets[savedConcentrateStrength].name}</strong> (1:{savedConcentrateRatio.toFixed(1)} ratio)
              </p>
            </div>
          )}

          {!savedConcentrateRatio && (
            <div className="bg-yellow-50 p-2.5 sm:p-4 rounded-lg mb-3 sm:mb-6 border-l-4 border-yellow-600">
              <h3 className="font-bold text-yellow-800 mb-1.5 sm:mb-2 text-sm sm:text-base">Which concentrate did you make?</h3>
              <select
                onChange={(e) => {
                  setSavedConcentrateStrength(e.target.value);
                  setSavedConcentrateRatio(strengthPresets[e.target.value].ratio);
                }}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select your concentrate type...</option>
                {Object.entries(strengthPresets).map(([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-3 sm:gap-6">
            <div className="space-y-3 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-3">
                  Nitro Dispenser Capacity
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={dispenserCapacity}
                    onChange={(e) => setDispenserCapacity(Number(e.target.value))}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="100"
                    max="1000"
                  />
                  <span className="absolute right-2 sm:right-3 top-1.5 sm:top-2.5 text-xs sm:text-sm text-gray-500">ml</span>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-3">
                  Desired Serving Strength
                </label>
                <select
                  value={desiredStrength}
                  onChange={(e) => setDesiredStrength(e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(servingStrengths).map(([key, strength]) => (
                    <option key={key} value={key}>{strength.name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 p-2.5 sm:p-4 rounded-lg border-2 border-blue-500">
                <h3 className="font-bold text-blue-800 mb-2 sm:mb-3 text-sm sm:text-base">📋 Recommended Recipe</h3>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span>Concentrate:</span>
                    <span className="font-bold text-base sm:text-lg text-blue-900">{recommendedConcentrate}ml</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cold Water:</span>
                    <span className="font-bold text-base sm:text-lg text-blue-900">{recommendedWater}ml</span>
                  </div>
                  <div className="border-t border-blue-300 pt-1.5 sm:pt-2 mt-1.5 sm:mt-2">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">{dispenserCapacity}ml</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-2.5 sm:p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Or Customize:</h3>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Concentrate Amount
                </label>
                <div className="relative">
                  <input
                    type="range"
                    value={concentrateAmount}
                    onChange={(e) => setConcentrateAmount(Number(e.target.value))}
                    min="50"
                    max={dispenserCapacity - 50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-1">
                    <span>50ml</span>
                    <span className="font-bold">{concentrateAmount}ml</span>
                    <span>{dispenserCapacity - 50}ml</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-6">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-3 sm:p-6 rounded-lg border-2 border-amber-500">
                <h3 className="font-bold text-amber-900 mb-2 sm:mb-4 text-base sm:text-xl">🎯 Your Mix</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="bg-white p-2 sm:p-3 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-600">Add Concentrate</div>
                    <div className="text-xl sm:text-3xl font-bold text-amber-900">{concentrateAmount}ml</div>
                  </div>
                  <div className="text-center text-lg sm:text-2xl text-amber-700">+</div>
                  <div className="bg-white p-2 sm:p-3 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-600">Add Cold Water</div>
                    <div className="text-xl sm:text-3xl font-bold text-blue-900">{waterNeeded}ml</div>
                  </div>
                  <div className="text-center text-lg sm:text-2xl text-amber-700">=</div>
                  <div className="bg-amber-900 text-white p-2 sm:p-3 rounded-lg">
                    <div className="text-xs sm:text-sm">Total in Dispenser</div>
                    <div className="text-xl sm:text-3xl font-bold">{dispenserCapacity}ml</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-2.5 sm:p-4 rounded-lg border-l-4 border-purple-600">
                <h3 className="font-bold text-purple-800 mb-1.5 sm:mb-2 text-sm sm:text-base">Final Dilution</h3>
                <p className="text-xs sm:text-sm text-purple-700">
                  Dilution Ratio: <strong>1:{(finalRatio - 1).toFixed(1)}</strong>
                  <br />
                  (1 part concentrate + {(finalRatio - 1).toFixed(1)} parts water)
                </p>
              </div>

              <div className="bg-green-50 p-2.5 sm:p-4 rounded-lg border-l-4 border-green-600">
                <h3 className="font-bold text-green-800 mb-1.5 sm:mb-2 text-sm sm:text-base">💡 Pro Tips</h3>
                <ul className="text-xs sm:text-sm text-green-700 space-y-0.5 sm:space-y-1 list-disc list-inside">
                  <li>Add concentrate first, then water</li>
                  <li>Stir gently before adding nitrogen</li>
                  <li>Chill concentrate for best results</li>
                  <li>Adjust ratio to taste next time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColdBrewCalculator;
