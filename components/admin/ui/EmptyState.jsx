import { FileQuestion } from 'lucide-react';

export default function EmptyState({ icon: Icon = FileQuestion, title, message, action }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="w-8 h-8 text-gray-400" aria-hidden="true" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          {message && <p className="text-sm text-gray-600">{message}</p>}
        </div>

        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}

