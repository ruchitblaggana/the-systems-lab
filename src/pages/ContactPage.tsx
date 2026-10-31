import { useState, useCallback } from 'react';
import { Section, SectionHeader } from '@/components/ui';
import { contactLinks } from '@/data/links';

export function ContactPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied('Copy failed — please copy manually.');
      window.setTimeout(() => setCopied(null), 3000);
    }
  }, []);

  const actions = [
    { key: 'email', label: 'Email', value: contactLinks.email, configured: contactLinks.email !== '#', icon: 'mail' },
    { key: 'linkedin', label: 'LinkedIn', value: contactLinks.linkedin, configured: contactLinks.linkedin !== '#', icon: 'linkedin' },
    { key: 'github', label: 'GitHub', value: contactLinks.github, configured: contactLinks.github !== '#', icon: 'github' },
    { key: 'resume', label: 'Resume', value: contactLinks.resume, configured: contactLinks.resume !== '#', icon: 'file' },
    { key: 'other', label: 'Other', value: contactLinks.other, configured: contactLinks.other !== '#', icon: 'link' },
  ] as const;

  return (
    <div>
      <Section className="pt-10 sm:pt-14 pb-10">
        <SectionHeader idx="01 / Contact" title="Have a problem worth exploring?" sub="Interested in a project, a technical discussion, or a collaboration? Choose a way to connect." />
      </Section>

      <Section className="py-8 border-t border-divider">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-divider border border-divider">
          {actions.map((a) => {
            if (!a.configured) {
              return (
                <div key={a.key} className="bg-canvas p-6">
                  <div className="eyebrow mb-2">{a.label}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm ink2 italic">Link to be added</span>
                    <span className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-divider ink2">pending</span>
                  </div>
                </div>
              );
            }
            const isEmail = a.key === 'email';
            const href = isEmail ? `mailto:${a.value}?subject=The%20Systems%20Lab%20—%20Project%20Inquiry&body=Hi%20Ruchit%2C%0A%0A` : a.value;
            const external = !isEmail;
            return (
              <div key={a.key} className="bg-canvas p-6">
                <div className="eyebrow mb-2">{a.label}</div>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="text-sm font-medium hover:text-lime break-all"
                  >
                    {a.value}
                  </a>
                  <button
                    onClick={() => copyToClipboard(a.value, a.label)}
                    className="mono text-[10px] uppercase tracking-wider px-2 py-1 border border-divider hover:border-lime shrink-0"
                    aria-label={`Copy ${a.label} to clipboard`}
                  >
                    Copy
                  </button>
                </div>
                {copied === a.label && (
                  <div className="mono text-[10px] text-lime mt-2 fade-in" role="status">Copied to clipboard.</div>
                )}
              </div>
            );
          })}
        </div>

        {copied && !actions.some((a) => a.label === copied) && (
          <div className="mono text-[10px] text-orange mt-3 fade-in" role="status">{copied}</div>
        )}
      </Section>

      {/* Local draft note */}
      <Section className="py-8 border-t border-divider">
        <div className="border border-divider bg-panel p-5">
          <div className="eyebrow mb-2">Contact preferences</div>
          <p className="text-sm ink2 leading-relaxed">
            This page does not include a message-sending form. To reach out, use one of the configured channels above — email is the most reliable. Unconfigured links will be added when available.
          </p>
          <p className="mono text-[10px] ink2 mt-3">
            No backend, no accounts, no data collection. Your preferences and notes stay in your browser.
          </p>
        </div>
      </Section>
    </div>
  );
}
