'use client';

import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  description: string;
  config: any;
  preview: {
    bg: string;
    accent: string;
    text: string;
  };
}

export default function TemplateCard({ template }: { template: Template }) {
  const href = `/edit?template=${template.id}`;
  
  return (
    <Link href={href} className="group block">
      <div className="relative rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-indigo-400 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        {/* Preview */}
        <div className={`${template.preview.bg} p-4 h-44 flex flex-col items-center gap-2`}>
          {/* Profile circle */}
          <div className={`w-10 h-10 rounded-full ${template.preview.accent} border-2 border-white/50 mt-2`} />
          {/* Title bar */}
          <div className={`w-16 h-2 rounded-full ${template.preview.accent} opacity-80`} />
          {/* Link buttons */}
          {([90, 70, 50] as const).map((opacity, i) => (
            <div key={i} className={`w-full h-6 rounded-full ${template.preview.accent}`} style={{ opacity: opacity / 100 }} />
          ))}
        </div>
        
        {/* Label */}
        <div className="bg-white dark:bg-gray-800 p-3 text-center">
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{template.name}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{template.description}</p>
        </div>
      </div>
    </Link>
  );
}
