import Link from 'next/link';
import TemplateCard from '@/components/TemplateCard';

const templates = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design',
    config: {
      background: { type: 'color' as const, value: '#ffffff' },
      primaryColor: '#6366f1',
      textColor: '#1f2937',
      buttonStyle: 'pill' as const,
      font: 'Inter',
    },
    preview: {
      bg: 'bg-white',
      accent: 'bg-indigo-500',
      text: 'text-gray-800',
    }
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Vibrant gradient background',
    config: {
      background: { type: 'gradient' as const, value: '', gradient: { from: '#667eea', to: '#764ba2', direction: '135deg' } },
      primaryColor: '#ffffff',
      textColor: '#ffffff',
      buttonStyle: 'pill' as const,
      font: 'Poppins',
    },
    preview: {
      bg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      accent: 'bg-white/30',
      text: 'text-white',
    }
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Sleek dark aesthetic',
    config: {
      background: { type: 'color' as const, value: '#0f172a' },
      primaryColor: '#818cf8',
      textColor: '#e2e8f0',
      buttonStyle: 'rounded' as const,
      font: 'Inter',
    },
    preview: {
      bg: 'bg-slate-900',
      accent: 'bg-indigo-400',
      text: 'text-slate-200',
    }
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Fresh green tones',
    config: {
      background: { type: 'gradient' as const, value: '', gradient: { from: '#134e5e', to: '#71b280', direction: '135deg' } },
      primaryColor: '#ffffff',
      textColor: '#ffffff',
      buttonStyle: 'pill' as const,
      font: 'Poppins',
    },
    preview: {
      bg: 'bg-gradient-to-br from-teal-800 to-green-500',
      accent: 'bg-white/30',
      text: 'text-white',
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm sunset colors',
    config: {
      background: { type: 'gradient' as const, value: '', gradient: { from: '#f7971e', to: '#ffd200', direction: '135deg' } },
      primaryColor: '#7c3aed',
      textColor: '#1f2937',
      buttonStyle: 'pill' as const,
      font: 'Poppins',
    },
    preview: {
      bg: 'bg-gradient-to-br from-orange-400 to-yellow-300',
      accent: 'bg-purple-600',
      text: 'text-gray-800',
    }
  },
  {
    id: 'rose',
    name: 'Rose',
    description: 'Elegant rose aesthetic',
    config: {
      background: { type: 'gradient' as const, value: '', gradient: { from: '#f43f5e', to: '#ec4899', direction: '135deg' } },
      primaryColor: '#ffffff',
      textColor: '#ffffff',
      buttonStyle: 'pill' as const,
      font: 'Playfair Display',
    },
    preview: {
      bg: 'bg-gradient-to-br from-rose-500 to-pink-500',
      accent: 'bg-white/30',
      text: 'text-white',
    }
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-200 dark:bg-indigo-900 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-indigo-700 dark:text-indigo-300 text-sm font-medium">Free to use · No account needed</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Links,
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">One Beautiful Page</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create a stunning link-in-bio page in minutes. Customize everything, add music, and share with the world. No sign-up required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/edit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Create Your Page →
            </Link>
            <a
              href="#templates"
              className="border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              Browse Templates
            </a>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Free forever
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No expiry
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Music support
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Beautiful Templates
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Choose a template or start from scratch. Customize everything to match your style.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
          
          <div className="text-center">
            <Link
              href="/edit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Start with Blank Canvas
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Powerful features to make your link page stand out.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🎨', title: 'Full Customization', desc: 'Change backgrounds, colors, fonts, and button styles to match your brand.' },
              { icon: '🎵', title: 'Music Player', desc: 'Add background music with autoplay support and a beautiful mini player UI.' },
              { icon: '📱', title: 'Mobile First', desc: 'Your page looks stunning on every device, from phones to desktops.' },
              { icon: '🔗', title: 'Permanent Links', desc: 'Your generated link never expires. Share it anywhere, forever.' },
              { icon: '↕️', title: 'Drag & Drop', desc: 'Easily reorder your links with intuitive drag-and-drop functionality.' },
              { icon: '📊', title: 'Analytics', desc: 'Track how many people visit your page with built-in view counting.' },
            ].map((feature) => (
              <div key={feature.title} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Page?
          </h2>
          <p className="text-indigo-100 text-lg mb-10">
            Create your beautiful link page in under 5 minutes. No account needed.
          </p>
          <Link
            href="/edit"
            className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md" />
            <span className="font-semibold text-gray-900 dark:text-white">LinkTree</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © 2024 LinkTree. Create beautiful link pages.
          </p>
        </div>
      </footer>
    </div>
  );
}
