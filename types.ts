
export interface DriftEntry {
  id: string;
  timestamp: number;
  input: string;
  summary: string;
}

export interface SummarySections {
  summary: string;
  affectedSystems: string[];
  driftDetails: string[];
  risks: string[];
  recommendedActions: string[];
  dataGaps: string[];
  isHighPriority: boolean;
}
