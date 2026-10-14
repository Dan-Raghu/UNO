from pathlib import Path

app_path = Path("src/App.tsx")
if not app_path.exists():
    raise SystemExit("Run this script from the root of your PROJECT-UNO repository (where src/App.tsx exists).")

text = app_path.read_text(encoding="utf-8")

def replace_once(old, new, description):
    global text
    if old not in text:
        raise SystemExit(f"Could not find expected App.tsx section: {description}. No changes were written.")
    text = text.replace(old, new, 1)

replace_once(
    "import { SubjectSelectionDialog } from './components/SubjectSelectionDialog';",
    "import { SubjectSelectionDialog } from './components/SubjectSelectionDialog';\n"
    "import { GPACalculator, GpaLockedNotice, isGpaReady } from './components/GPACalculator';",
    "component imports",
)
replace_once(
    "  BookOpen,\n} from 'lucide-react';",
    "  BookOpen,\n  GraduationCap,\n} from 'lucide-react';",
    "Lucide icon imports",
)
replace_once(
    "const [activeTab, setActiveTab] = useState<'calculator' | 'grades'>('calculator');",
    "const [activeTab, setActiveTab] = useState<'calculator' | 'grades' | 'gpa'>('calculator');\n"
    "  const gpaReady = useMemo(() => isGpaReady(subjects), [subjects]);",
    "active tab state",
)

# Add desktop navigation button just before the nav closes.
replace_once(
    "            </button>\n          </nav>",
    "            </button>\n"
    "            <button\n"
    "              type=\"button\"\n"
    "              disabled={!gpaReady}\n"
    "              onClick={() => setActiveTab('gpa')}\n"
    "              title={gpaReady ? 'Open GPA Calculator' : 'Enter marks for all seven courses first'}\n"
    "              className={`transition-colors flex items-center gap-2 py-1 ${!gpaReady ? 'text-slate-400 cursor-not-allowed' : activeTab === 'gpa' ? 'text-[#172554] font-black border-b-2 border-[#172554] cursor-pointer' : 'text-slate-600 hover:text-[#172554] cursor-pointer'}`}\n"
    "            >\n"
    "              <GraduationCap className=\"w-5 h-5\" />\n"
    "              <span>GPA Calculator</span>\n"
    "              {!gpaReady && <span className=\"text-[10px]\">(Locked)</span>}\n"
    "            </button>\n"
    "          </nav>",
    "desktop navigation",
)

replace_once(
    "          <button\n"
    "            type=\"button\"\n"
    "            onClick={() => setActiveTab('grades')}\n"
    "            aria-pressed={activeTab === 'grades'}\n"
    "            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-l border-slate-300 ${\n"
    "              activeTab === 'grades' ? 'bg-[#172554] text-white' : 'text-[#172554]'\n"
    "            }`}\n"
    "          >\n"
    "            Grading Scale\n"
    "          </button>\n"
    "        </div>",
    "          <button\n"
    "            type=\"button\"\n"
    "            onClick={() => setActiveTab('grades')}\n"
    "            aria-pressed={activeTab === 'grades'}\n"
    "            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-l border-slate-300 ${\n"
    "              activeTab === 'grades' ? 'bg-[#172554] text-white' : 'text-[#172554]'\n"
    "            }`}\n"
    "          >\n"
    "            Grading Scale\n"
    "          </button>\n"
    "          <button\n"
    "            type=\"button\"\n"
    "            disabled={!gpaReady}\n"
    "            onClick={() => setActiveTab('gpa')}\n"
    "            aria-pressed={activeTab === 'gpa'}\n"
    "            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-l border-slate-300 ${!gpaReady ? 'text-slate-400 cursor-not-allowed' : activeTab === 'gpa' ? 'bg-[#172554] text-white' : 'text-[#172554]'}`}\n"
    "          >\n"
    "            GPA {!gpaReady && '🔒'}\n"
    "          </button>\n"
    "        </div>",
    "mobile navigation",
)

# Switch mobile nav to a three-column grid.
replace_once(
    '<div className="flex md:hidden mb-6 border border-slate-300 bg-white shadow-sm">',
    '<div className="grid grid-cols-3 md:hidden mb-6 border border-slate-300 bg-white shadow-sm">',
    "mobile navigation layout",
)

# Add lock instruction after mobile nav and before SubjectHeader.
replace_once(
    "        {/* Subject Header with Dialog Box Trigger */}\n"
    "        <SubjectHeader",
    "        {!gpaReady && <div className=\"mb-6\"><GpaLockedNotice /></div>}\n"
    "        {/* Subject Header with Dialog Box Trigger */}\n"
    "        <SubjectHeader",
    "locked notice",
)

# Add the GPA view before the final closing main tag. This avoids depending
# on the exact formatting or the adjacent tab's JSX structure.
main_close = text.rfind("</main>")
if main_close < 0:
    raise SystemExit("Could not find a closing </main> tag in App.tsx. No changes were written.")

gpa_view = (
    "\\n        {activeTab === 'gpa' && (\\n"
    "          gpaReady ? <GPACalculator subjects={subjects} /> : <GpaLockedNotice />\\n"
    "        )}\\n"
)
text = text[:main_close] + gpa_view + text[main_close:]

app_path.write_text(text, encoding="utf-8")
print("GPA integration applied to src/App.tsx")
