import { JsonTemplateSchema } from './schema.types';

const DEMO_SCHEMA: JsonTemplateSchema = {
  version: '1',
  origin: true,
  name: 'demo',
  members: [
    {
      type: 'transitionmodal',
      props: {
        title: 'Processing Tasks',
        transitionText: 'S-VOL creation, mapping and discovery processes',
        successText: 'S-VOL creating, mapping and discovery processes'
      },
    },
    {
      type: 'input',
      props: {
        label: 'Input Demo',
        name: 'input'
      }
    },
    {
      type: 'input',
      props: {
        label: 'Disabled Input',
        name: 'disabled_input',
        defaultValue: 'Any input member can use the disabled property.',
        disabled: true
      }
    },
    {
      type: 'password',
      props: {
        label: 'Password Input Demo',
        name: 'password'
      }
    },
    {
      type: 'select',
      props: {
        label: 'Select Input Demo',
        name: 'select',
        options: [
          {
            display: 'Lorem',
            value: 'lorem'
          },
          {
            display: 'Ipsum',
            value: 'ipsum'
          },
          {
            display: 'Dolar',
            value: 'dolar'
          }
        ]
      }
    },
    {
      type: 'select',
      props: {
        label: 'Multiple Select With Default',
        name: 'multi_select_default_val',
        defaultValue: ['lorem'],
        multiple: true,
        options: [
          {
            display: 'Lorem',
            value: 'lorem'
          },
          {
            display: 'Ipsum',
            value: 'ipsum'
          },
          {
            display: 'Dolar',
            value: 'dolar'
          }
        ]
      }
    },
    {
      type: 'select',
      props: {
        label: 'Select With Default',
        name: 'select_default_val',
        defaultValue: 'lorem',
        options: [
          {
            display: 'Lorem',
            value: 'lorem'
          },
          {
            display: 'Ipsum',
            value: 'ipsum'
          },
          {
            display: 'Dolar',
            value: 'dolar'
          }
        ]
      }
    },
    {
      type: 'autocomplete',
      props: {
        multiple: true,
        freeSolo: true,
        label: 'Multiple Freesolo',
        name: 'multipleFreeSolo',
        options: ['foo', 'bar', 'baz'],
        defaultValue: ['foo', 'bar', 'something else']
      }
    },
    {
      type: 'autocomplete',
      props: {
        multiple: true,
        freeSolo: false,
        label: 'Multiple Options Only',
        name: 'multipleOptionsOnly',
        options: ['foo', 'bar', 'baz'],
        defaultValue: ['foo', 'baz']
      }
    },
    {
      type: 'autocomplete',
      props: {
        multiple: false,
        freeSolo: true,
        label: 'Single Freesolo',
        name: 'singleFreesolo',
        options: ['foo', 'bar', 'baz']
      }
    },
    {
      type: 'autocomplete',
      props: {
        multiple: false,
        freeSolo: false,
        label: 'Single Options Only',
        name: 'singleOptionsOnly',
        defaultValue: 'bar',
        options: ['foo', 'bar', 'baz']
      }
    },
    {
      type: 'checkbox',
      props: {
        name: 'cool',
        label: 'Cool'
      }
    },
    {
      type: 'tabledictionary',
      props: {
        name: 'tabledirectionary-singleselect',
        label: 'Primary Volume Single Select',
        required: false,
        disabled: false,
        multiSelect: false,
        searchPlaceholder: 'Cool Search!',
        defaultValue: {
          'primaryVolume': 'Bravo',
          'secondaryVolume': 'something else',
          'datastoreUuid': 'uuid1'
        },
        primaryColumnDef: {
          field: 'primaryVolume',
          headerName: 'Primary Volume'
        },
        secondaryColumnDef: [
          {
            field: 'secondaryVolume',
            headerName: 'Secondary Volume'
          },
          {
            field: 'datastoreUuid',
            headerName: 'Datastore UUID'
          }
        ],
        rows: [
          {
            primaryVolume: 'Alfa',
            secondaryVolume: '',
            datastoreUuid: ''
          },
          {
            primaryVolume: 'Bravo',
            secondaryVolume: '',
            datastoreUuid: ''
          },
          {
            primaryVolume: 'Charlie',
            secondaryVolume: '',
            datastoreUuid: ''
          },
          {
            primaryVolume: 'Delta',
            secondaryVolume: '',
            datastoreUuid: ''
          }
        ]
      }
    },
    {
      type: 'tabledictionary',
      props: {
        name: 'tabledirectionary-multiselect',
        label: 'Primary Volume Multi Select',
        required: true,
        disabled: false,
        multiSelect: true,
        searchPlaceholder: 'Cool Search!',
        defaultValue: [
          {
            primaryVolume: 'Alfa',
            secondaryVolume: 'Something Else',
            datastoreUuid: 'uuid1'
          },
          {
            primaryVolume: 'Charlie',
            secondaryVolume: 'Something Other',
            datastoreUuid: 'uuid2'
          }
        ],
        primaryColumnDef: {
          field: 'primaryVolume',
          headerName: 'Primary Volume'
        },
        secondaryColumnDef: [
          {
            field: 'secondaryVolume',
            headerName: 'Secondary Volume'
          },
          {
            field: 'datastoreUuid',
            headerName: 'Datastore UUID'
          }
        ],
        rows: [
          {
            primaryVolume: 'Alfa',
            secondaryVolume: '',
            datastoreUuid: ''
          },
          {
            primaryVolume: 'Bravo',
            secondaryVolume: '',
            datastoreUuid: '',
            disabled: true
          },
          {
            primaryVolume: 'Charlie',
            secondaryVolume: '',
            datastoreUuid: ''
          },
          {
            primaryVolume: 'Delta',
            secondaryVolume: '',
            datastoreUuid: ''
          }
        ]
      }
    },
    {
      type: 'coupledinput',
      props: {
        name: 'coupledinput',
        label: 'Coupled Input Test',
        required: false,
        disabled: false,
        defaultValue: {
          primaryInput: '1',
          secondarySelect: 'day'
        },
        secondaryInputOptions: [
          {
            display: 'Day(s)',
            value: 'day'
          },
          {
            display: 'Hour(s)',
            value: 'hour'
          }
        ]
      }
    }
  ]
};

export const DEMO_JSON = JSON.stringify(DEMO_SCHEMA, null, 2); // eslint-disable-line
