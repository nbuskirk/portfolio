import { useQuery } from '@tanstack/react-query';
import { CUSTOMIZATION } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

export type Vendor = 'dell' | 'infinidat';

export interface Customizations {
  vendor?: Vendor;
  product_name?: string;
  disable_index_reset?: '1' | '0';
  disable_scratch_storage?: '1' | '0';
  backup_tab_label?: string;
  policies_disableCreatePolicyButton?: '1' | '0';
  policies_disableColumnsProvider?: '1' | '0';
  policies_disableActionsView?: '1' | '0';
  policies_disableActionsEdit?: '1' | '0';
  policies_disableActionsDelete?: '1' | '0';
  policies_disableActionsRun?: '1' | '0';
  policy_name_length_validation?: string;
  policy_name_length_validation_message?: string;
  hide_backup_policy_in_csv_export?: '1' | '0';
  disable_help_links?: '1' | '0';
}

export const getCustomization = () =>
  API.get<Customizations>('/configurations/customization').then(
    (res) => res.data
  );

export const getCustomizationQuery = () =>
  ({
    queryKey: [CUSTOMIZATION],
    queryFn: getCustomization
  }) as const;

const useCustomization = () => {
  return useQuery(getCustomizationQuery());
};

export default useCustomization;
