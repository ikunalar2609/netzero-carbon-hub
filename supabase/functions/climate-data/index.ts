const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type } = await req.json();

    if (type === 'global_temperature') {
      // Fetch ERA5-like global temperature data from Open-Meteo Climate API
      // Multiple coordinates to approximate global mean
      const locations = [
        { lat: 0, lon: 0 },
        { lat: 45, lon: -90 },
        { lat: 50, lon: 10 },
        { lat: 30, lon: 100 },
        { lat: -20, lon: 25 },
        { lat: -35, lon: 150 },
        { lat: -10, lon: -60 },
        { lat: 65, lon: 30 },
      ];

      const promises = locations.map(loc =>
        fetch(`https://climate-api.open-meteo.com/v1/climate?latitude=${loc.lat}&longitude=${loc.lon}&start_date=1940-01-01&end_date=2025-12-31&models=EC_Earth3P_HR&daily=temperature_2m_mean`)
          .then(r => r.json())
          .catch(() => null)
      );

      const results = await Promise.all(promises);
      
      // Process daily data into monthly averages for the long-term chart
      const monthlyData: Record<string, number[]> = {};
      const yearlyData: Record<number, number[]> = {};
      
      for (const result of results) {
        if (!result?.daily?.time || !result?.daily?.temperature_2m_mean) continue;
        const times: string[] = result.daily.time;
        const temps: (number | null)[] = result.daily.temperature_2m_mean;
        
        for (let i = 0; i < times.length; i++) {
          if (temps[i] === null) continue;
          const yearMonth = times[i].substring(0, 7); // "YYYY-MM"
          const year = parseInt(times[i].substring(0, 4));
          
          if (!monthlyData[yearMonth]) monthlyData[yearMonth] = [];
          monthlyData[yearMonth].push(temps[i]!);
          
          if (!yearlyData[year]) yearlyData[year] = [];
          yearlyData[year].push(temps[i]!);
        }
      }

      // Calculate baseline (1961-1990)
      const baselineTemps: number[] = [];
      for (const [ym, temps] of Object.entries(monthlyData)) {
        const yr = parseInt(ym.substring(0, 4));
        if (yr >= 1961 && yr <= 1990) {
          baselineTemps.push(...temps);
        }
      }
      const baselineAvg = baselineTemps.length > 0
        ? baselineTemps.reduce((a, b) => a + b, 0) / baselineTemps.length
        : 14.0;

      // Monthly anomaly data for the main chart
      const monthlyAnomalies = Object.entries(monthlyData)
        .map(([ym, temps]) => {
          const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
          return {
            date: ym,
            anomaly: parseFloat((avg - baselineAvg).toFixed(3)),
            absolute: parseFloat(avg.toFixed(2)),
          };
        })
        .sort((a, b) => a.date.localeCompare(b.date));

      // Yearly anomaly data
      const yearlyAnomalies = Object.entries(yearlyData)
        .map(([year, temps]) => {
          const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
          return {
            year: parseInt(year),
            anomaly: parseFloat((avg - baselineAvg).toFixed(3)),
            absolute: parseFloat(avg.toFixed(2)),
          };
        })
        .sort((a, b) => a.year - b.year);

      return new Response(JSON.stringify({
        success: true,
        monthly: monthlyAnomalies,
        yearly: yearlyAnomalies,
        baseline: "1961-1990",
        baselineAvg: parseFloat(baselineAvg.toFixed(2)),
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (type === 'continental_stats') {
      const regions = [
        { name: "Africa", lat: 5, lon: 25 },
        { name: "Asia", lat: 35, lon: 100 },
        { name: "Europe", lat: 50, lon: 15 },
        { name: "N. America", lat: 40, lon: -95 },
        { name: "S. America", lat: -15, lon: -55 },
        { name: "Oceania", lat: -25, lon: 135 },
        { name: "Antarctica", lat: -75, lon: 0 },
      ];

      const promises = regions.map(r =>
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${r.lat}&longitude=${r.lon}&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&past_days=30`)
          .then(res => res.json())
          .then(data => ({
            region: r.name,
            mean: data.current?.temperature_2m ?? null,
            min: data.daily?.temperature_2m_min ? Math.min(...data.daily.temperature_2m_min.filter((v: number | null) => v !== null)) : null,
            max: data.daily?.temperature_2m_max ? Math.max(...data.daily.temperature_2m_max.filter((v: number | null) => v !== null)) : null,
          }))
          .catch(() => ({ region: r.name, mean: null, min: null, max: null }))
      );

      const stats = await Promise.all(promises);

      return new Response(JSON.stringify({
        success: true,
        data: stats,
        updated: new Date().toISOString(),
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid type. Use: global_temperature, continental_stats' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Climate data error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
