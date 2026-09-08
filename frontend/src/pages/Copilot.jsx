import PageHeader from '../components/ui/PageHeader';
import CopilotShell from '../components/copilot/CopilotShell';

export default function Copilot() {
  return (
    <div>
      <PageHeader
        title="AI Engineering Copilot"
        description="Natural-language interface for querying technical debt insights and recommendations."
      />
      <CopilotShell />
    </div>
  );
}
