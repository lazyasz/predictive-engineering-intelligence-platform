import { useState, useEffect } from 'react';
import { getHotspots } from '../services/api';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import HotspotsTable from '../components/tables/HotspotsTable';

export default function Hotspots() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await getHotspots();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load hotspots');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingState message="Loading hotspots..." />;
  if (error) return <ErrorState message={error} />;
  if (!data || data.length === 0) return <EmptyState title="No hotspots detected" />;

  return (
    <div>
      <PageHeader
        title="Code Hotspots"
        description="Files with high complexity, churn, and defect density — highest risk of future issues."
      />
      <Card>
        <HotspotsTable data={data} />
      </Card>
    </div>
  );
}
