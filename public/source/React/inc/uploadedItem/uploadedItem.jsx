import React from 'react';
import PropTypes from 'prop-types';

import { Stack, Typography, IconButton, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

//ICONS
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

import sx from './uploadedItem.module.scss';

const UploadedItem = ({
  indexFile,
  name,
  size,
  lastItem,
  height,
  noDivider,
  handleDeleteItem,
  variant = 'outlined',
}) => {
  const theme = useTheme();
  return (
    <>
      {variant === 'outlined' && (
        <>
          <Stack className={sx.stack__items} sx={{ height: `${height}px` }}>
            <Stack className={sx.stack__item}>
              <DescriptionIcon
                className={sx.iconRegular}
                sx={{
                  color: theme.palette.neutral.dark300,
                }}
              />
              <Typography variant={'h5'}>{name}</Typography>
            </Stack>

            <Stack className={sx.stack__icons}>
              <IconButton sx={{ color: theme.palette.dark.main }}>
                <VisibilityIcon className={sx.iconSmall} />
              </IconButton>
              <IconButton
                sx={{ color: theme.palette.dark.main }}
                onClick={() => handleDeleteItem(indexFile)}
              >
                <DeleteIcon className={sx.iconSmall} />
              </IconButton>
            </Stack>
          </Stack>
          {!noDivider && !lastItem && <Divider />}
        </>
      )}
      {variant === 'contained' && (
        <>
          <Stack className={sx.stack__items} sx={{ height: `${height}px` }}>
            <Stack className={sx.stack__item__contained}>
              <DescriptionIcon
                className={sx.iconRegular__contained}
                sx={{
                  color: theme.palette.neutral.dark300,
                }}
              />
              <Typography className={sx.typography__name}>{name}</Typography>
              <Typography className={sx.typography__size}>{size}</Typography>
            </Stack>

            <Stack className={sx.stack__icons__contained}>
              <IconButton sx={{ color: theme.palette.dark.main }}>
                <VisibilityIcon className={sx.iconSmall} />
              </IconButton>
              <IconButton sx={{ color: theme.palette.dark.main }}>
                <DeleteIcon className={sx.iconSmall} />
              </IconButton>
            </Stack>
          </Stack>
          {!noDivider && !lastItem && <Divider />}
        </>
      )}
    </>
  );
};

UploadedItem.propTypes = {
  indexFile: PropTypes.number,
  name: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  lastItem: PropTypes.bool,
  height: PropTypes.number,
  noDivider: PropTypes.bool,
  handleDeleteItem: PropTypes.func,
  variant: PropTypes.string,
};

export default UploadedItem;
