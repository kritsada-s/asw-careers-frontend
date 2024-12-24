import { useDepartment } from '@/pages/hooks/useDataFetching';

interface WorkLocationProps {
  comp: string;
  did: string;
}

export function Department({ comp, did }: WorkLocationProps) {
    const { department, isLoading } = useDepartment(comp, did || '');
    if (isLoading) return <span className="text-gray-400">Loading...</span>;
    return <>{department}</>;
}