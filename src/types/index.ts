export interface MindTrace {
  id: string;
  problem: string;
  steps: string[];
  tags: string[];
  createdAt: string;
}

export interface CreateTraceInput {
  problem: string;
  steps: string[];
  tags: string[];
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
