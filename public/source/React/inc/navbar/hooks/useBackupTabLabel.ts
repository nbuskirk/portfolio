import useCustomization from 'data-hooks/config/useCustomization';

const useBackupTabLabel = () => {
  const { data: customizationData } = useCustomization();
  return customizationData?.backup_tab_label;
};

export default useBackupTabLabel;
