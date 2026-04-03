'use client';

import React from 'react';
import { NetworkGraph } from './NetworkGraph';
import { OpportunitiesPanel } from './OpportunitiesPanel';

export const SynapseNetwork: React.FC = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-8">
      {/* NetworkGraph - Left */}
      <div className="flex-1">
        <NetworkGraph />
      </div>

      {/* OpportunitiesPanel - Right */}
      <div className="flex-1 lg:flex-shrink-0 lg:w-96">
        <OpportunitiesPanel />
      </div>
    </div>
  );
};