import React from 'react';
import { Code2, ExternalLink, Instagram, Linkedin, PanelsTopLeft, UsersRound } from 'lucide-react';

const developers = [
  {
    name: 'Tharsith R.',
    initials: 'TR',
    role: 'App Developer',
    department: 'CSE – N Batch',
    registration: '2026103054',
    RoleIcon: Code2,
    links: [
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/tharsith-r-b0702a372',
        Icon: Linkedin,
      },
    ],
  },
  {
    name: 'Raghu Nandan . S',
    initials: 'RN',
    role: 'UI/UX Designer',
    department: 'EE – VLSI',
    registration: '2026123013',
    RoleIcon: PanelsTopLeft,
    links: [
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/the.creato.lab?vrfl=MXhxYWNlcG05bjI3eg==',
        Icon: Instagram,
      },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/raghu-nandan-sudhakar-15b85b381',
        Icon: Linkedin,
      },
    ],
  },
] as const;

export const CreditsScreen: React.FC = () => (
  <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12" aria-labelledby="credits-heading">
    <header className="mb-8 border-b border-slate-200 pb-6 sm:mb-10 sm:pb-8">
      <div className="flex items-center gap-3 text-[#172554]">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172554] text-white">
          <UsersRound className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h1 id="credits-heading" className="text-2xl font-black tracking-tight text-[#172554] sm:text-3xl">Meet the Team</h1>
          <p className="mt-1 text-sm text-slate-600">The people behind the app.</p>
        </div>
      </div>
    </header>

    <section className="grid gap-5 md:grid-cols-2" aria-label="Developer profiles">
      {developers.map(({ name, initials, role, department, registration, RoleIcon, links }) => (
        <article key={name} className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start gap-4">
            <div aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#172554] text-lg font-black tracking-wide text-white sm:h-[4.5rem] sm:w-[4.5rem]">
              {initials}
            </div>
            <div className="min-w-0 pt-1">
              <h2 className="break-words text-lg font-black leading-snug text-[#172554] sm:text-xl">{name}</h2>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-slate-700">
                <RoleIcon className="h-4 w-4 shrink-0 text-[#1e3a8a]" aria-hidden="true" />{role}
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-3 border-t border-slate-200 pt-5 text-sm sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Department</dt>
              <dd className="mt-1 break-words font-semibold text-slate-800">{department}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Registration No.</dt>
              <dd className="mt-1 break-words font-semibold tabular-nums text-slate-800">{registration}</dd>
            </div>
          </dl>

          <nav aria-label={`${name} social profiles`} className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 pt-5">
            {links.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} on ${label} (opens in a new tab)`}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-[#172554] transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554]"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{label}</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              </a>
            ))}
          </nav>
        </article>
      ))}
    </section>

    <footer className="mt-8 border-t border-slate-200 pt-5 text-center text-sm text-slate-600 sm:mt-10">
      Designed and developed with care.
    </footer>
  </section>
);
