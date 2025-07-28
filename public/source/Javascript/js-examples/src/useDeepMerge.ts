export interface themeProps {
  palette: {
    main?: string | number | null;
    secondary?: string | number | null;
  };
}

const useDeepMerge = (
  a: themeProps,
  b: themeProps,
  depth: number
): themeProps => {
  const result = { palette: { main: null, secondary: null } };
  return result;
};

export { useDeepMerge };
