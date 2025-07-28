import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/system';

interface CustomButtonProps extends ButtonProps {
  bgColor: string;
  fontColor: string;
  width: string;
}

const CustomButton = styled(Button)<CustomButtonProps>(
  ({ bgColor, fontColor, width }) => ({
    width,
    color: fontColor,
    backgroundColor: bgColor,
    '&:hover': {
      backgroundColor: bgColor,
      color: fontColor
    },
    '&:focus, &:active': {
      backgroundColor: bgColor,
      color: fontColor
    }
  })
);

export default CustomButton;
