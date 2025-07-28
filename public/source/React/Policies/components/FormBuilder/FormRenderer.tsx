import { Stack } from '@mui/material';
import { ReactNode } from 'react';
import MemberFactory from './members/MemberFactory';
import {
  JsonTemplateSchemaWithoutModalTransition,
  MemberData
} from '../PolicyEditor/types';

interface Props {
  disabled: boolean;
  jsonTemplateSchema: JsonTemplateSchemaWithoutModalTransition;
  memberData: MemberData;
  changeMemberData: (
    memberName: string,
    memberValue: MemberData[string]
  ) => void;
}

const FormRenderer = ({
  disabled,
  jsonTemplateSchema,
  memberData,
  changeMemberData
}: Props): ReactNode => {
  const handleMemberChange =
    (memberName: string) => (memberValue: MemberData[string]) => {
      changeMemberData(memberName, memberValue);
    };

  return (
    <Stack direction='column' spacing={jsonTemplateSchema?.spacing ?? 1}>
      {jsonTemplateSchema.members.map((member) => (
        <MemberFactory
          disabled={disabled}
          key={member.props.name}
          memberValue={memberData[member.props.name]}
          onMemberChange={handleMemberChange(member.props.name)}
          {...member}
        />
      ))}
    </Stack>
  );
};
export default FormRenderer;
