import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Performance över tid
export const PerformanceChart: React.FC = () => {
  const data = [
    { månad: 'Jan', poäng: 12, mål: 8, assists: 4 },
    { månad: 'Feb', poäng: 18, mål: 12, assists: 6 },
    { månad: 'Mar', poäng: 22, mål: 14, assists: 8 },
    { månad: 'Apr', poäng: 28, mål: 16, assists: 12 },
    { månad: 'Maj', poäng: 25, mål: 15, assists: 10 },
    { månad: 'Jun', poäng: 32, mål: 18, assists: 14 }
  ];

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
        📈 Prestation över tid
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis 
            dataKey="månad" 
            stroke="var(--text-secondary)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--text-secondary)"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-primary)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="poäng" 
            stroke="#22c55e" 
            strokeWidth={3}
            dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="mål" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="assists" 
            stroke="#f59e0b" 
            strokeWidth={2}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Målfördelning per position
export const GoalDistributionChart: React.FC = () => {
  const data = [
    { position: 'Center', mål: 45, color: '#22c55e' },
    { position: 'Vänsterforward', mål: 32, color: '#3b82f6' },
    { position: 'Högerforward', mål: 28, color: '#f59e0b' },
    { position: 'Back', mål: 12, color: '#ef4444' },
    { position: 'Målvakt', mål: 1, color: '#8b5cf6' }
  ];

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
        🥅 Målfördelning per position
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ position, mål, percent }: any) => 
              `${position}: ${mål} (${(percent * 100).toFixed(0)}%)`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="mål"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-primary)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Matchstatistik
export const MatchStatsChart: React.FC = () => {
  const data = [
    { match: 'vs AIK', hemma: 4, borta: 2, våraSkott: 28, deras: 18 },
    { match: 'vs Hammarby', hemma: 2, borta: 3, våraSkott: 22, deras: 25 },
    { match: 'vs Djurgården', hemma: 3, borta: 1, våraSkott: 31, deras: 16 },
    { match: 'vs IFK', hemma: 1, borta: 1, våraSkott: 19, deras: 21 },
    { match: 'vs Malmö', hemma: 5, borta: 0, våraSkott: 35, deras: 12 }
  ];

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
        🏒 Senaste matcherna
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis 
            dataKey="match" 
            stroke="var(--text-secondary)"
            fontSize={10}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="var(--text-secondary)"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-primary)'
            }}
          />
          <Bar dataKey="hemma" fill="#22c55e" name="Våra mål" />
          <Bar dataKey="borta" fill="#ef4444" name="Deras mål" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Spelarprofil radar
export const PlayerRadarChart: React.FC<{playerName: string}> = ({ playerName }) => {
  const data = [
    { skill: 'Skott', A: 85, fullMark: 100 },
    { skill: 'Passning', A: 92, fullMark: 100 },
    { skill: 'Teknik', A: 78, fullMark: 100 },
    { skill: 'Kondition', A: 88, fullMark: 100 },
    { skill: 'Försvar', A: 72, fullMark: 100 },
    { skill: 'Ledarskap', A: 90, fullMark: 100 }
  ];

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
        🎯 {playerName} - Färdighetsprofil
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="var(--border-color)" />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            domain={[0, 100]} 
            tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
          />
          <Radar
            name={playerName}
            dataKey="A"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-primary)'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Team progression över säsong
export const SeasonProgressChart: React.FC = () => {
  const data = [
    { vecka: 'V1', poäng: 0, tabelläge: 8 },
    { vecka: 'V3', poäng: 4, tabelläge: 6 },
    { vecka: 'V5', poäng: 9, tabelläge: 4 },
    { vecka: 'V7', poäng: 12, tabelläge: 3 },
    { vecka: 'V9', poäng: 18, tabelläge: 2 },
    { vecka: 'V11', poäng: 22, tabelläge: 2 },
    { vecka: 'V13', poäng: 28, tabelläge: 1 }
  ];

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
        🏆 Säsongsutveckling
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis 
            dataKey="vecka" 
            stroke="var(--text-secondary)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--text-secondary)"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-primary)'
            }}
          />
          <Area
            type="monotone"
            dataKey="poäng"
            stroke="#22c55e"
            fill="url(#colorPoäng)"
            strokeWidth={3}
          />
          <defs>
            <linearGradient id="colorPoäng" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
