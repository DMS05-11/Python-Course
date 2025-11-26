export enum ResourceType {
  WHITE_PAPER = 'White Papers',
  HANDS_ON = 'Hands-on Experiments',
  VIDEO_LECTURE = 'Video Lectures',
  NOTES = 'Advanced Notes',
  REAL_TIME_PROJECT = 'Real-time Projects'
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
  searchEntryPoint?: {
    renderedContent: string;
  };
}

export interface SearchResult {
  text: string;
  groundingMetadata?: GroundingMetadata;
  category: ResourceType;
  query: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  groundingMetadata?: GroundingMetadata;
  category?: ResourceType;
}