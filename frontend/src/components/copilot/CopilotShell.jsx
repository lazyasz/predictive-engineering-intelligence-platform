import { Bot, Send, Sparkles } from 'lucide-react';

const examplePrompts = [
  'What are the highest-risk files this sprint?',
  'Show me technical debt trends for the payment module',
  'Which files should we prioritize for refactoring?',
  'Explain the risk factors for AuthenticationManager.java',
];

export default function CopilotShell() {
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Chat area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-100 mb-6">
          <Bot className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">AI Engineering Copilot</h3>
        <p className="mt-2 text-sm text-slate-500 text-center max-w-md">
          Ask questions about your codebase health, technical debt, and risk predictions.
          The AI Copilot will be available once the backend intelligence layer is connected.
        </p>

        {/* Example prompts */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
          {examplePrompts.map((prompt, i) => (
            <button
              key={i}
              disabled
              className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 text-left text-xs text-slate-500 bg-slate-50 cursor-not-allowed"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 mt-0.5 shrink-0" />
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input area (disabled placeholder) */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 bg-slate-50 rounded-lg border border-slate-200 px-4 py-3">
          <input
            type="text"
            disabled
            placeholder="AI Copilot coming soon — backend not connected"
            className="flex-1 bg-transparent text-sm text-slate-400 placeholder-slate-400 outline-none cursor-not-allowed"
          />
          <button disabled className="p-1.5 rounded-lg text-slate-300 cursor-not-allowed">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
