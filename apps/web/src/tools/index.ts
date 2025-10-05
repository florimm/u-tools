// Tool registration system - simplified version for initial setup

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  tags: string[];
}

export const AVAILABLE_TOOLS: Tool[] = [
  {
    id: 'converters.unit',
    name: 'Unit Converter',
    category: 'Converters',
    description: 'Convert between different units of measurement',
    icon: '📏',
    tags: ['convert', 'units', 'measurement']
  },
  {
    id: 'network.ping',
    name: 'Network Ping',
    category: 'Network',
    description: 'Test network connectivity and latency',
    icon: '🌐',
    tags: ['network', 'ping', 'latency']
  }
];