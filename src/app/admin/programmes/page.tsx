
'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  Loader2,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
  GripVertical,
  RotateCcw,
} from 'lucide-react';
import { AdminGate } from '../components/AdminGate';
import { useAdminAuth } from '../components/AdminAuthProvider';
import { formatNaira } from '../lib/format';

type LocationOption = {
  id: string;
  code: string;
  label: string;
  mode: string;
  description: string;
  perks: string[];
  isActive: boolean;
};

type CohortOption = {
  id: string;
  code: string;
  label: string;
  window: string;
  note: string;
  isActive: boolean;
};

type ScheduleData = {
  id: string;
  days: string;
  time: string;
  note: string;
};

type ProgramData = {
  id: string;
  slug: string;
  title: string;
  school: string;
  summary: string;
  overview: string;
  duration: string;
  schedule: string;
  onsiteTuition: number;
  onlineTuition: number;
  highlights: string[];
  outcomes: string[];
  projects: { title: string; description: string }[];
  assessment: string[];
  tools: string[];
  roles: string[];
  curriculum: { label: string; topics: string[] }[];
  graduationStandard: string;
  heroImage: string;
};

type SchoolSummary = {
  name: string;
  totalPrograms: number;
  programs: string[];
};

type ProgrammesData = {
  locations: LocationOption[];
  cohorts: CohortOption[];
  schedule: ScheduleData | null;
  programs: ProgramData[];
  schools: SchoolSummary[];
};

const tabs = [
  { id: 'locations', label: 'Locations' },
  { id: 'cohorts', label: 'Cohorts' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'programs', label: 'Programs' },
  { id: 'schools', label: 'Schools' },
];

const PROGRAM_DRAFT_KEY = '720d_programme_draft';

const emptyProgramForm = {
  id: '',
  slug: '',
  title: '',
  school: 'Engineering',
  summary: '',
  overview: '',
  duration: '',
  schedule: '',
  onsiteTuition: 0,
  onlineTuition: 0,
  highlights: '',
  outcomes: '',
  projects: '',
  assessment: '',
  tools: '',
  roles: '',
  curriculum: '',
  graduationStandard: '',
  heroImage: '',
};

function listToText(items: string[]) {
  return items.join('\n');
}

function textToList(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function projectsToText(projects: { title: string; description: string }[]) {
  return projects
    .map((project) => `${project.title}${project.description ? ` | ${project.description}` : ''}`)
    .join('\n');
}

function textToProjects(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split('|');
      return {
        title: title.trim(),
        description: rest.join('|').trim(),
      };
    })
    .filter((item) => item.title);
}

function curriculumToText(curriculum: { label: string; topics: string[] }[]) {
  return curriculum
    .map((block) => {
      const lines = [block.label, ...block.topics.map((topic) => `- ${topic}`)];
      return lines.join('\n');
    })
    .join('\n\n');
}

function textToCurriculum(value: string) {
  const blocks = value
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const lines = block
        .split('\n')
        .map((line) => line.replace(/^-+\s*/, '').trim())
        .filter(Boolean);
      if (!lines.length) return null;
      const [label, ...topics] = lines;
      return { label, topics };
    })
    .filter(Boolean) as { label: string; topics: string[] }[];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function getDraftKey(id?: string) {
  return id ? `${PROGRAM_DRAFT_KEY}_${id}` : `${PROGRAM_DRAFT_KEY}_new`;
}

