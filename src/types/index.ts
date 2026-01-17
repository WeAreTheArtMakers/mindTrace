export interface MindTrace {
  id: string;
  problem: string;
  steps: string[];
  tags: string[];
  localeHint?: string; // Original language of the trace (e.g., 'tr', 'en')
  createdAt: string;
}

export interface CreateTraceInput {
  problem: string;
  steps: string[];
  tags: string[];
  localeHint?: string; // Original language of the trace
}

export interface SearchParams {
  query?: string;
  tag?: string;
  page?: number;
}

export interface TraceTranslation {
  traceId: string;
  lang: string;
  problem: string;
  steps: string[];
  tags: string[];
  createdAt: string;
}

export interface TranslatedTrace extends MindTrace {
  translatedProblem?: string;
  translatedSteps?: string[];
  translatedTags?: string[];
  isTranslated?: boolean;
}
