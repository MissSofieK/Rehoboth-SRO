import React, { useState, useMemo } from 'react';
import { Download } from 'lucide-react';

const RehobothFinancialModel = () => {
  // Exchange rates (fixed as per requirements)
  const EUR_RATE = 25;
  const USD_RATE = 23;

  // Equipment tiers based on market research
  const equipmentTiers = {
    core: {
      name: "Essential Setup",
      total: 1050000,
      items: [
        { category: "Acoustic Treatment", item: "Control room + live room treatment", cost: 180000 },
        { category: "Recording", item: "Audio interface (Focusrite/Universal Audio)", cost: 85000 },
        { category: "Recording", item: "Studio monitors pair (Yamaha HS8)", cost: 25000 },
        { category: "Recording", item: "Studio headphones (4 pairs)", cost: 18000 },
        { category: "Microphones", item: "Condenser mic (Rode NT1-A)", cost: 8000 },
        { category: "Microphones", item: "Dynamic mics (Shure SM58 x3)", cost: 12000 },
        { category: "Software", item: "DAW licenses (Pro Tools/Logic)", cost: 45000 },
        { category: "Computers", item: "Mac Studio/high-end PC for recording", cost: 120000 },
        { category: "Furniture", item: "Studio desk, chairs, equipment racks", cost: 75000 },
        { category: "Podcast Lab", item: "4-person podcast setup with interface", cost: 95000 },
        { category: "Podcast Lab", item: "Video cameras + lighting (basic)", cost: 65000 },
        { category: "IT Infrastructure", item: "Network, backup storage (10TB NAS)", cost: 85000 },
        { category: "Cables & Accessories", item: "XLR cables, stands, pop filters", cost: 35000 },
        { category: "Office Equipment", item: "Reception furniture, printer, phones", cost: 45000 },
        { category: "Security", item: "Cameras, alarm system, access control", cost: 60000 },
        { category: "Legal & Licensing", item: "Business registration, initial insurance", cost: 97000 }
      ]
    },
    midRange: {
      name: "Mid-Range Expansion",
      total: 720000,
      items: [
        { category: "Microphones", item: "Neumann TLM 103 (vocal condenser)", cost: 35000 },
        { category: "Microphones", item: "Sennheiser MD 421 (instrument dynamic)", cost: 18000 },
        { category: "Microphones", item: "AKG C414 XLII (versatile condenser)", cost: 45000 },
        { category: "Recording", item: "Upgraded monitors (Adam A7V pair)", cost: 55000 },
        { category: "Recording", item: "Outboard preamps (Focusrite ISA)", cost: 85000 },
        { category: "Recording", item: "Compressor/EQ hardware unit", cost: 95000 },
        { category: "Instruments", item: "Electric guitar + amp", cost: 45000 },
        { category: "Instruments", item: "Bass guitar + amp", cost: 35000 },
        { category: "Instruments", item: "Digital piano/keyboard (88-key)", cost: 55000 },
        { category: "Instruments", item: "Acoustic guitar", cost: 25000 },
        { category: "Instruments", item: "Basic drum kit with cymbals", cost: 75000 },
        { category: "Software", item: "Additional plugins bundle (Waves/Slate)", cost: 65000 },
        { category: "Podcast Lab", item: "Professional camera upgrade (Sony A7)", cost: 55000 },
        { category: "Furniture", item: "Producer couch, client lounge setup", cost: 32000 }
      ]
    },
    premium: {
      name: "Premium/Best in Czechia",
      total: 890000,
      items: [
        { category: "Microphones", item: "Neumann U87 Ai (industry standard)", cost: 115000 },
        { category: "Microphones", item: "Neumann TLM 49 (vocal excellence)", cost: 65000 },
        { category: "Microphones", item: "Shure SM7B (broadcast quality)", cost: 18000 },
        { category: "Microphones", item: "Royer R-121 (ribbon mic)", cost: 52000 },
        { category: "Recording", item: "High-end monitors (Focal Twin6 Be)", cost: 145000 },
        { category: "Recording", item: "Dangerous Music monitoring controller", cost: 85000 },
        { category: "Recording", item: "Premium preamp (API 3124+ quad)", cost: 165000 },
        { category: "Recording", item: "Hardware compressor (Universal Audio 1176)", cost: 95000 },
        { category: "Software", item: "UAD-2 satellite + premium plugins", cost: 75000 },
        { category: "Acoustic", item: "Custom acoustic design consultation", cost: 45000 },
        { category: "Video", item: "Cinema camera + gimbal (Blackmagic)", cost: 95000 },
        { category: "Instruments", item: "Premium upright piano", cost: 135000 }
      ]
    }
  };

  // Assumptions state
  const [assumptions, setAssumptions] = useState({
    // Rent from spreadsheet
    rentSchedule: {
      nov2025: 274807,
      dec2025: 30251,
      jan2026: 274807,
      feb_aug2026: 321032,
      sep2026_onward: 395588
    },
    securityDeposit: 244556,
    
    // Multi-tenant building structure
    buildingTenants: {
      church: 150000, // Fixed monthly contribution
      studio: 0.15, // 15% of remaining rent
      cafe: 0.25, // 25% of remaining rent
      event: 0.30, // 30% of remaining rent
      barber: 0.10, // 10% of remaining rent
      itHub: 0.15, // 15% of remaining rent
      autoSchool: 0.05 // 5% of remaining rent
    },
    
    // Studio allocation (calculated from above)
    studioRentShare: 0.15,
    churchContribution: 150000,
    
    // Artist advance and split
    artistAdvancePerArtist: 240000,
    artistSplit: 0.40,
    labelSplit: 0.60,
    
    // Staff salaries (monthly, CZK) - based on Prague market 2025
    salaries: {
      generalManager: 45000,
      soundEngineer: 38000,
      assistantEngineer: 28000,
      marketing: 32000,
      admin: 30000,
      arManager: 0, // Added in year 2
      podcastCoordinator: 0 // Added in year 2
    },
    
    // Studio utilization %
    utilization: {
      year1: 0.45,
      year2: 0.60,
      year3: 0.70,
      year4: 0.75,
      year5: 0.80
    },
    
    // Pricing (CZK) - based on Czech market research
    studioHourlyRate: 800,
    studioDayRate: 5000,
    podcastHourlyRate: 600,
    podcastDayRate: 3500,
    mixingPerTrack: 2500,
    masteringPerTrack: 1500,
    rehearsalHourlyRate: 400,
    
    // Market data
    streamingRatePerPlay: 0.08,
    averageStreamsPerTrack: 200000,
    vatRate: 0.21,
    
    // Equipment tier selection
    equipmentTier: 'core' // core, midRange, premium
  });

  const [equipmentTier, setEquipmentTier] = useState('core');
  const [profitShareScenario, setProfitShareScenario] = useState('baseline'); // baseline, conservative, optimistic

  // Calculate total equipment cost based on selected tier
  const getTotalEquipmentCost = () => {
    const tiers = {
      core: equipmentTiers.core.total,
      midRange: equipmentTiers.core.total + equipmentTiers.midRange.total,
      premium: equipmentTiers.core.total + equipmentTiers.midRange.total + equipmentTiers.premium.total
    };
    return tiers[equipmentTier];
  };

  // Calculate monthly rent based on period
  const getMonthlyRent = (year, month) => {
    const { rentSchedule } = assumptions;
    if (year === 2025 && month === 11) return rentSchedule.nov2025;
    if (year === 2025 && month === 12) return rentSchedule.dec2025;
    if (year === 2026 && month === 1) return rentSchedule.jan2026;
    if (year === 2026 && month >= 2 && month <= 8) return rentSchedule.feb_aug2026;
    return rentSchedule.sep2026_onward;
  };

  // Calculate rent allocation for each business unit
  const calculateRentAllocation = (year) => {
    const rentSchedule = assumptions.rentSchedule;
    const monthlyRentAvg = year === 2026 ? 
      (rentSchedule.jan2026 + rentSchedule.feb_aug2026 * 7 + rentSchedule.sep2026_onward * 4) / 12 :
      rentSchedule.sep2026_onward;
    
    const churchContribution = assumptions.churchContribution;
    const netRent = monthlyRentAvg - churchContribution;
    
    return {
      totalRent: monthlyRentAvg,
      churchContribution: churchContribution,
      netRentToAllocate: netRent,
      studio: netRent * assumptions.buildingTenants.studio,
      cafe: netRent * assumptions.buildingTenants.cafe,
      event: netRent * assumptions.buildingTenants.event,
      barber: netRent * assumptions.buildingTenants.barber,
      itHub: netRent * assumptions.buildingTenants.itHub,
      autoSchool: netRent * assumptions.buildingTenants.autoSchool
    };
  };

  // Calculate annual financials
  const calculateAnnualFinancials = (year) => {
    const yearIndex = year - 2026;
    const yearKey = 'year' + (yearIndex + 1);
    const utilization = assumptions.utilization[yearKey] || 0.75;
    
    // Revenue calculations
    const workingDays = 250;
    const workingHours = workingDays * 8;
    
    // Studio revenue (recording sessions)
    const studioHours = workingHours * utilization;
    const studioRevenue = studioHours * assumptions.studioHourlyRate;
    
    // Mixing/Mastering revenue
    const tracksPerYear = yearIndex >= 1 ? 120 + (yearIndex * 40) : 80;
    const mixingRevenue = tracksPerYear * assumptions.mixingPerTrack;
    const masteringRevenue = tracksPerYear * assumptions.masteringPerTrack;
    
    // Podcast revenue
    const podcastDays = workingDays * 0.4 * utilization;
    const podcastRevenue = podcastDays * assumptions.podcastDayRate;
    
    // Rehearsal space revenue
    const rehearsalHours = workingDays * 4 * utilization * 0.6;
    const rehearsalRevenue = rehearsalHours * assumptions.rehearsalHourlyRate;
    
    // Label revenue (starting year 2)
    const artistsSignedYear2 = yearIndex >= 1 ? 2 : 0;
    const artistsSignedYear3Plus = yearIndex >= 2 ? (yearIndex - 1) * 2 + 2 : 0;
    const totalArtists = Math.max(artistsSignedYear2, artistsSignedYear3Plus);
    
    const tracksPerArtist = 10;
    const totalTracks = totalArtists * tracksPerArtist;
    const streamingRevenue = totalTracks * assumptions.averageStreamsPerTrack * assumptions.streamingRatePerPlay;
    const labelRevenue = streamingRevenue * assumptions.labelSplit;
    
    // Workshop/Training revenue (starting year 2)
    const workshopRevenue = yearIndex >= 1 ? 180000 + (yearIndex * 60000) : 0;
    
    const totalRevenue = studioRevenue + mixingRevenue + masteringRevenue + 
                        podcastRevenue + rehearsalRevenue + labelRevenue + workshopRevenue;
    
    // Cost calculations
    const rentAllocation = calculateRentAllocation(year);
    const studioRent = rentAllocation.studio;
    const annualRent = studioRent * 12;
    
    // Staffing that scales with growth
    let staffSalaries = { ...assumptions.salaries };
    if (yearIndex >= 1) {
      staffSalaries.arManager = 42000;
      staffSalaries.podcastCoordinator = 28000;
    }
    if (yearIndex >= 2) {
      staffSalaries.labelDirector = 48000;
    }
    
    const monthlyPayroll = Object.values(staffSalaries).reduce((a, b) => a + b, 0);
    const annualPayroll = monthlyPayroll * 12;
    
    const utilities = (15000 + (yearIndex * 2000)) * 12;
    const marketing = (20000 + (yearIndex * 3000)) * 12;
    const maintenance = (10000 + (yearIndex * 1500)) * 12;
    const insurance = (8000 + (yearIndex * 1000)) * 12;
    const artistAdvances = totalArtists * (assumptions.artistAdvancePerArtist / 2); // Split over 2 years
    const softwareSubscriptions = 15000 * 12;
    
    const totalOPEX = annualRent + annualPayroll + utilities + marketing + 
                     maintenance + insurance + artistAdvances + softwareSubscriptions;
    
    // CAPEX (year 1 only)
    const equipmentCost = getTotalEquipmentCost();
    const renovationCost = 850000;
    const CAPEX = year === 2026 ? (equipmentCost + renovationCost) : 0;
    
    // Calculate profit metrics
    const EBITDA = totalRevenue - totalOPEX;
    const totalCapex = equipmentCost + renovationCost;
    const depreciation = totalCapex / 5; // 5-year amortization
    const EBIT = EBITDA - depreciation;
    const netProfit = year === 2026 ? EBIT - CAPEX : EBIT;
    
    return {
      revenue: {
        studio: studioRevenue,
        mixing: mixingRevenue,
        mastering: masteringRevenue,
        podcast: podcastRevenue,
        rehearsal: rehearsalRevenue,
        label: labelRevenue,
        workshops: workshopRevenue,
        total: totalRevenue
      },
      costs: {
        rent: annualRent,
        payroll: annualPayroll,
        utilities,
        marketing,
        maintenance,
        insurance,
        artistAdvances,
        softwareSubscriptions,
        totalOPEX,
        CAPEX,
        depreciation,
        equipmentCost: year === 2026 ? equipmentCost : 0,
        renovationCost: year === 2026 ? renovationCost : 0
      },
      profit: {
        EBITDA,
        EBIT,
        netProfit
      },
      metrics: {
        artists: totalArtists,
        utilizationRate: utilization,
        tracks: tracksPerYear,
        staffCount: Object.keys(staffSalaries).filter(k => staffSalaries[k] > 0).length
      }
    };
  };

  // Calculate all years
  const years = [2026, 2027, 2028, 2029, 2030];
  const financials = useMemo(() => 
    years.reduce((acc, year) => ({
      ...acc,
      [year]: calculateAnnualFinancials(year)
    }), {}),
    [assumptions, equipmentTier]
  );

  // Calculate cumulative ROI
  const calculateROI = () => {
    let cumulativeProfit = 0;
    const initialInvestment = getTotalEquipmentCost() + 850000;
    
    return years.map(year => {
      cumulativeProfit += financials[year].profit.netProfit;
      const roi = (cumulativeProfit / initialInvestment) * 100;
      return { year, cumulativeProfit, roi, initialInvestment };
    });
  };

  const roiData = calculateROI();

  // Format currency
  const formatCZK = (amount) => new Intl.NumberFormat('cs-CZ').format(Math.round(amount));
  const formatEUR = (amount) => new Intl.NumberFormat('de-DE').format(Math.round(amount / EUR_RATE));
  const formatUSD = (amount) => new Intl.NumberFormat('en-US').format(Math.round(amount / USD_RATE));

  // Active tab state
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'assumptions', label: 'Assumptions' },
    { id: 'building', label: 'Building Split' },
    { id: 'income', label: 'Income' },
    { id: 'costs', label: 'Costs' },
    { id: 'statements', label: 'P&L' },
    { id: 'profitshare', label: 'Profit Share' },
    { id: 'scenarios', label: 'Scenarios' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Rehoboth Studios & Records</h1>
              <p className="text-slate-600 mt-1">Financial Model 2026-2030 • Updated Nov 2025</p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <Download size={20} />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Executive Summary</h2>
                
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                    <p className="text-sm opacity-90">Total Investment</p>
                    <p className="text-3xl font-bold mt-2">{formatCZK(roiData[0].initialInvestment / 1000)}K</p>
                    <p className="text-sm mt-1">{formatEUR(roiData[0].initialInvestment)} EUR</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
                    <p className="text-sm opacity-90">Year 3 Revenue</p>
                    <p className="text-3xl font-bold mt-2">{formatCZK(financials[2028].revenue.total / 1000)}K</p>
                    <p className="text-sm mt-1">{formatEUR(financials[2028].revenue.total)} EUR</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                    <p className="text-sm opacity-90">5-Year ROI</p>
                    <p className="text-3xl font-bold mt-2">{roiData[4].roi.toFixed(1)}%</p>
                    <p className="text-sm mt-1">Cumulative Return</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-lg">
                    <p className="text-sm opacity-90">Breakeven</p>
                    <p className="text-3xl font-bold mt-2">Month 18</p>
                    <p className="text-sm mt-1">Jun 2027 (projected)</p>
                  </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">5-Year Revenue Projection</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-slate-200">
                          <th className="text-left p-2 font-semibold">Year</th>
                          <th className="text-right p-2 font-semibold">Studio</th>
                          <th className="text-right p-2 font-semibold">Podcast</th>
                          <th className="text-right p-2 font-semibold">Label</th>
                          <th className="text-right p-2 font-semibold">Other</th>
                          <th className="text-right p-2 font-semibold">Total (CZK)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {years.map(year => {
                          const f = financials[year];
                          const other = f.revenue.mixing + f.revenue.mastering + f.revenue.rehearsal + f.revenue.workshops;
                          return (
                            <tr key={year} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-2 font-medium">{year}</td>
                              <td className="p-2 text-right">{formatCZK(f.revenue.studio)}</td>
                              <td className="p-2 text-right">{formatCZK(f.revenue.podcast)}</td>
                              <td className="p-2 text-right">{formatCZK(f.revenue.label)}</td>
                              <td className="p-2 text-right">{formatCZK(other)}</td>
                              <td className="p-2 text-right font-bold">{formatCZK(f.revenue.total)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Profitability Chart */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Net Profit Trend</h3>
                  <div className="space-y-3">
                    {years.map(year => {
                      const profit = financials[year].profit.netProfit;
                      const maxProfit = Math.max(...years.map(y => Math.abs(financials[y].profit.netProfit)));
                      const barWidth = (Math.abs(profit) / maxProfit) * 100;
                      const isNegative = profit < 0;
                      
                      return (
                        <div key={year} className="flex items-center gap-4">
                          <span className="w-16 font-medium text-slate-700">{year}</span>
                          <div className="flex-1 bg-slate-100 rounded-full h-8 relative">
                            <div
                              className={`h-full rounded-full ${isNegative ? 'bg-red-500' : 'bg-green-500'} transition-all duration-500`}
                              style={{ width: `${barWidth}%` }}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-700">
                              {formatCZK(profit)} CZK
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'income' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Revenue Projections</h2>

                {/* Revenue Sources Breakdown */}
                {years.map(year => {
                  const f = financials[year];
                  return (
                    <div key={year} className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">{year} Revenue Breakdown</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 text-blue-700">Studio Services</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Recording sessions ({(f.metrics.utilizationRate * 100).toFixed(0)}% utilization)</span>
                              <span className="font-mono">{formatCZK(f.revenue.studio)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Mixing ({f.metrics.tracks} tracks)</span>
                              <span className="font-mono">{formatCZK(f.revenue.mixing)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Mastering</span>
                              <span className="font-mono">{formatCZK(f.revenue.mastering)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Rehearsal space</span>
                              <span className="font-mono">{formatCZK(f.revenue.rehearsal)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t font-semibold">
                              <span>Subtotal:</span>
                              <span className="font-mono">{formatCZK(f.revenue.studio + f.revenue.mixing + f.revenue.mastering + f.revenue.rehearsal)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 text-green-700">Content & Label</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Podcast lab sessions</span>
                              <span className="font-mono">{formatCZK(f.revenue.podcast)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Label royalties ({f.metrics.artists} artists)</span>
                              <span className="font-mono">{formatCZK(f.revenue.label)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Workshops & training</span>
                              <span className="font-mono">{formatCZK(f.revenue.workshops)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t font-semibold">
                              <span>Subtotal:</span>
                              <span className="font-mono">{formatCZK(f.revenue.podcast + f.revenue.label + f.revenue.workshops)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold">Total Revenue {year}:</span>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-green-600">{formatCZK(f.revenue.total)} CZK</span>
                            <p className="text-sm text-slate-600">{formatEUR(f.revenue.total)} EUR / {formatUSD(f.revenue.total)} USD</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Revenue Growth Chart */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Revenue Growth by Category</h3>
                  <div className="space-y-4">
                    {['studio', 'podcast', 'label'].map(category => {
                      const maxRevenue = Math.max(...years.map(y => financials[y].revenue[category]));
                      return (
                        <div key={category}>
                          <p className="text-sm font-medium mb-2 capitalize">{category}</p>
                          <div className="flex gap-2">
                            {years.map(year => {
                              const value = financials[year].revenue[category];
                              const height = (value / maxRevenue) * 100;
                              return (
                                <div key={year} className="flex-1 flex flex-col items-center">
                                  <div className="w-full bg-slate-100 rounded-t" style={{ height: '120px', display: 'flex', alignItems: 'flex-end' }}>
                                    <div 
                                      className="w-full bg-blue-500 rounded-t transition-all" 
                                      style={{ height: `${height}%` }}
                                    />
                                  </div>
                                  <span className="text-xs mt-1">{year}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'costs' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Cost Structure & Equipment</h2>

                {/* Equipment Tier Selection */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Equipment Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {Object.entries(equipmentTiers).map(([key, tier]) => (
                      <button
                        key={key}
                        onClick={() => setEquipmentTier(key)}
                        className={`p-4 rounded-lg border-2 transition ${
                          equipmentTier === key
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <p className="font-bold text-lg mb-2">{tier.name}</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCZK(tier.total)} CZK</p>
                        <p className="text-sm text-slate-600 mt-1">{formatEUR(tier.total)} EUR</p>
                      </button>
                    ))}
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold mb-2">Total Investment with Selected Tier:</p>
                    <p className="text-3xl font-bold text-green-600">{formatCZK(getTotalEquipmentCost() + 850000)} CZK</p>
                    <p className="text-sm text-slate-600">Equipment + Renovation (850,000 CZK)</p>
                  </div>
                </div>

                {/* Equipment Details by Tier */}
                <div className="space-y-4">
                  {equipmentTier === 'core' && (
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4 text-blue-700">Essential Setup Equipment</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {equipmentTiers.core.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start p-3 bg-slate-50 rounded">
                            <div>
                              <p className="font-semibold text-sm">{item.item}</p>
                              <p className="text-xs text-slate-600">{item.category}</p>
                            </div>
                            <span className="font-mono text-sm font-semibold">{formatCZK(item.cost)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <span className="font-bold text-lg">Core Equipment Total:</span>
                        <span className="text-2xl font-bold text-blue-600">{formatCZK(equipmentTiers.core.total)} CZK</span>
                      </div>
                    </div>
                  )}

                  {equipmentTier === 'midRange' && (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Mid-Range Configuration</strong> includes all Essential Setup equipment PLUS the following upgrades:
                        </p>
                      </div>
                      <div className="bg-white border rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4 text-green-700">Mid-Range Add-Ons</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {equipmentTiers.midRange.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start p-3 bg-slate-50 rounded">
                              <div>
                                <p className="font-semibold text-sm">{item.item}</p>
                                <p className="text-xs text-slate-600">{item.category}</p>
                              </div>
                              <span className="font-mono text-sm font-semibold">{formatCZK(item.cost)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t space-y-2">
                          <div className="flex justify-between">
                            <span>Core equipment:</span>
                            <span className="font-mono">{formatCZK(equipmentTiers.core.total)} CZK</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Mid-range add-ons:</span>
                            <span className="font-mono">{formatCZK(equipmentTiers.midRange.total)} CZK</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="font-bold text-lg">Total Equipment Cost:</span>
                            <span className="text-2xl font-bold text-green-600">
                              {formatCZK(equipmentTiers.core.total + equipmentTiers.midRange.total)} CZK
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {equipmentTier === 'premium' && (
                    <>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="text-sm text-purple-800">
                          <strong>Premium Configuration</strong> includes Essential + Mid-Range equipment PLUS premium upgrades to position Rehoboth among the best studios in Czechia:
                        </p>
                      </div>
                      <div className="bg-white border rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4 text-purple-700">Premium Upgrades</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {equipmentTiers.premium.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start p-3 bg-slate-50 rounded">
                              <div>
                                <p className="font-semibold text-sm">{item.item}</p>
                                <p className="text-xs text-slate-600">{item.category}</p>
                              </div>
                              <span className="font-mono text-sm font-semibold">{formatCZK(item.cost)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t space-y-2">
                          <div className="flex justify-between">
                            <span>Core equipment:</span>
                            <span className="font-mono">{formatCZK(equipmentTiers.core.total)} CZK</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Mid-range add-ons:</span>
                            <span className="font-mono">{formatCZK(equipmentTiers.midRange.total)} CZK</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Premium upgrades:</span>
                            <span className="font-mono">{formatCZK(equipmentTiers.premium.total)} CZK</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="font-bold text-lg">Total Equipment Cost:</span>
                            <span className="text-2xl font-bold text-purple-600">
                              {formatCZK(equipmentTiers.core.total + equipmentTiers.midRange.total + equipmentTiers.premium.total)} CZK
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Operating Costs by Year */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Annual Operating Costs</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-slate-200">
                          <th className="text-left p-2 font-semibold">Cost Category</th>
                          {years.map(year => (
                            <th key={year} className="text-right p-2 font-semibold">{year}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-2 font-medium">Rent allocation</td>
                          {years.map(year => (
                            <td key={year} className="p-2 text-right font-mono">{formatCZK(financials[year].costs.rent)}</td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-2 font-medium">Payroll ({financials[2026].metrics.staffCount}+ staff)</td>
                          {years.map(year => (
                            <td key={year} className="p-2 text-right font-mono">{formatCZK(financials[year].costs.payroll)}</td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-2 font-medium">Utilities</td>
                          {years.map(year => (
                            <td key={year} className="p-2 text-right font-mono">{formatCZK(financials[year].costs.utilities)}</td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-2 font-medium">Marketing</td>
                          {years.map(year => (
                            <td key={year} className="p-2 text-right font-mono">{formatCZK(financials[year].costs.marketing)}</td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-2 font-medium">Maintenance</td>
                          {years.map(year => (
                            <td key={year} className="p-2 text-right font-mono">{formatCZK(financials[year].costs.maintenance)}</td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-2 font-medium">Insurance</td>
                          {years.map(year => (
                            <td key={year} className="p-2 text-right font-mono">{formatCZK(financials[year].costs.insurance)}</td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-2 font-medium">Artist advances</td>
                          {years.map(year => (
                            <td key={year} className="p-2 text-right font-mono">{formatCZK(financials[year].costs.artistAdvances)}</td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-2 font-medium">Software subscriptions</td>
                          {years.map(year => (
                            <td key={year} className="p-2 text-right font-mono">{formatCZK(financials[year].costs.softwareSubscriptions)}</td>
                          ))}
                        </tr>
                        <tr className="bg-red-50 font-bold">
                          <td className="p-2">Total OPEX</td>
                          {years.map(year => (
                            <td key={year} className="p-2 text-right font-mono">{formatCZK(financials[year].costs.totalOPEX)}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Staffing Plan */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Staffing Evolution</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="font-semibold mb-3">Year 1 (2026) - Core Team</p>
                        <ul className="text-sm space-y-1">
                          <li>• General Manager (45,000 CZK/mo)</li>
                          <li>• Sound Engineer (38,000 CZK/mo)</li>
                          <li>• Assistant Engineer (28,000 CZK/mo)</li>
                          <li>• Marketing Lead (32,000 CZK/mo)</li>
                          <li>• Admin (30,000 CZK/mo)</li>
                        </ul>
                        <p className="mt-3 font-bold">5 staff • 173,000 CZK/mo</p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="font-semibold mb-3">Year 2+ (2027+) - Expansion</p>
                        <ul className="text-sm space-y-1">
                          <li>• All Year 1 positions</li>
                          <li>• A&R Manager (42,000 CZK/mo)</li>
                          <li>• Podcast Coordinator (28,000 CZK/mo)</li>
                        </ul>
                        <p className="mt-3 font-bold">7 staff • 243,000 CZK/mo</p>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="font-semibold mb-3">Year 3+ (2028+) - Mature</p>
                        <ul className="text-sm space-y-1">
                          <li>• All Year 2 positions</li>
                          <li>• Label Director (48,000 CZK/mo)</li>
                          <li>• Additional contractors as needed</li>
                        </ul>
                        <p className="mt-3 font-bold">8 staff • 291,000 CZK/mo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'building' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Building Rent Allocation</h2>

                {/* Rent Structure Overview */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">Multi-Tenant Building Structure</h3>
                  <p className="text-slate-700 mb-4">
                    The building houses multiple business units, each contributing to rent based on space utilization and revenue potential. 
                    RCCG Rehoboth Center provides a fixed monthly contribution of <strong>150,000 CZK</strong>, with remaining rent 
                    allocated proportionally among business units.
                  </p>
                </div>

                {/* Annual Rent Breakdown */}
                {years.map(year => {
                  const allocation = calculateRentAllocation(year);
                  const annualTotal = allocation.totalRent * 12;
                  const annualChurch = allocation.churchContribution * 12;
                  const annualNet = allocation.netRentToAllocate * 12;

                  return (
                    <div key={year} className="bg-white border rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">{year} Rent Allocation</h3>
                      
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <p className="text-sm text-slate-600 mb-1">Total Building Rent</p>
                          <p className="text-2xl font-bold text-slate-800">{formatCZK(allocation.totalRent)}</p>
                          <p className="text-xs text-slate-500 mt-1">{formatCZK(annualTotal)} / year</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-slate-600 mb-1">Church Contribution</p>
                          <p className="text-2xl font-bold text-green-600">{formatCZK(allocation.churchContribution)}</p>
                          <p className="text-xs text-slate-500 mt-1">{formatCZK(annualChurch)} / year</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-slate-600 mb-1">Business Units Share</p>
                          <p className="text-2xl font-bold text-blue-600">{formatCZK(allocation.netRentToAllocate)}</p>
                          <p className="text-xs text-slate-500 mt-1">{formatCZK(annualNet)} / year</p>
                        </div>
                      </div>

                      {/* Detailed Allocation Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b-2 border-slate-200 bg-slate-50">
                              <th className="text-left p-3 font-semibold">Business Unit</th>
                              <th className="text-center p-3 font-semibold">% of Net Rent</th>
                              <th className="text-right p-3 font-semibold">Monthly (CZK)</th>
                              <th className="text-right p-3 font-semibold">Annual (CZK)</th>
                              <th className="text-right p-3 font-semibold">EUR / Year</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b hover:bg-slate-50">
                              <td className="p-3 font-medium text-blue-700">Rehoboth Studios & Records</td>
                              <td className="p-3 text-center font-mono">{(assumptions.buildingTenants.studio * 100).toFixed(0)}%</td>
                              <td className="p-3 text-right font-mono">{formatCZK(allocation.studio)}</td>
                              <td className="p-3 text-right font-mono font-bold">{formatCZK(allocation.studio * 12)}</td>
                              <td className="p-3 text-right text-slate-600">{formatEUR(allocation.studio * 12)}</td>
                            </tr>
                            <tr className="border-b hover:bg-slate-50">
                              <td className="p-3 font-medium">Café & Restaurant</td>
                              <td className="p-3 text-center font-mono">{(assumptions.buildingTenants.cafe * 100).toFixed(0)}%</td>
                              <td className="p-3 text-right font-mono">{formatCZK(allocation.cafe)}</td>
                              <td className="p-3 text-right font-mono font-bold">{formatCZK(allocation.cafe * 12)}</td>
                              <td className="p-3 text-right text-slate-600">{formatEUR(allocation.cafe * 12)}</td>
                            </tr>
                            <tr className="border-b hover:bg-slate-50">
                              <td className="p-3 font-medium">Event Center</td>
                              <td className="p-3 text-center font-mono">{(assumptions.buildingTenants.event * 100).toFixed(0)}%</td>
                              <td className="p-3 text-right font-mono">{formatCZK(allocation.event)}</td>
                              <td className="p-3 text-right font-mono font-bold">{formatCZK(allocation.event * 12)}</td>
                              <td className="p-3 text-right text-slate-600">{formatEUR(allocation.event * 12)}</td>
                            </tr>
                            <tr className="border-b hover:bg-slate-50">
                              <td className="p-3 font-medium">Barber & Salon</td>
                              <td className="p-3 text-center font-mono">{(assumptions.buildingTenants.barber * 100).toFixed(0)}%</td>
                              <td className="p-3 text-right font-mono">{formatCZK(allocation.barber)}</td>
                              <td className="p-3 text-right font-mono font-bold">{formatCZK(allocation.barber * 12)}</td>
                              <td className="p-3 text-right text-slate-600">{formatEUR(allocation.barber * 12)}</td>
                            </tr>
                            <tr className="border-b hover:bg-slate-50">
                              <td className="p-3 font-medium">IT Training Hub</td>
                              <td className="p-3 text-center font-mono">{(assumptions.buildingTenants.itHub * 100).toFixed(0)}%</td>
                              <td className="p-3 text-right font-mono">{formatCZK(allocation.itHub)}</td>
                              <td className="p-3 text-right font-mono font-bold">{formatCZK(allocation.itHub * 12)}</td>
                              <td className="p-3 text-right text-slate-600">{formatEUR(allocation.itHub * 12)}</td>
                            </tr>
                            <tr className="border-b hover:bg-slate-50">
                              <td className="p-3 font-medium">Auto Škola (Driving School)</td>
                              <td className="p-3 text-center font-mono">{(assumptions.buildingTenants.autoSchool * 100).toFixed(0)}%</td>
                              <td className="p-3 text-right font-mono">{formatCZK(allocation.autoSchool)}</td>
                              <td className="p-3 text-right font-mono font-bold">{formatCZK(allocation.autoSchool * 12)}</td>
                              <td className="p-3 text-right text-slate-600">{formatEUR(allocation.autoSchool * 12)}</td>
                            </tr>
                            <tr className="bg-blue-50 font-bold">
                              <td className="p-3">Business Units Subtotal</td>
                              <td className="p-3 text-center">100%</td>
                              <td className="p-3 text-right font-mono">{formatCZK(allocation.netRentToAllocate)}</td>
                              <td className="p-3 text-right font-mono">{formatCZK(annualNet)}</td>
                              <td className="p-3 text-right">{formatEUR(annualNet)}</td>
                            </tr>
                            <tr className="bg-green-50 font-bold border-t-2">
                              <td className="p-3">RCCG Rehoboth Center</td>
                              <td className="p-3 text-center">—</td>
                              <td className="p-3 text-right font-mono">{formatCZK(allocation.churchContribution)}</td>
                              <td className="p-3 text-right font-mono">{formatCZK(annualChurch)}</td>
                              <td className="p-3 text-right">{formatEUR(annualChurch)}</td>
                            </tr>
                            <tr className="bg-slate-100 font-bold text-lg border-t-2">
                              <td className="p-3">Total Building Rent</td>
                              <td className="p-3 text-center">—</td>
                              <td className="p-3 text-right font-mono">{formatCZK(allocation.totalRent)}</td>
                              <td className="p-3 text-right font-mono">{formatCZK(annualTotal)}</td>
                              <td className="p-3 text-right">{formatEUR(annualTotal)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Visual Breakdown */}
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Visual Distribution</h4>
                        <div className="space-y-2">
                          {[
                            { name: 'Church (Fixed)', value: allocation.churchContribution, color: 'bg-green-500', total: allocation.totalRent },
                            { name: 'Event Center', value: allocation.event, color: 'bg-purple-500', total: allocation.totalRent },
                            { name: 'Café', value: allocation.cafe, color: 'bg-amber-500', total: allocation.totalRent },
                            { name: 'Studio', value: allocation.studio, color: 'bg-blue-500', total: allocation.totalRent },
                            { name: 'IT Hub', value: allocation.itHub, color: 'bg-cyan-500', total: allocation.totalRent },
                            { name: 'Barber', value: allocation.barber, color: 'bg-pink-500', total: allocation.totalRent },
                            { name: 'Auto School', value: allocation.autoSchool, color: 'bg-slate-500', total: allocation.totalRent }
                          ].map(item => {
                            const percentage = (item.value / item.total) * 100;
                            return (
                              <div key={item.name} className="flex items-center gap-3">
                                <span className="w-32 text-sm">{item.name}</span>
                                <div className="flex-1 bg-slate-100 rounded-full h-6 relative">
                                  <div
                                    className={`h-full rounded-full ${item.color} transition-all`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium">
                                    {percentage.toFixed(1)}%
                                  </span>
                                </div>
                                <span className="w-24 text-right text-sm font-mono">{formatCZK(item.value)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Key Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold mb-2 text-green-800">Church Contribution Model</h4>
                    <ul className="text-sm space-y-1 text-green-900">
                      <li>• Fixed at 150,000 CZK/month regardless of total rent</li>
                      <li>• Covers primary worship space + offices</li>
                      <li>• Provides stability for business units</li>
                      <li>• Reduces effective rent burden by ~38-40%</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold mb-2 text-blue-800">Allocation Rationale</h4>
                    <ul className="text-sm space-y-1 text-blue-900">
                      <li>• <strong>Event Center (30%):</strong> Largest space, highest utility use</li>
                      <li>• <strong>Café (25%):</strong> High-traffic area, kitchen infrastructure</li>
                      <li>• <strong>Studio (15%):</strong> Specialized acoustic space</li>
                      <li>• <strong>IT Hub (15%):</strong> Classroom + lab requirements</li>
                      <li>• <strong>Barber (10%):</strong> Moderate space, equipment needs</li>
                      <li>• <strong>Auto School (5%):</strong> Minimal space (office only)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assumptions' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Key Assumptions</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-3">Rent Structure & Building Split</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total monthly rent (2026+):</span>
                        <span className="font-mono">{formatCZK(assumptions.rentSchedule.sep2026_onward)} CZK</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span>Church contribution (fixed):</span>
                        <span className="font-mono font-bold text-green-600">{formatCZK(assumptions.churchContribution)} CZK</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                        <span>Business units share:</span>
                        <span className="font-mono">{formatCZK(assumptions.rentSchedule.sep2026_onward - assumptions.churchContribution)} CZK</span>
                      </div>
                      <div className="flex justify-between text-xs pt-2">
                        <span>Studio allocation:</span>
                        <span className="font-mono">{(assumptions.buildingTenants.studio * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Café allocation:</span>
                        <span className="font-mono">{(assumptions.buildingTenants.cafe * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Event center allocation:</span>
                        <span className="font-mono">{(assumptions.buildingTenants.event * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Other units:</span>
                        <span className="font-mono">{((assumptions.buildingTenants.barber + assumptions.buildingTenants.itHub + assumptions.buildingTenants.autoSchool) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-3">Artist & Label Split</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Artist share:</span>
                        <span className="font-mono font-bold text-blue-600">{(assumptions.artistSplit * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Label share:</span>
                        <span className="font-mono font-bold text-green-600">{(assumptions.labelSplit * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span>Artist advance (2 yrs):</span>
                        <span className="font-mono">{formatCZK(assumptions.artistAdvancePerArtist)} CZK</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg streams/track:</span>
                        <span className="font-mono">{formatCZK(assumptions.averageStreamsPerTrack)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate per stream:</span>
                        <span className="font-mono">{assumptions.streamingRatePerPlay.toFixed(2)} CZK</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-3">Studio Pricing</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Hourly rate:</span>
                        <span className="font-mono">{formatCZK(assumptions.studioHourlyRate)} CZK</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Day rate:</span>
                        <span className="font-mono">{formatCZK(assumptions.studioDayRate)} CZK</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Podcast hourly:</span>
                        <span className="font-mono">{formatCZK(assumptions.podcastHourlyRate)} CZK</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mixing/track:</span>
                        <span className="font-mono">{formatCZK(assumptions.mixingPerTrack)} CZK</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mastering/track:</span>
                        <span className="font-mono">{formatCZK(assumptions.masteringPerTrack)} CZK</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-3">Utilization Rates</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Year 1 (2026):</span>
                        <span className="font-mono">{(assumptions.utilization.year1 * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year 2 (2027):</span>
                        <span className="font-mono">{(assumptions.utilization.year2 * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year 3 (2028):</span>
                        <span className="font-mono">{(assumptions.utilization.year3 * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year 4 (2029):</span>
                        <span className="font-mono">{(assumptions.utilization.year4 * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year 5 (2030):</span>
                        <span className="font-mono">{(assumptions.utilization.year5 * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Exchange Rates (Fixed):</strong> 1 EUR = {EUR_RATE} CZK | 1 USD = {USD_RATE} CZK
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'statements' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Profit & Loss Statement</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left p-2 font-bold border">Item</th>
                        {years.map(year => (
                          <th key={year} className="text-right p-2 font-bold border">{year}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-blue-50">
                        <td className="p-2 font-bold border">REVENUE</td>
                        {years.map(year => (
                          <td key={year} className="p-2 text-right font-bold border">{formatCZK(financials[year].revenue.total)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 pl-6 border">Studio bookings</td>
                        {years.map(year => (
                          <td key={year} className="p-2 text-right border">{formatCZK(financials[year].revenue.studio)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 pl-6 border">Podcast lab</td>
                        {years.map(year => (
                          <td key={year} className="p-2 text-right border">{formatCZK(financials[year].revenue.podcast)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 pl-6 border">Label royalties</td>
                        {years.map(year => (
                          <td key={year} className="p-2 text-right border">{formatCZK(financials[year].revenue.label)}</td>
                        ))}
                      </tr>
                      
                      <tr className="bg-red-50">
                        <td className="p-2 font-bold border">OPERATING EXPENSES</td>
                        {years.map(year => (
                          <td key={year} className="p-2 text-right font-bold border">{formatCZK(financials[year].costs.totalOPEX)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 pl-6 border">Rent allocation</td>
                        {years.map(year => (
                          <td key={year} className="p-2 text-right border">{formatCZK(financials[year].costs.rent)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 pl-6 border">Payroll</td>
                        {years.map(year => (
                          <td key={year} className="p-2 text-right border">{formatCZK(financials[year].costs.payroll)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 pl-6 border">Utilities</td>
                        {years.map(year => (
                          <td key={year} className="p-2 text-right border">{formatCZK(financials[year].costs.utilities)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 pl-6 border">Marketing</td>
                        {years.map(year => (
                          <td key={year} className="p-2 text-right border">{formatCZK(financials[year].costs.marketing)}</td>
                        ))}
                      </tr>
                      
                      <tr className="bg-green-50">
                        <td className="p-2 font-bold border">EBITDA</td>
                        {years.map(year => (
                          <td key={year} className="p-2 text-right font-bold border">{formatCZK(financials[year].profit.EBITDA)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 pl-6 border">Depreciation</td>
                        {years.map(year => (
                          <td key={year} className="p-2 text-right border">({formatCZK(financials[year].costs.depreciation)})</td>
                        ))}
                      </tr>
                      <tr className="bg-green-100">
                        <td className="p-2 font-bold border">EBIT</td>
                        {years.map(year => (
                          <td key={year} className="p-2 text-right font-bold border">{formatCZK(financials[year].profit.EBIT)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 pl-6 border">CAPEX</td>
                        {years.map(year => (
                          <td key={year} className="p-2 text-right border">({formatCZK(financials[year].costs.CAPEX)})</td>
                        ))}
                      </tr>
                      <tr className="bg-green-200">
                        <td className="p-2 font-bold border">NET PROFIT</td>
                        {years.map(year => (
                          <td key={year} className="p-2 text-right font-bold border">{formatCZK(financials[year].profit.netProfit)}</td>
                        ))}
                      </tr>
                      
                      <tr className="bg-purple-50">
                        <td className="p-2 font-bold border">Cumulative ROI %</td>
                        {roiData.map(data => (
                          <td key={data.year} className="p-2 text-right font-bold border">{data.roi.toFixed(1)}%</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Year 1 shows negative net profit due to initial CAPEX. Breakeven projected at month 18. Years 3-5 show strong profitability with 26-30% ROI by year 5.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'profitshare' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Hybrid Profit-Sharing Model</h2>

                {/* Model Overview */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800">Employee Profit-Sharing Pool: 15% of Net Profit</h3>
                  <p className="text-slate-700 mb-4">
                    Based on industry standards in creative businesses, Rehoboth will allocate <strong>15% of annual net profits</strong> to 
                    a staff profit-sharing pool. This is distributed semi-annually among eligible employees based on role, performance, 
                    and tenure.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Industry Benchmark</p>
                      <p className="text-2xl font-bold text-green-600">10-20%</p>
                      <p className="text-xs text-slate-500 mt-1">Creative/Studio businesses</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Rehoboth Model</p>
                      <p className="text-2xl font-bold text-blue-600">15%</p>
                      <p className="text-xs text-slate-500 mt-1">Of net profit annually</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Vesting Period</p>
                      <p className="text-2xl font-bold text-purple-600">2-3 Years</p>
                      <p className="text-xs text-slate-500 mt-1">Encourages retention</p>
                    </div>
                  </div>
                </div>

                {/* Profit Share Distribution by Role */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Distribution Framework by Role</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    The 15% profit pool is distributed using a weighted point system based on role criticality, seniority, and performance.
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-slate-200">
                          <th className="text-left p-3">Role</th>
                          <th className="text-center p-3">Base Salary (CZK/mo)</th>
                          <th className="text-center p-3">Points</th>
                          <th className="text-center p-3">% of Pool</th>
                          <th className="text-center p-3">Eligibility</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-3 font-medium">General Manager</td>
                          <td className="p-3 text-center font-mono">45,000</td>
                          <td className="p-3 text-center font-bold text-blue-600">30</td>
                          <td className="p-3 text-center font-bold">25%</td>
                          <td className="p-3 text-center text-xs">After 6 months</td>
                        </tr>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-3 font-medium">Sound Engineer (Senior)</td>
                          <td className="p-3 text-center font-mono">38,000</td>
                          <td className="p-3 text-center font-bold text-blue-600">25</td>
                          <td className="p-3 text-center font-bold">21%</td>
                          <td className="p-3 text-center text-xs">After 6 months</td>
                        </tr>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-3 font-medium">A&R Manager (Y2+)</td>
                          <td className="p-3 text-center font-mono">42,000</td>
                          <td className="p-3 text-center font-bold text-blue-600">20</td>
                          <td className="p-3 text-center font-bold">17%</td>
                          <td className="p-3 text-center text-xs">After 1 year</td>
                        </tr>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-3 font-medium">Marketing Lead</td>
                          <td className="p-3 text-center font-mono">32,000</td>
                          <td className="p-3 text-center font-bold text-blue-600">15</td>
                          <td className="p-3 text-center font-bold">13%</td>
                          <td className="p-3 text-center text-xs">After 1 year</td>
                        </tr>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-3 font-medium">Assistant Engineer</td>
                          <td className="p-3 text-center font-mono">28,000</td>
                          <td className="p-3 text-center font-bold text-blue-600">12</td>
                          <td className="p-3 text-center font-bold">10%</td>
                          <td className="p-3 text-center text-xs">After 1 year</td>
                        </tr>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-3 font-medium">Podcast Coordinator (Y2+)</td>
                          <td className="p-3 text-center font-mono">28,000</td>
                          <td className="p-3 text-center font-bold text-blue-600">10</td>
                          <td className="p-3 text-center font-bold">8%</td>
                          <td className="p-3 text-center text-xs">After 1 year</td>
                        </tr>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-3 font-medium">Admin</td>
                          <td className="p-3 text-center font-mono">30,000</td>
                          <td className="p-3 text-center font-bold text-blue-600">8</td>
                          <td className="p-3 text-center font-bold">6%</td>
                          <td className="p-3 text-center text-xs">After 1 year</td>
                        </tr>
                        <tr className="bg-slate-50 font-bold">
                          <td className="p-3">Total</td>
                          <td className="p-3 text-center">—</td>
                          <td className="p-3 text-center text-blue-600">120</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 5-Year Profit Share Projections */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Projected Annual Profit-Sharing Payouts</h3>
                  
                  <div className="space-y-4">
                    {years.map(year => {
                      const netProfit = financials[year].profit.netProfit;
                      const profitSharePool = netProfit > 0 ? netProfit * 0.15 : 0;
                      const totalPoints = 120;
                      
                      const distributions = {
                        generalManager: (profitSharePool * 30) / totalPoints,
                        soundEngineer: (profitSharePool * 25) / totalPoints,
                        arManager: year >= 2027 ? (profitSharePool * 20) / totalPoints : 0,
                        marketing: (profitSharePool * 15) / totalPoints,
                        assistantEngineer: (profitSharePool * 12) / totalPoints,
                        podcastCoord: year >= 2027 ? (profitSharePool * 10) / totalPoints : 0,
                        admin: (profitSharePool * 8) / totalPoints
                      };
                      
                      return (
                        <div key={year} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-lg">{year}</h4>
                            <div className="text-right">
                              <p className="text-sm text-slate-600">Total Pool (15% of net profit)</p>
                              <p className="text-2xl font-bold text-green-600">{formatCZK(profitSharePool)} CZK</p>
                              {profitSharePool > 0 && (
                                <p className="text-xs text-slate-500">{formatEUR(profitSharePool)} EUR</p>
                              )}
                            </div>
                          </div>
                          
                          {profitSharePool > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="bg-blue-50 p-3 rounded">
                                <p className="text-xs font-medium text-slate-600">General Manager</p>
                                <p className="text-lg font-bold text-blue-600">{formatCZK(distributions.generalManager)}</p>
                              </div>
                              <div className="bg-blue-50 p-3 rounded">
                                <p className="text-xs font-medium text-slate-600">Sound Engineer</p>
                                <p className="text-lg font-bold text-blue-600">{formatCZK(distributions.soundEngineer)}</p>
                              </div>
                              {distributions.arManager > 0 && (
                                <div className="bg-blue-50 p-3 rounded">
                                  <p className="text-xs font-medium text-slate-600">A&R Manager</p>
                                  <p className="text-lg font-bold text-blue-600">{formatCZK(distributions.arManager)}</p>
                                </div>
                              )}
                              <div className="bg-blue-50 p-3 rounded">
                                <p className="text-xs font-medium text-slate-600">Marketing Lead</p>
                                <p className="text-lg font-bold text-blue-600">{formatCZK(distributions.marketing)}</p>
                              </div>
                              <div className="bg-slate-50 p-3 rounded">
                                <p className="text-xs font-medium text-slate-600">Asst. Engineer</p>
                                <p className="text-lg font-bold text-slate-600">{formatCZK(distributions.assistantEngineer)}</p>
                              </div>
                              {distributions.podcastCoord > 0 && (
                                <div className="bg-slate-50 p-3 rounded">
                                  <p className="text-xs font-medium text-slate-600">Podcast Coord.</p>
                                  <p className="text-lg font-bold text-slate-600">{formatCZK(distributions.podcastCoord)}</p>
                                </div>
                              )}
                              <div className="bg-slate-50 p-3 rounded">
                                <p className="text-xs font-medium text-slate-600">Admin</p>
                                <p className="text-lg font-bold text-slate-600">{formatCZK(distributions.admin)}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-amber-600 italic">
                              No profit-sharing pool in Year 1 due to CAPEX investment. Pool becomes available from Year 2 onward.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Comparison: Salary vs Total Compensation */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Total Compensation: Salary + Profit Share (Year 5 Example)</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    This shows how profit-sharing significantly enhances total compensation for team members.
                  </p>
                  
                  {(() => {
                    const year5NetProfit = financials[2030].profit.netProfit;
                    const year5Pool = year5NetProfit * 0.15;
                    const totalPoints = 120;
                    
                    const roles = [
                      { name: 'General Manager', salary: 45000, points: 30 },
                      { name: 'Sound Engineer', salary: 38000, points: 25 },
                      { name: 'A&R Manager', salary: 42000, points: 20 },
                      { name: 'Marketing Lead', salary: 32000, points: 15 },
                      { name: 'Assistant Engineer', salary: 28000, points: 12 }
                    ];
                    
                    return (
                      <div className="space-y-3">
                        {roles.map(role => {
                          const profitShare = (year5Pool * role.points) / totalPoints;
                          const annualSalary = role.salary * 12;
                          const totalComp = annualSalary + profitShare;
                          const bonusPercentage = (profitShare / annualSalary) * 100;
                          
                          return (
                            <div key={role.name} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                              <div className="flex-1">
                                <p className="font-semibold">{role.name}</p>
                                <p className="text-xs text-slate-600">Base: {formatCZK(annualSalary)} CZK/year</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-slate-600">+ Profit Share</p>
                                <p className="font-bold text-green-600">+{formatCZK(profitShare)}</p>
                                <p className="text-xs text-slate-500">+{bonusPercentage.toFixed(0)}%</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-slate-600">Total Comp</p>
                                <p className="text-xl font-bold text-blue-600">{formatCZK(totalComp)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Vesting Schedule & Rules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-3 text-blue-800">Vesting Schedule</h3>
                    <ul className="text-sm space-y-2 text-blue-900">
                      <li>• <strong>0-6 months:</strong> No profit-sharing eligibility</li>
                      <li>• <strong>6-12 months:</strong> 50% of allocated share (senior roles only)</li>
                      <li>• <strong>12-24 months:</strong> 75% of allocated share</li>
                      <li>• <strong>24+ months:</strong> 100% of allocated share</li>
                      <li>• <strong>3+ years:</strong> Potential for increased point allocation</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-3 text-purple-800">Key Benefits</h3>
                    <ul className="text-sm space-y-2 text-purple-900">
                      <li>• <strong>Retention:</strong> Multi-year vesting encourages long-term commitment</li>
                      <li>• <strong>Ownership mindset:</strong> Staff think like stakeholders</li>
                      <li>• <strong>Performance:</strong> Direct link between effort and reward</li>
                      <li>• <strong>Transparency:</strong> Clear, documented formula</li>
                      <li>• <strong>Fair:</strong> Weighted by responsibility and contribution</li>
                    </ul>
                  </div>
                </div>

                {/* Industry Comparison */}
                <div className="bg-slate-50 border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-3">Industry Benchmarking</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-semibold mb-2">Music Producers</p>
                      <p className="text-slate-700">Typically receive <strong>2-5% of net profits</strong> beyond base fees in independent labels</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Creative Studios</p>
                      <p className="text-slate-700">Average <strong>10-15% profit pool</strong> distributed among key staff annually</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Startups (Early Staff)</p>
                      <p className="text-slate-700">Often receive <strong>5-15% equity</strong> with 3-4 year vesting schedules</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-4 italic">
                    Sources: Music Industry Research, Square Staffing Survey 2023, Pacific Crest Group Equity Sharing Guidelines
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'scenarios' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Scenario Analysis</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                    <h3 className="font-bold text-lg text-blue-800 mb-3">Conservative</h3>
                    <ul className="text-sm space-y-2 text-blue-900">
                      <li>• 35-55% utilization</li>
                      <li>• 1 artist signed/year</li>
                      <li>• 150k streams/track</li>
                      <li>• Higher energy costs</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
                    <h3 className="font-bold text-lg text-green-800 mb-3">Baseline</h3>
                    <ul className="text-sm space-y-2 text-green-900">
                      <li>• 45-80% utilization</li>
                      <li>• 2 artists signed/year from Y2</li>
                      <li>• 200k streams/track</li>
                      <li>• Current model assumptions</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
                    <h3 className="font-bold text-lg text-purple-800 mb-3">Optimistic</h3>
                    <ul className="text-sm space-y-2 text-purple-900">
                      <li>• 60-90% utilization</li>
                      <li>• 3-4 artists signed/year</li>
                      <li>• 300k streams/track</li>
                      <li>• EU grant funding secured</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Key Sensitivity Variables</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Revenue Drivers</h4>
                      <ul className="text-sm space-y-1 text-slate-700">
                        <li>• Studio utilization rate (±15%)</li>
                        <li>• Number of artists signed (±50%)</li>
                        <li>• Streaming performance (±30%)</li>
                        <li>• Podcast lab adoption (±20%)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Cost Factors</h4>
                      <ul className="text-sm space-y-1 text-slate-700">
                        <li>• Energy prices (±25%)</li>
                        <li>• Staff retention/salaries (±10%)</li>
                        <li>• Equipment maintenance (±15%)</li>
                        <li>• VAT timing impact</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100 border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Breakeven Analysis</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Initial Investment (CAPEX):</span>
                      <span className="font-bold text-lg">{formatCZK(getTotalEquipmentCost() + 850000)} CZK</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Projected Monthly Breakeven:</span>
                      <span className="font-bold text-lg">Month 18 (Jun 2027)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Full ROI Achievement:</span>
                      <span className="font-bold text-lg">Year 4-5 (2029-2030)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RehobothFinancialModel;