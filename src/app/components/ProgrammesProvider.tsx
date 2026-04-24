'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CohortOption, LocationOption, ProgramDetail } from '../lib/programs';

type ProgrammeSchedule = {
  days: string;
  time: string;
  note: string;
};

type ProgrammesData = {
  programs: ProgramDetail[];
  locations: LocationOption[];
  cohorts: CohortOption[];
  schedule: ProgrammeSchedule;
};

type ProgrammesContextValue = {
  data: ProgrammesData;
  isLoading: boolean;
  error: string | null;
  source: 'db' | null;
  refresh: () => Promise<void>;
};

const emptyData: ProgrammesData = {
  programs: [],
  locations: [],
  cohorts: [],
  schedule: {
    days: '',
    time: '',
    note: '',
  },
};

const ProgrammesContext = createContext<ProgrammesContextValue | null>(null);

export function ProgrammesProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProgrammesData>(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'db' | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/programmes', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || 'Unable to load programmes');
      }
      if (result?.data) {
        setData(result.data);
        setSource('db');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load programmes');
      setData(emptyData);
      setSource(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const value = useMemo(
    () => ({
      data,
      isLoading,
      error,
      source,
      refresh: load,
    }),
    [data, isLoading, error, source]
  );

  return <ProgrammesContext.Provider value={value}>{children}</ProgrammesContext.Provider>;
}

export function useProgrammesData() {
  const context = useContext(ProgrammesContext);
  if (!context) {
    throw new Error('useProgrammesData must be used within ProgrammesProvider');
  }
  return context;
}