export default function ProgrammesPage() {
  const { token, status, profile } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('locations');
  const [data, setData] = useState<ProgrammesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>({});
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [draggingProjectIndex, setDraggingProjectIndex] = useState<number | null>(null);
  const [draggingCurriculumIndex, setDraggingCurriculumIndex] = useState<number | null>(null);
  const [draggingTopic, setDraggingTopic] = useState<{ blockIndex: number; topicIndex: number } | null>(null);

  const canEdit = profile?.role !== 'viewer';

  const [locationForm, setLocationForm] = useState({
    id: '',
    code: '',
    label: '',
    mode: 'onsite',
    description: '',
    perks: '',
    isActive: true,
  });

  const [cohortForm, setCohortForm] = useState({
    id: '',
    code: '',
    label: '',
    window: '',
    note: '',
    isActive: true,
  });

  const [programForm, setProgramForm] = useState({ ...emptyProgramForm });
  const [baselineProgramForm, setBaselineProgramForm] = useState<typeof programForm | null>(null);

  const [scheduleForm, setScheduleForm] = useState({
    days: '',
    time: '',
    note: '',
  });

  useEffect(() => {
    if (!data?.schedule) return;
    setScheduleForm({
      days: data.schedule.days || '',
      time: data.schedule.time || '',
      note: data.schedule.note || '',
    });
  }, [data?.schedule]);

  const schools = useMemo(() => data?.schools ?? [], [data]);
  const projectItems = useMemo(
    () => textToProjects(programForm.projects),
    [programForm.projects]
  );
  const curriculumBlocks = useMemo(
    () => textToCurriculum(programForm.curriculum),
    [programForm.curriculum]
  );
  const draftKey = useMemo(() => getDraftKey(programForm.id || undefined), [programForm.id]);

  const resetLocationForm = () =>
    setLocationForm({
      id: '',
      code: '',
      label: '',
      mode: 'onsite',
      description: '',
      perks: '',
      isActive: true,
    });

  const resetCohortForm = () =>
    setCohortForm({
      id: '',
      code: '',
      label: '',
      window: '',
      note: '',
      isActive: true,
    });

  const resetProgramForm = () =>
    setProgramForm({ ...emptyProgramForm });

  const openProgramModal = (program?: ProgramData) => {
    setError(null);
    setSectionErrors({});
    if (program) {
      const nextForm = {
        id: program.id,
        slug: program.slug,
        title: program.title,
        school: program.school,
        summary: program.summary,
        overview: program.overview,
        duration: program.duration,
        schedule: program.schedule,
        onsiteTuition: program.onsiteTuition,
        onlineTuition: program.onlineTuition,
        highlights: listToText(program.highlights ?? []),
        outcomes: listToText(program.outcomes ?? []),
        projects: projectsToText(Array.isArray(program.projects) ? program.projects : []),
        assessment: listToText(program.assessment ?? []),
        tools: listToText(program.tools ?? []),
        roles: listToText(program.roles ?? []),
        curriculum: curriculumToText(Array.isArray(program.curriculum) ? program.curriculum : []),
        graduationStandard: program.graduationStandard ?? '',
        heroImage: program.heroImage ?? '',
      };
      setProgramForm(nextForm);
      setBaselineProgramForm(nextForm);
      setSlugTouched(true);
      setDraftStatus('idle');
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem(getDraftKey(program.id));
          if (raw) {
            const parsed = JSON.parse(raw);
            setProgramForm((prev) => ({
              ...prev,
              ...parsed,
              id: program.id,
            }));
            setDraftStatus('saved');
          }
        } catch (err) {
          console.error('Unable to load programme draft:', err);
        }
      }
    } else {
      resetProgramForm();
      setBaselineProgramForm({ ...emptyProgramForm });
      setSlugTouched(false);
      setDraftStatus('idle');
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem(getDraftKey());
          if (raw) {
            const parsed = JSON.parse(raw);
            setProgramForm((prev) => ({
              ...prev,
              ...parsed,
              id: '',
            }));
            setDraftStatus('saved');
          }
        } catch (err) {
          console.error('Unable to load programme draft:', err);
        }
      }
    }
    setIsProgramModalOpen(true);
  };

  const closeProgramModal = () => {
    setIsProgramModalOpen(false);
    setError(null);
    setSectionErrors({});
    setSlugTouched(false);
    setDraftStatus('idle');
    setBaselineProgramForm(null);
  };

  const updateProjects = (
    updater: (projects: { title: string; description: string }[]) => {
      title: string;
      description: string;
    }[]
  ) => {
    setProgramForm((prev) => {
      const current = textToProjects(prev.projects);
      const next = updater(current);
      return { ...prev, projects: projectsToText(next) };
    });
  };

  const updateCurriculumBlocks = (
    updater: (blocks: { label: string; topics: string[] }[]) => {
      label: string;
      topics: string[];
    }[]
  ) => {
    setProgramForm((prev) => {
      const current = textToCurriculum(prev.curriculum);
      const next = updater(current);
      return { ...prev, curriculum: curriculumToText(next) };
    });
  };

  const clearSectionError = (key: string) => {
    setSectionErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const reorderList = <T,>(items: T[], from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) {
      return items;
    }
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  };

  useEffect(() => {
    if (!isProgramModalOpen) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isProgramModalOpen]);

  useEffect(() => {
    if (!isProgramModalOpen) return;
    setDraftStatus('saving');
    const timeout = window.setTimeout(() => {
      try {
        localStorage.setItem(
          draftKey,
          JSON.stringify(programForm)
        );
        setDraftStatus('saved');
      } catch (err) {
        console.error('Unable to save draft:', err);
        setDraftStatus('idle');
      }
    }, 800);
    return () => window.clearTimeout(timeout);
  }, [isProgramModalOpen, programForm, draftKey]);

  const loadProgrammes = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/programmes', {
        headers: { 'x-admin-token': token },
        signal,
        cache: 'no-store',
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to load programmes data');
      }
      setData(result.data);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Unable to load programmes data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== 'authenticated') return;
    const controller = new AbortController();
    void loadProgrammes(controller.signal);
    return () => controller.abort();
  }, [status, token]);

  const saveLocation = async () => {
    if (!canEdit) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        code: locationForm.code,
        label: locationForm.label,
        mode: locationForm.mode,
        description: locationForm.description,
        perks: textToList(locationForm.perks),
        isActive: locationForm.isActive,
      };
      const response = await fetch(
        locationForm.id
          ? `/api/admin/programmes/locations/${locationForm.id}`
          : '/api/admin/programmes/locations',
        {
          method: locationForm.id ? 'PATCH' : 'POST',
          headers: {
            'x-admin-token': token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to save location');
      }
      resetLocationForm();
      await loadProgrammes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save location');
    } finally {
      setSaving(false);
    }
  };

  const deleteLocation = async (id: string) => {
    if (!canEdit) return;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/programmes/locations/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token },
      });
      const result = await response.json().catch(() => ({ ok: true }));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to delete location');
      }
      resetLocationForm();
      await loadProgrammes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete location');
    } finally {
      setSaving(false);
    }
  };

  const saveCohort = async () => {
    if (!canEdit) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        code: cohortForm.code,
        label: cohortForm.label,
        window: cohortForm.window,
        note: cohortForm.note,
        isActive: cohortForm.isActive,
      };
      const response = await fetch(
        cohortForm.id ? `/api/admin/programmes/cohorts/${cohortForm.id}` : '/api/admin/programmes/cohorts',
        {
          method: cohortForm.id ? 'PATCH' : 'POST',
          headers: {
            'x-admin-token': token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to save cohort');
      }
      resetCohortForm();
      await loadProgrammes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save cohort');
    } finally {
      setSaving(false);
    }
  };

  const deleteCohort = async (id: string) => {
    if (!canEdit) return;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/programmes/cohorts/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token },
      });
      const result = await response.json().catch(() => ({ ok: true }));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to delete cohort');
      }
      resetCohortForm();
      await loadProgrammes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete cohort');
    } finally {
      setSaving(false);
    }
  };

  const saveProgram = async () => {
    if (!canEdit) return;
    setSaving(true);
    setError(null);
    try {
      const trimmedSlug = programForm.slug.trim();
      const trimmedTitle = programForm.title.trim();
      const trimmedSchool = programForm.school.trim();
      const trimmedSummary = programForm.summary.trim();
      const trimmedDuration = programForm.duration.trim();
      const trimmedSchedule = programForm.schedule.trim();
      const trimmedHeroImage = programForm.heroImage.trim();
      const trimmedGraduationStandard = programForm.graduationStandard.trim();
      const slugValue = slugify(trimmedSlug || trimmedTitle);
      const nextErrors: Record<string, string> = {};

      if (!slugValue || !trimmedTitle || !trimmedSchool || !trimmedSummary || !trimmedHeroImage) {
        nextErrors.core = 'Slug, title, summary, school, and hero image are required.';
      } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugValue)) {
        nextErrors.core = 'Slug must be lowercase letters, numbers, and hyphens only.';
      }

      if (!trimmedDuration || !trimmedSchedule) {
        nextErrors.schedule = 'Duration and schedule are required.';
      }

      if (!trimmedGraduationStandard) {
        nextErrors.graduation = 'Graduation standard is required.';
      }

      setSectionErrors(nextErrors);
      if (Object.keys(nextErrors).length) {
        setError('Please resolve the highlighted sections.');
        setSaving(false);
        return;
      }

      const payload = {
        slug: slugValue,
        title: trimmedTitle,
        school: trimmedSchool,
        summary: trimmedSummary,
        overview: programForm.overview.trim() || trimmedSummary,
        duration: trimmedDuration,
        schedule: trimmedSchedule,
        onsiteTuition: Number(programForm.onsiteTuition),
        onlineTuition: Number(programForm.onlineTuition),
        highlights: textToList(programForm.highlights),
        outcomes: textToList(programForm.outcomes),
        projects: textToProjects(programForm.projects),
        assessment: textToList(programForm.assessment),
        tools: textToList(programForm.tools),
        roles: textToList(programForm.roles),
        curriculum: textToCurriculum(programForm.curriculum),
        graduationStandard: trimmedGraduationStandard,
        heroImage: trimmedHeroImage,
      };
      const response = await fetch(
        programForm.id ? `/api/admin/programmes/programs/${programForm.id}` : '/api/admin/programmes/programs',
        {
          method: programForm.id ? 'PATCH' : 'POST',
          headers: {
            'x-admin-token': token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to save programme');
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem(draftKey);
        setDraftStatus('idle');
      }
      if (result?.data) {
        setData((prev) => {
          if (!prev) return prev;
          const updatedProgram = result.data;
          const exists = prev.programs.some((item) => item.id === updatedProgram.id);
          return {
            ...prev,
            programs: exists
              ? prev.programs.map((item) => (item.id === updatedProgram.id ? updatedProgram : item))
              : [updatedProgram, ...prev.programs],
          };
        });
      }
      resetProgramForm();
      closeProgramModal();
      await loadProgrammes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save programme');
    } finally {
      setSaving(false);
    }
  };

  const deleteProgram = async (id: string) => {
    if (!canEdit) return;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/programmes/programs/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token },
      });
      const result = await response.json().catch(() => ({ ok: true }));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to delete programme');
      }
      resetProgramForm();
      await loadProgrammes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete programme');
    } finally {
      setSaving(false);
    }
  };

  const saveSchedule = async () => {
    if (!canEdit) return;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/programmes/schedule', {
        method: 'PUT',
        headers: {
          'x-admin-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleForm),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to update schedule');
      }
      await loadProgrammes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update schedule');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminGate>
      <div className="space-y-6 pt-8">
        <section
          className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
          style={{ '--delay': '0ms' } as CSSProperties}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Programme Management</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Control the programme catalogue, delivery schedule, and cohort structure.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadProgrammes()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)]'
                    : 'border border-slate-200 bg-white text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading programme data...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        {data && activeTab === 'locations' ? (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              {data.locations.map((location, index) => (
                <div
                  key={location.id}
                  className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                  style={{ '--delay': `${80 + index * 40}ms` } as CSSProperties}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{location.label}</h3>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {location.mode} - {location.code}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setLocationForm({
                            id: location.id,
                            code: location.code,
                            label: location.label,
                            mode: location.mode,
                            description: location.description,
                            perks: listToText(location.perks),
                            isActive: location.isActive,
                          })
                        }
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10 dark:hover:bg-white/10"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteLocation(location.id)}
                        disabled={!canEdit || saving}
                        className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60 dark:border-rose-500/40 dark:text-rose-200 dark:hover:bg-rose-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{location.description}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-300">
                    {location.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-slate-900 dark:bg-teal-300" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div
              className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
              style={{ '--delay': '140ms' } as CSSProperties}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {locationForm.id ? 'Edit Location' : 'Add Location'}
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <input
                  value={locationForm.code}
                  onChange={(event) =>
                    setLocationForm((prev) => ({ ...prev, code: event.target.value }))
                  }
                  placeholder="Code (e.g. lagos)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2"
                />
                <input
                  value={locationForm.label}
                  onChange={(event) =>
                    setLocationForm((prev) => ({ ...prev, label: event.target.value }))
                  }
                  placeholder="Location label"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2"
                />
                <select
                  value={locationForm.mode}
                  onChange={(event) =>
                    setLocationForm((prev) => ({ ...prev, mode: event.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2"
                >
                  <option value="onsite">Onsite</option>
                  <option value="online">Online</option>
                </select>
                <textarea
                  value={locationForm.description}
                  onChange={(event) =>
                    setLocationForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  placeholder="Location description"
                  className="min-h-[90px] w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2"
                />
                <textarea
                  value={locationForm.perks}
                  onChange={(event) =>
                    setLocationForm((prev) => ({ ...prev, perks: event.target.value }))
                  }
                  placeholder="Perks (comma or new-line separated)"
                  className="min-h-[90px] w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2"
                />
                <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={locationForm.isActive}
                    onChange={(event) =>
                      setLocationForm((prev) => ({ ...prev, isActive: event.target.checked }))
                    }
                  />
                  Active location
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveLocation}
                    disabled={!canEdit || saving}
                    className="admin-glow rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)]"
                  >
                    {saving ? 'Saving...' : 'Save Location'}
                  </button>
                  <button
                    type="button"
                    onClick={resetLocationForm}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 dark:border-white/10"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {data && activeTab === 'cohorts' ? (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              {data.cohorts.map((cohort, index) => (
                <div
                  key={cohort.id}
                  className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                  style={{ '--delay': `${80 + index * 40}ms` } as CSSProperties}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{cohort.label}</h3>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {cohort.window} - {cohort.code}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCohortForm({
                            id: cohort.id,
                            code: cohort.code,
                            label: cohort.label,
                            window: cohort.window,
                            note: cohort.note,
                            isActive: cohort.isActive,
                          })
                        }
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10 dark:hover:bg-white/10"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCohort(cohort.id)}
                        disabled={!canEdit || saving}
                        className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60 dark:border-rose-500/40 dark:text-rose-200 dark:hover:bg-rose-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{cohort.note}</p>
                </div>
              ))}
            </div>

            <div
              className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
              style={{ '--delay': '140ms' } as CSSProperties}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {cohortForm.id ? 'Edit Cohort' : 'Add Cohort'}
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <input
                  value={cohortForm.code}
                  onChange={(event) =>
                    setCohortForm((prev) => ({ ...prev, code: event.target.value }))
                  }
                  placeholder="Code (e.g. january)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2"
                />
                <input
                  value={cohortForm.label}
                  onChange={(event) =>
                    setCohortForm((prev) => ({ ...prev, label: event.target.value }))
                  }
                  placeholder="Cohort label"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2"
                />
                <input
                  value={cohortForm.window}
                  onChange={(event) =>
                    setCohortForm((prev) => ({ ...prev, window: event.target.value }))
                  }
                  placeholder="Window (e.g. Jan - Jun)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2"
                />
                <textarea
                  value={cohortForm.note}
                  onChange={(event) =>
                    setCohortForm((prev) => ({ ...prev, note: event.target.value }))
                  }
                  placeholder="Notes for the cohort"
                  className="min-h-[90px] w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2"
                />
                <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={cohortForm.isActive}
                    onChange={(event) =>
                      setCohortForm((prev) => ({ ...prev, isActive: event.target.checked }))
                    }
                  />
                  Active cohort
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveCohort}
                    disabled={!canEdit || saving}
                    className="admin-glow rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)]"
                  >
                    {saving ? 'Saving...' : 'Save Cohort'}
                  </button>
                  <button
                    type="button"
                    onClick={resetCohortForm}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 dark:border-white/10"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {data && activeTab === 'schedule' ? (
          <section
            className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
            style={{ '--delay': '80ms' } as CSSProperties}
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Core Schedule</h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Standard cadence across all programmes unless overridden.
            </p>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-white/5 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-400">Days</div>
                <input
                  value={scheduleForm.days}
                  onChange={(event) =>
                    setScheduleForm((prev) => ({ ...prev, days: event.target.value }))
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                />
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-white/5 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-400">Time</div>
                <input
                  value={scheduleForm.time}
                  onChange={(event) =>
                    setScheduleForm((prev) => ({ ...prev, time: event.target.value }))
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                />
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-white/5 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-400">Notes</div>
                <textarea
                  value={scheduleForm.note}
                  onChange={(event) =>
                    setScheduleForm((prev) => ({ ...prev, note: event.target.value }))
                  }
                  className="mt-2 min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={saveSchedule}
                disabled={!canEdit || saving}
                className="admin-glow rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)]"
              >
                {saving ? 'Saving...' : 'Update Schedule'}
              </button>
            </div>
          </section>
        ) : null}

        {data && activeTab === 'programs' ? (
          <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Programmes</h3>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  Manage the full catalogue that powers the public site.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openProgramModal()}
                disabled={!canEdit}
                className="admin-glow inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)]"
              >
                <Plus className="h-4 w-4" />
                New Programme
              </button>
            </div>
            <div className="space-y-4">
              {data.programs.map((program, index) => (
                <div
                  key={program.id}
                  className="admin-reveal admin-lift rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_16px_35px_rgba(0,0,0,0.45)]"
                  style={{ '--delay': `${80 + index * 40}ms` } as CSSProperties}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/10">
                      {program.heroImage ? (
                        <img
                          src={program.heroImage}
                          alt={program.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-500">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{program.title}</h4>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            {program.school} • {program.slug}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openProgramModal(program)}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10 dark:hover:bg-white/10"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProgram(program.id)}
                            disabled={!canEdit || saving}
                            className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60 dark:border-rose-500/40 dark:text-rose-200 dark:hover:bg-rose-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{program.summary}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-white/5 p-3">
                      <div className="text-[10px] uppercase tracking-wide text-slate-400">Duration</div>
                      <div className="font-semibold text-slate-900 dark:text-white">{program.duration}</div>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-white/5 p-3">
                      <div className="text-[10px] uppercase tracking-wide text-slate-400">Schedule</div>
                      <div className="font-semibold text-slate-900 dark:text-white">{program.schedule}</div>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-white/5 p-3">
                      <div className="text-[10px] uppercase tracking-wide text-slate-400">Onsite</div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {formatNaira(program.onsiteTuition)}
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-white/5 p-3">
                      <div className="text-[10px] uppercase tracking-wide text-slate-400">Online</div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {formatNaira(program.onlineTuition)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isProgramModalOpen ? (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6 overflow-hidden dark:bg-slate-950/80"
                onClick={closeProgramModal}
              >
                <div
                  className="admin-reveal w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] flex flex-col dark:border-white/10 dark:bg-[#0f172a] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
                  style={{ '--delay': '0ms' } as CSSProperties}
                  onClick={(event) => event.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="programme-modal-title"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
                    <div>
                      <h3 id="programme-modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
                        {programForm.id ? 'Edit Programme' : 'Create Programme'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-300">
                        This catalogue powers the public programmes pages and enrolment flows.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeProgramModal}
                      className="rounded-full border border-slate-200 p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10 dark:hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid flex-1 min-h-0 gap-0 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="min-h-0 space-y-6 overflow-y-auto overscroll-contain px-6 py-5">
                      <div>
                        <h4
                          className={`text-sm font-semibold ${
                            sectionErrors.core ? 'text-rose-600' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          Core Details
                        </h4>
                        {sectionErrors.core ? (
                          <p className="mt-1 text-xs text-rose-600">{sectionErrors.core}</p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                            Slug auto-formats from the title unless you edit it.
                          </p>
                        )}
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <input
                              value={programForm.slug}
                              onChange={(event) => {
                                const value = slugify(event.target.value);
                                setSlugTouched(true);
                                clearSectionError('core');
                                setProgramForm((prev) => ({ ...prev, slug: value }));
                              }}
                              placeholder="Slug *"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const nextSlug = slugify(programForm.title);
                                setSlugTouched(false);
                                clearSectionError('core');
                                setProgramForm((prev) => ({ ...prev, slug: nextSlug }));
                              }}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10 dark:hover:bg-white/10"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              Reset
                            </button>
                          </div>
                          <input
                            value={programForm.title}
                            onChange={(event) => {
                              clearSectionError('core');
                              setProgramForm((prev) => ({
                                ...prev,
                                title: event.target.value,
                                slug: slugTouched ? prev.slug : slugify(event.target.value),
                              }));
                            }}
                            placeholder="Programme title *"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                          />
                          <select
                            value={programForm.school}
                            onChange={(event) =>
                              setProgramForm((prev) => {
                                clearSectionError('core');
                                return { ...prev, school: event.target.value };
                              })
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                          >
                            <option value="Engineering">Engineering</option>
                            <option value="Product">Product</option>
                            <option value="Data">Data</option>
                          </select>
                          <input
                            value={programForm.heroImage}
                            onChange={(event) =>
                              setProgramForm((prev) => {
                                clearSectionError('core');
                                return { ...prev, heroImage: event.target.value };
                              })
                            }
                            placeholder="Hero image URL *"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                          />
                        </div>
                        <div className="mt-3 grid gap-3">
                          <textarea
                            value={programForm.summary}
                            onChange={(event) =>
                              setProgramForm((prev) => {
                                clearSectionError('core');
                                return { ...prev, summary: event.target.value };
                              })
                            }
                            placeholder="Short summary *"
                            className="min-h-[90px] w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                          />
                          <textarea
                            value={programForm.overview}
                            onChange={(event) =>
                              setProgramForm((prev) => ({ ...prev, overview: event.target.value }))
                            }
                            placeholder="Programme overview"
                            className="min-h-[90px] w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <h4
                          className={`text-sm font-semibold ${
                            sectionErrors.schedule ? 'text-rose-600' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          Schedule & Tuition
                        </h4>
                        {sectionErrors.schedule ? (
                          <p className="mt-1 text-xs text-rose-600">{sectionErrors.schedule}</p>
                        ) : null}
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <input
                            value={programForm.duration}
                            onChange={(event) =>
                              setProgramForm((prev) => {
                                clearSectionError('schedule');
                                return { ...prev, duration: event.target.value };
                              })
                            }
                            placeholder="Duration *"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                          />
                          <input
                            value={programForm.schedule}
                            onChange={(event) =>
                              setProgramForm((prev) => {
                                clearSectionError('schedule');
                                return { ...prev, schedule: event.target.value };
                              })
                            }
                            placeholder="Schedule *"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                          />
                          <input
                            type="number"
                            value={programForm.onsiteTuition}
                            onChange={(event) =>
                              setProgramForm((prev) => ({
                                ...prev,
                                onsiteTuition: Number(event.target.value),
                              }))
                            }
                            placeholder="Onsite tuition"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                          />
                          <input
                            type="number"
                            value={programForm.onlineTuition}
                            onChange={(event) =>
                              setProgramForm((prev) => ({
                                ...prev,
                                onlineTuition: Number(event.target.value),
                              }))
                            }
                            placeholder="Online tuition"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Highlights & Outcomes</h4>
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <textarea
                            value={programForm.highlights}
                            onChange={(event) =>
                              setProgramForm((prev) => ({ ...prev, highlights: event.target.value }))
                            }
                            placeholder="Highlights (comma or new line)"
                            className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                          />
                          <textarea
                            value={programForm.outcomes}
                            onChange={(event) =>
                              setProgramForm((prev) => ({ ...prev, outcomes: event.target.value }))
                            }
                            placeholder="Outcomes (comma or new line)"
                            className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Tools, Roles & Assessment</h4>
                        <div className="mt-3 grid gap-3 md:grid-cols-3">
                          <textarea
                            value={programForm.tools}
                            onChange={(event) =>
                              setProgramForm((prev) => ({ ...prev, tools: event.target.value }))
                            }
                            placeholder="Tools (comma or new line)"
                            className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                          />
                          <textarea
                            value={programForm.roles}
                            onChange={(event) =>
                              setProgramForm((prev) => ({ ...prev, roles: event.target.value }))
                            }
                            placeholder="Roles (comma or new line)"
                            className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                          />
                          <textarea
                            value={programForm.assessment}
                            onChange={(event) =>
                              setProgramForm((prev) => ({ ...prev, assessment: event.target.value }))
                            }
                            placeholder="Assessment (comma or new line)"
                            className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Projects</h4>
                        <div className="mt-3 space-y-3">
                          {projectItems.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-white/15 dark:bg-white/5 p-4 text-xs text-slate-500 dark:text-slate-300">
                              Add your first project to show up here.
                            </div>
                          ) : (
                            projectItems.map((project, index) => (
                              <div
                                key={`${project.title}-${index}`}
                                onDragOver={(event) => {
                                  if (event.dataTransfer.types.includes('application/x-program-project')) {
                                    event.preventDefault();
                                    event.dataTransfer.dropEffect = 'move';
                                  }
                                }}
                                onDrop={(event) => {
                                  event.preventDefault();
                                  const fromRaw = event.dataTransfer.getData('application/x-program-project');
                                  if (!fromRaw) return;
                                  const from = Number(fromRaw);
                                  if (Number.isNaN(from)) return;
                                  updateProjects((items) => reorderList(items, from, index));
                                  setDraggingProjectIndex(null);
                                }}
                                className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_14px_30px_rgba(0,0,0,0.45)] ${
                                  draggingProjectIndex === index ? 'opacity-70' : ''
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <button
                                    type="button"
                                    draggable
                                    onDragStart={(event) => {
                                      event.dataTransfer.setData(
                                        'application/x-program-project',
                                        String(index)
                                      );
                                      event.dataTransfer.effectAllowed = 'move';
                                      setDraggingProjectIndex(index);
                                    }}
                                    onDragEnd={() => setDraggingProjectIndex(null)}
                                    className="mt-1 inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10 cursor-grab active:cursor-grabbing"
                                    aria-label="Reorder project"
                                  >
                                    <GripVertical className="h-4 w-4" />
                                  </button>
                                  <input
                                    value={project.title}
                                    onChange={(event) =>
                                      updateProjects((items) => {
                                        const next = [...items];
                                        next[index] = {
                                          ...next[index],
                                          title: event.target.value,
                                        };
                                        return next;
                                      })
                                    }
                                    placeholder="Project title"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateProjects((items) =>
                                        items.filter((_, itemIndex) => itemIndex !== index)
                                      )
                                    }
                                    className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-500/40 dark:text-rose-200 dark:hover:bg-rose-500/10"
                                  >
                                    Remove
                                  </button>
                                </div>
                                <textarea
                                  value={project.description}
                                  onChange={(event) =>
                                    updateProjects((items) => {
                                      const next = [...items];
                                      next[index] = {
                                        ...next[index],
                                        description: event.target.value,
                                      };
                                      return next;
                                    })
                                  }
                                  placeholder="Short description"
                                  className="mt-3 min-h-[90px] w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                                />
                              </div>
                            ))
                          )}
                          {projectItems.length > 1 ? (
                            <div
                              onDragOver={(event) => {
                                if (event.dataTransfer.types.includes('application/x-program-project')) {
                                  event.preventDefault();
                                  event.dataTransfer.dropEffect = 'move';
                                }
                              }}
                              onDrop={(event) => {
                                event.preventDefault();
                                const fromRaw = event.dataTransfer.getData('application/x-program-project');
                                if (!fromRaw) return;
                                const from = Number(fromRaw);
                                if (Number.isNaN(from)) return;
                                updateProjects((items) =>
                                  reorderList(items, from, items.length - 1)
                                );
                                setDraggingProjectIndex(null);
                              }}
                              className="rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-white/15 dark:bg-white/5 px-4 py-3 text-xs text-slate-500 dark:text-slate-300"
                            >
                              Drop here to move a project to the end.
                            </div>
                          ) : null}
                          <button
                            type="button"
                            onClick={() =>
                              updateProjects((items) => [...items, { title: '', description: '' }])
                            }
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Project
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Curriculum</h4>
                        <div className="mt-3 space-y-4">
                          {curriculumBlocks.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-white/15 dark:bg-white/5 p-4 text-xs text-slate-500 dark:text-slate-300">
                              Add curriculum modules to structure the learning path.
                            </div>
                          ) : (
                            curriculumBlocks.map((block, blockIndex) => (
                              <div
                                key={`${block.label}-${blockIndex}`}
                                onDragOver={(event) => {
                                  if (
                                    event.dataTransfer.types.includes(
                                      'application/x-program-curriculum'
                                    )
                                  ) {
                                    event.preventDefault();
                                    event.dataTransfer.dropEffect = 'move';
                                  }
                                }}
                                onDrop={(event) => {
                                  event.preventDefault();
                                  const fromRaw = event.dataTransfer.getData(
                                    'application/x-program-curriculum'
                                  );
                                  if (!fromRaw) return;
                                  const from = Number(fromRaw);
                                  if (Number.isNaN(from)) return;
                                  updateCurriculumBlocks((blocks) =>
                                    reorderList(blocks, from, blockIndex)
                                  );
                                  setDraggingCurriculumIndex(null);
                                }}
                                className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_14px_30px_rgba(0,0,0,0.45)] ${
                                  draggingCurriculumIndex === blockIndex ? 'opacity-70' : ''
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <button
                                    type="button"
                                    draggable
                                    onDragStart={(event) => {
                                      event.dataTransfer.setData(
                                        'application/x-program-curriculum',
                                        String(blockIndex)
                                      );
                                      event.dataTransfer.effectAllowed = 'move';
                                      setDraggingCurriculumIndex(blockIndex);
                                    }}
                                    onDragEnd={() => setDraggingCurriculumIndex(null)}
                                    className="mt-1 inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10 cursor-grab active:cursor-grabbing"
                                    aria-label="Reorder module"
                                  >
                                    <GripVertical className="h-4 w-4" />
                                  </button>
                                  <input
                                    value={block.label}
                                    onChange={(event) =>
                                      updateCurriculumBlocks((blocks) => {
                                        const next = blocks.map((item, idx) =>
                                          idx === blockIndex ? { ...item, label: event.target.value } : item
                                        );
                                        return next;
                                      })
                                    }
                                    placeholder="Module label"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateCurriculumBlocks((blocks) =>
                                        blocks.filter((_, idx) => idx !== blockIndex)
                                      )
                                    }
                                    className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-500/40 dark:text-rose-200 dark:hover:bg-rose-500/10"
                                  >
                                    Remove
                                  </button>
                                </div>

                                <div className="mt-3 space-y-2">
                                  {(block.topics.length ? block.topics : ['']).map((topic, topicIndex) => (
                                    <div
                                      key={`${blockIndex}-${topicIndex}`}
                                      onDragOver={(event) => {
                                        if (
                                          event.dataTransfer.types.includes('application/x-program-topic')
                                        ) {
                                          event.preventDefault();
                                          event.dataTransfer.dropEffect = 'move';
                                        }
                                      }}
                                      onDrop={(event) => {
                                        event.preventDefault();
                                        const raw = event.dataTransfer.getData(
                                          'application/x-program-topic'
                                        );
                                        if (!raw) return;
                                        let payload: { blockIndex: number; topicIndex: number } | null = null;
                                        try {
                                          payload = JSON.parse(raw);
                                        } catch (err) {
                                          return;
                                        }
                                        if (!payload) return;
                                        updateCurriculumBlocks((blocks) => {
                                          const next = blocks.map((item) => ({
                                            ...item,
                                            topics: [...item.topics],
                                          }));
                                          const fromBlock = next[payload.blockIndex];
                                          const toBlock = next[blockIndex];
                                          if (!fromBlock || !toBlock) return blocks;
                                          if (payload.blockIndex === blockIndex) {
                                            toBlock.topics = reorderList(
                                              toBlock.topics,
                                              payload.topicIndex,
                                              topicIndex
                                            );
                                            return next;
                                          }
                                          const [moved] = fromBlock.topics.splice(payload.topicIndex, 1);
                                          if (moved === undefined) return blocks;
                                          toBlock.topics.splice(topicIndex, 0, moved);
                                          return next;
                                        });
                                        setDraggingTopic(null);
                                      }}
                                      className={`flex items-center gap-2 ${
                                        draggingTopic &&
                                        draggingTopic.blockIndex === blockIndex &&
                                        draggingTopic.topicIndex === topicIndex
                                          ? 'opacity-70'
                                          : ''
                                      }`}
                                    >
                                      <button
                                        type="button"
                                        draggable
                                        onDragStart={(event) => {
                                          event.dataTransfer.setData(
                                            'application/x-program-topic',
                                            JSON.stringify({ blockIndex, topicIndex })
                                          );
                                          event.dataTransfer.effectAllowed = 'move';
                                          setDraggingTopic({ blockIndex, topicIndex });
                                        }}
                                        onDragEnd={() => setDraggingTopic(null)}
                                        className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10 cursor-grab active:cursor-grabbing"
                                        aria-label="Reorder topic"
                                      >
                                        <GripVertical className="h-4 w-4" />
                                      </button>
                                      <input
                                        value={topic}
                                        onChange={(event) =>
                                          updateCurriculumBlocks((blocks) => {
                                            const next = blocks.map((item, idx) => {
                                              if (idx !== blockIndex) return item;
                                              const topics = [...item.topics];
                                              topics[topicIndex] = event.target.value;
                                              return { ...item, topics };
                                            });
                                            return next;
                                          })
                                        }
                                        placeholder="Topic"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateCurriculumBlocks((blocks) => {
                                            const next = blocks.map((item, idx) => {
                                              if (idx !== blockIndex) return item;
                                              const topics = item.topics.filter(
                                                (_, tIdx) => tIdx !== topicIndex
                                              );
                                              return { ...item, topics };
                                            });
                                            return next;
                                          })
                                        }
                                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                {block.topics.length > 1 ? (
                                  <div
                                    onDragOver={(event) => {
                                      if (
                                        event.dataTransfer.types.includes('application/x-program-topic')
                                      ) {
                                        event.preventDefault();
                                        event.dataTransfer.dropEffect = 'move';
                                      }
                                    }}
                                    onDrop={(event) => {
                                      event.preventDefault();
                                      const raw = event.dataTransfer.getData(
                                        'application/x-program-topic'
                                      );
                                      if (!raw) return;
                                      let payload: { blockIndex: number; topicIndex: number } | null = null;
                                      try {
                                        payload = JSON.parse(raw);
                                      } catch (err) {
                                        return;
                                      }
                                      if (!payload) return;
                                      updateCurriculumBlocks((blocks) => {
                                        const next = blocks.map((item) => ({
                                          ...item,
                                          topics: [...item.topics],
                                        }));
                                        const fromBlock = next[payload.blockIndex];
                                        const toBlock = next[blockIndex];
                                        if (!fromBlock || !toBlock) return blocks;
                                        if (payload.blockIndex === blockIndex) {
                                          toBlock.topics = reorderList(
                                            toBlock.topics,
                                            payload.topicIndex,
                                            toBlock.topics.length - 1
                                          );
                                          return next;
                                        }
                                        const [moved] = fromBlock.topics.splice(payload.topicIndex, 1);
                                        if (moved === undefined) return blocks;
                                        toBlock.topics.push(moved);
                                        return next;
                                      });
                                      setDraggingTopic(null);
                                    }}
                                    className="rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-white/15 dark:bg-white/5 px-3 py-2 text-xs text-slate-500 dark:text-slate-300"
                                  >
                                    Drop here to move a topic to the end.
                                  </div>
                                ) : null}

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateCurriculumBlocks((blocks) => {
                                      const next = blocks.map((item, idx) => {
                                        if (idx !== blockIndex) return item;
                                        return { ...item, topics: [...item.topics, ''] };
                                      });
                                      return next;
                                    })
                                  }
                                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                  Add Topic
                                </button>
                              </div>
                            ))
                          )}
                          {curriculumBlocks.length > 1 ? (
                            <div
                              onDragOver={(event) => {
                                if (
                                  event.dataTransfer.types.includes(
                                    'application/x-program-curriculum'
                                  )
                                ) {
                                  event.preventDefault();
                                  event.dataTransfer.dropEffect = 'move';
                                }
                              }}
                              onDrop={(event) => {
                                event.preventDefault();
                                const fromRaw = event.dataTransfer.getData(
                                  'application/x-program-curriculum'
                                );
                                if (!fromRaw) return;
                                const from = Number(fromRaw);
                                if (Number.isNaN(from)) return;
                                updateCurriculumBlocks((blocks) =>
                                  reorderList(blocks, from, blocks.length - 1)
                                );
                                setDraggingCurriculumIndex(null);
                              }}
                              className="rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-white/15 dark:bg-white/5 px-4 py-3 text-xs text-slate-500 dark:text-slate-300"
                            >
                              Drop here to move a module to the end.
                            </div>
                          ) : null}
                          <button
                            type="button"
                            onClick={() =>
                              updateCurriculumBlocks((blocks) => [
                                ...blocks,
                                { label: '', topics: [''] },
                              ])
                            }
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Module
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4
                          className={`text-sm font-semibold ${
                            sectionErrors.graduation ? 'text-rose-600' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          Graduation Standard
                        </h4>
                        {sectionErrors.graduation ? (
                          <p className="mt-1 text-xs text-rose-600">{sectionErrors.graduation}</p>
                        ) : null}
                        <textarea
                          value={programForm.graduationStandard}
                          onChange={(event) => {
                            clearSectionError('graduation');
                            setProgramForm((prev) => ({
                              ...prev,
                              graduationStandard: event.target.value,
                            }));
                          }}
                          placeholder="Graduation standard *"
                          className="min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-4 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <aside className="min-h-0 overflow-y-auto overscroll-contain border-l border-slate-200 bg-slate-50 px-6 py-5 dark:border-white/10 dark:bg-[#0f172a]">
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                          <div className="text-xs uppercase tracking-wide text-slate-400">Preview</div>
                          <div className="mt-3">
                            <div className="text-lg font-semibold text-slate-900 dark:text-white">
                              {programForm.title || 'Programme Title'}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-300">
                              {programForm.school || 'School'} •{' '}
                              {programForm.slug || slugify(programForm.title) || 'slug'}
                            </div>
                          </div>
                          <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                            <div className="flex items-center justify-between">
                              <span>Onsite</span>
                              <span className="font-semibold">
                                {formatNaira(programForm.onsiteTuition || 0)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Online</span>
                              <span className="font-semibold">
                                {formatNaira(programForm.onlineTuition || 0)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Highlights</span>
                              <span className="font-semibold">
                                {textToList(programForm.highlights).length}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Projects</span>
                              <span className="font-semibold">
                                {textToProjects(programForm.projects).length}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                          <div className="text-xs uppercase tracking-wide text-slate-400">Hero Image</div>
                          <div className="mt-3 h-32 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-white/5">
                            {programForm.heroImage ? (
                              <img
                                src={programForm.heroImage}
                                alt="Hero preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-500">
                                <ImageIcon className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-xs text-slate-500 dark:text-slate-300 dark:border-white/15 dark:bg-white/5">
                          Required fields: slug, title, summary, duration, schedule, hero image, graduation
                          standard.
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500 dark:text-slate-300 dark:border-white/10 dark:bg-white/5">
                          Autosave:{' '}
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {draftStatus === 'saving'
                              ? 'Saving...'
                              : draftStatus === 'saved'
                                ? 'Saved'
                                : 'Ready'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (typeof window !== 'undefined') {
                                localStorage.removeItem(draftKey);
                              }
                              setDraftStatus('idle');
                              if (baselineProgramForm) {
                                setProgramForm(baselineProgramForm);
                                setSlugTouched(Boolean(baselineProgramForm.slug));
                              }
                            }}
                            className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10"
                          >
                            Clear draft
                          </button>
                        </div>
                      </div>
                    </aside>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                    {error ? (
                      <div className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
                        {error}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 dark:text-slate-300">All changes save to the live catalogue.</div>
                    )}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <button
                        type="button"
                        onClick={closeProgramModal}
                        className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/10"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={saveProgram}
                        disabled={!canEdit || saving}
                        className="admin-glow rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)]"
                      >
                        {saving ? 'Saving...' : 'Save Programme'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        {data && activeTab === 'schools' ? (
          <section className="grid gap-4 lg:grid-cols-3">
            {schools.map((school, index) => (
              <div
                key={school.name}
                className="admin-reveal admin-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#141b29] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                style={{ '--delay': `${80 + index * 40}ms` } as CSSProperties}
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{school.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-300">{school.totalPrograms} programmes</p>
                <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {school.programs.map((program) => (
                    <div
                      key={program}
                      className="rounded-lg border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-white/5 px-3 py-2"
                    >
                      {program}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : null}
      </div>
    </AdminGate>
  );
}

