interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  tags: string[];
}

interface ToolCardProps {
  tool: Tool;
  onSelect: () => void;
  isSelected: boolean;
}

export default function ToolCard({ tool, onSelect, isSelected }: ToolCardProps) {
  return (
    <div
      className={`p-6 rounded-xl border cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{tool.icon}</span>
        <div>
          <h3 className="font-semibold text-gray-900">{tool.name}</h3>
          <p className="text-sm text-gray-500">{tool.category}</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
      
      <div className="flex flex-wrap gap-1">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}