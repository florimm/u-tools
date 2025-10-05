import { useState } from 'react';
import ToolCard from '../components/ToolCard';
import ToolLoader from '../components/ToolLoader';
import { AVAILABLE_TOOLS } from '../tools/index';

export default function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onSelect={() => setSelectedTool(tool.id)}
              isSelected={selectedTool === tool.id}
            />
          ))}
        </div>
      </div>

      {selectedTool && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              {AVAILABLE_TOOLS.find(t => t.id === selectedTool)?.name}
            </h3>
            <button
              onClick={() => setSelectedTool(null)}
              className="btn-secondary"
            >
              Close
            </button>
          </div>
          <ToolLoader toolId={selectedTool} />
        </div>
      )}
    </div>
  );
}