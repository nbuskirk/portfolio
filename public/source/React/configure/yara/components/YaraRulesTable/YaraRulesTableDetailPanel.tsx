import { Box, useTheme } from '@mui/material';
import { GridRowParams } from '@mui/x-data-grid-premium';

const YaraRulesTableDetailPanel = ({ params }: { params: GridRowParams }) => {
  const theme = useTheme();

  let lineNumber = 0;
  const ruleWithLineNumbers = params.row.rule
    .split('\n')
    .map((line: string) => {
      lineNumber += 1;
      return (
        <div key={lineNumber}>
          <span
            style={{
              color: theme.palette.neutral.primary200,
              width: '25px',
              display: 'inline-block'
            }}
          >
            {lineNumber}
          </span>
          {line}
          <br />
        </div>
      );
    });

  return (
    <Box
      sx={{
        padding: 2,
        maxHeight: 500,
        overflowY: 'auto',
        border: '2px solid',
        borderColor: theme.palette.secondary.main
      }}
    >
      <pre>{ruleWithLineNumbers}</pre>
    </Box>
  );
};

export default YaraRulesTableDetailPanel;
