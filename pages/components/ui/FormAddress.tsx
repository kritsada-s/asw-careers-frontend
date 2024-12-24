import { useDistricts, useProvinces, useSubDistricts} from "@/pages/hooks/useDataFetching";
import { useEffect, useState } from "react";

interface FormSelectProps {
  type?: 'province' | 'district' | 'subdistrict' | 'gender' | 'maritalStatus';
  queryID?: number;
}

function FormSelect({ type='province', queryID }: FormSelectProps) {
  const [qID, setQID] = useState<number>(queryID || 0);
  const { provinces, isLoading:isProvincesLoading } = useProvinces();
  const { districts, isLoading:isDistrictsLoading } = useDistricts(qID);
  const { subDistricts, isLoading:isSubDistrictsLoading } = useSubDistricts(qID);

  useEffect(() => {
    setQID(queryID || 0);
  }, [queryID]);

  return (
    <div>
      {qID}
    </div>
  );
}

export default FormSelect;
