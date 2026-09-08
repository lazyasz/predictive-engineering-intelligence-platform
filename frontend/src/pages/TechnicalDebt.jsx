import { useTechnicalDebt } from '../hooks/useTechnicalDebt';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import DebtTable from '../components/tables/DebtTable';

export default function TechnicalDebt() {
  const { data, loading, error } = useTechnicalDebt();

  if (loading) return <LoadingState message="Loading technical debt data..." />;
  if (error) return <ErrorState message={error} />;
  if (!data || data.length === 0) return <EmptyState title="No technical debt items found" />;

  return (
    <div>
      <PageHeader
        title="Technical Debt Inventory"
        description="Complete inventory of identified technical debt items with risk and priority assessments."
      />
      <Card>
        <DebtTable data={data} />
      </Card>
    </div>
  );
}
