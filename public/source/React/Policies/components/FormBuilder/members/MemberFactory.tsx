import { ReactNode } from 'react';
import { Alert } from '@mui/lab';
import { MemberSchema } from '../schema.types';
import InputMember from './InputMember';
import PasswordMember from './PasswordInputMember';
import SelectMember from './SelectMember';
import { MemberData } from '../../PolicyEditor/types';
import AutocompleteMember from './AutocompleteMember';
import CheckboxMember from './CheckboxMember';
import TableDictionaryMember from './TableDictionaryMember';
import CoupledInputMember, {
  CoupledInputMemberValue
} from './CoupledInputMember';

type Props = MemberSchema & {
  disabled?: boolean;
  memberValue: MemberData[string];
  onMemberChange: (memberValue: MemberData[string]) => void;
};

const MemberFactory = ({
  disabled = false,
  type,
  props,
  memberValue,
  onMemberChange
}: Props): ReactNode => {
  if (type === 'input') {
    // NOTE: These are inside each block so TS can infer the type.
    const { disabled: propDisabled, ...rest } = props;
    return (
      <InputMember
        disabled={propDisabled || disabled}
        value={memberValue as string}
        setValue={onMemberChange}
        {...rest}
      />
    );
  }
  if (type === 'password') {
    // NOTE: These are inside each block so TS can infer the type.
    const { disabled: propDisabled, ...rest } = props;
    return (
      <PasswordMember
        disabled={propDisabled || disabled}
        value={memberValue as string}
        setValue={onMemberChange}
        {...rest}
      />
    );
  }
  if (type === 'select') {
    // NOTE: These are inside each block so TS can infer the type.
    const { disabled: propDisabled, ...rest } = props;
    return (
      <SelectMember
        disabled={propDisabled || disabled}
        value={memberValue as string}
        setValue={onMemberChange}
        {...rest}
      />
    );
  }
  if (type === 'autocomplete') {
    // NOTE: These are inside each block so TS can infer the type.
    const { disabled: propDisabled, ...rest } = props;
    return (
      <AutocompleteMember
        disabled={propDisabled || disabled}
        value={memberValue as string}
        setValue={onMemberChange}
        {...rest}
      />
    );
  }
  if (type === 'checkbox') {
    // NOTE: These are inside each block so TS can infer the type.
    const { disabled: propDisabled, ...rest } = props;
    return (
      <CheckboxMember
        disabled={propDisabled || disabled}
        value={memberValue as boolean}
        setValue={onMemberChange}
        {...rest}
      />
    );
  }
  if (type === 'tabledictionary') {
    // NOTE: These are inside each block so TS can infer the type.
    const { disabled: propDisabled, ...rest } = props;
    return (
      <TableDictionaryMember
        disabled={propDisabled || disabled}
        value={memberValue as Record<string, string>}
        setValue={onMemberChange}
        {...rest}
      />
    );
  }
  if (type === 'coupledinput') {
    // NOTE: These are inside each block so TS can infer the type.
    const { disabled: propDisabled, ...rest } = props;
    return (
      <CoupledInputMember
        disabled={propDisabled || disabled}
        value={memberValue as CoupledInputMemberValue}
        setValue={onMemberChange}
        {...rest}
      />
    );
  }
  return (
    <Alert
      severity='error'
      variant='outlined'
      sx={{
        border: '1px solid rgb(229, 115, 115)',
        color: 'rgb(229, 115, 115)',
        fontWeight: 800
      }}
    >
      Unknown member type {`'${type}'.`}
    </Alert>
  );
};

export default MemberFactory;
