/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PartIdentification {
  partName: string;
  confidence: number;
  matchType: 'Exact Match' | 'Likely Match' | 'Possible Match' | 'Uncertain Match';
  description: string;
  possibleUses: string[];
  technicalSpecifications: {
    material: string;
    dimensions: string;
    temperatureRange: string;
    [key: string]: string;
  };
  reasoning: string;
  maintenanceTips: string[];
}

export interface ScanResult extends PartIdentification {
  id: string;
  imageUrl: string;
  timestamp: number;
  isFavorite?: boolean;
  feedback?: {
    helpful: boolean;
    message?: string;
  };
}

export interface HistoryFilter {
  confidenceThreshold?: number;
  material?: string;
  query?: string;
}
