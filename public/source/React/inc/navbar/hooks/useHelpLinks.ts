import useCustomization from 'data-hooks/config/useCustomization';

const helpLinks = {
  'default': [
    {
      'name': 'Web Help',
      'href': '/docs/webhelp'
    },
    {
      'name': 'Index Engines Support',
      'href': 'https://indexengines.com/support'
    }
  ],
  'dell': [
    {
      'name': 'Web Help',
      'href': '/docs/webhelp'
    }
  ],
  'hitachi': [
    {
      'name': 'Web Help',
      'href': '/docs/webhelp'
    }
  ],
  'ibm': [
    {
      'name': 'IBM Documentation',
      'href': 'https://www.ibm.com/docs/storage-sentinel'
    },
    {
      'name': 'IBM Support',
      'href': 'https://www.ibm.com/mysupport/s/?language=en_US'
    }
  ],
  'infinidat': [
    {
      'name': 'Support',
      'href':
        'https://support.infinidat.com/hc/en-us/sections/13313685478045-InfiniSafe-Cyber-Detection'
    }
  ]
} as const;

const vendorIsKnown = (vendor: string): vendor is keyof typeof helpLinks => {
  return Object.keys(helpLinks).includes(vendor);
};

interface HelpLinksReturn {
  isLoading: boolean;
  helpLinks: (typeof helpLinks)[keyof typeof helpLinks] | [];
  error?: Error;
}

const useHelpLinks = (): HelpLinksReturn => {
  const {
    data: customizationData,
    isLoading: customizationIsLoading,
    error: customizationDataError,
    isError
  } = useCustomization();

  // If loading return default structure
  if (customizationIsLoading) {
    return {
      isLoading: true,
      helpLinks: [],
      error: undefined
    };
  }

  if (isError) {
    return {
      isLoading: false,
      helpLinks: [],
      error: customizationDataError as Error
    };
  }

  const vendor = customizationData?.vendor ?? '';

  // if the vendor has customization, use it
  if (vendorIsKnown(vendor)) {
    return {
      isLoading: false,
      helpLinks: helpLinks[vendor],
      error: undefined
    };
  }

  // Otherwise use default
  return {
    isLoading: false,
    helpLinks: helpLinks.default,
    error: undefined
  };
};

export default useHelpLinks;
