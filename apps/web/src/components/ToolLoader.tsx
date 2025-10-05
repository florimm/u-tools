import { lazy, Suspense } from 'react';

interface ToolLoaderProps {
  toolId: string;
}

// This will be dynamically loaded based on the tool manifest system
const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  'converters.unit': lazy(() => import('../tools/converters.unit/frontend')),
  'network.ping': lazy(() => import('../tools/network.ping/frontend')),
};

export default function ToolLoader({ toolId }: ToolLoaderProps) {
  const ToolComponent = toolComponents[toolId];

  if (!ToolComponent) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Tool "{toolId}" not found or not implemented yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <ToolComponent />
      </Suspense>
    </div>
  );
}