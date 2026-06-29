import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  {
    id:       'welcome',
    title:    'Welcome to SkilVaTech! 🎉',
    subtitle: 'Let\'s get you up and running in 3 quick steps.',
    icon:     '🚀',
    actions:  null,
  },
  {
    id:       'explore',
    title:    'Explore the platform',
    subtitle: 'Here\'s what you can do with SkilVaTech.',
    icon:     '🗺',
    features: [
      { icon: '🏢', label: 'CRM',      desc: 'Manage clients, leads, projects and support tickets.' },
      { icon: '📚', label: 'Learning', desc: 'Create courses, manage lessons and track enrollments.' },
      { icon: '⚙️', label: 'Services', desc: 'List your services with categories and pricing.' },
      { icon: '📊', label: 'Analytics',desc: 'Track activity and export reports as CSV.' },
    ],
  },
  {
    id:       'start',
    title:    'Where do you want to start?',
    subtitle: 'Pick the area most relevant to you right now.',
    icon:     '🎯',
    shortcuts: [
      { label: 'Add my first client',  href: '/dashboard/clients',  icon: '🏢', desc: 'Start building your client base' },
      { label: 'Create a course',      href: '/dashboard/courses',  icon: '📚', desc: 'Build and publish learning content' },
      { label: 'Add a service',        href: '/dashboard/services', icon: '⚙️', desc: 'List what your business offers' },
      { label: 'Just explore',         href: '/dashboard',          icon: '👀', desc: 'I\'ll look around first' },
    ],
  },
];

const OnboardingModal = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;
  const isFirst = step === 0;

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else onComplete();
  };

  const handleShortcut = (href) => {
    onComplete();
    navigate(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-[#00d4d4] transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {STEPS.map((_, i) => (
              <div key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'bg-[#00d4d4] flex-1' : i < step ? 'bg-[#00d4d4]/40 w-6' : 'bg-gray-200 w-6'
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="text-5xl mb-4">{current.icon}</div>

          {/* Title + subtitle */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{current.title}</h2>
          <p className="text-gray-500 mb-6">{current.subtitle}</p>

          {/* Step content */}
          {current.features && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {current.features.map((f) => (
                <div key={f.label} className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <span className="text-2xl block mb-2">{f.icon}</span>
                  <p className="font-semibold text-gray-900 text-sm">{f.label}</p>
                  <p className="text-gray-500 text-xs mt-1">{f.desc}</p>
                </div>
              ))}
            </div>
          )}

          {current.shortcuts && (
            <div className="space-y-2 mb-6">
              {current.shortcuts.map((s) => (
                <button key={s.label} onClick={() => handleShortcut(s.href)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-200
                             hover:border-[#00d4d4]/40 hover:bg-[#00d4d4]/5 transition-all text-left group">
                  <span className="text-2xl flex-shrink-0">{s.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-[#00b3b3] transition-colors">
                      {s.label}
                    </p>
                    <p className="text-gray-400 text-xs">{s.desc}</p>
                  </div>
                  <span className="ml-auto text-gray-300 group-hover:text-[#00d4d4] transition-colors">→</span>
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button onClick={onComplete}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Skip tour
            </button>
            <div className="flex gap-3">
              {!isFirst && (
                <button onClick={() => setStep((s) => s - 1)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium
                             hover:bg-gray-50 transition-all">
                  Back
                </button>
              )}
              {!isLast && (
                <button onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-[#00d4d4] hover:bg-[#00b3b3] text-white text-sm font-semibold transition-all">
                  {step === 0 ? "Let's go →" : 'Next →'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Onboarding wrapper — shows modal only on first login ──────────────────────
// Usage: wrap your dashboard page or layout with this.
// It checks localStorage for a 'onboarding_complete' flag.
export const withOnboarding = (Component) => {
  return (props) => {
    const [showOnboarding, setShowOnboarding] = useState(
      () => !localStorage.getItem('skilvatech_onboarding_done')
    );

    const handleComplete = () => {
      localStorage.setItem('skilvatech_onboarding_done', 'true');
      setShowOnboarding(false);
    };

    return (
      <>
        {showOnboarding && <OnboardingModal onComplete={handleComplete} />}
        <Component {...props} />
      </>
    );
  };
};

export default OnboardingModal;