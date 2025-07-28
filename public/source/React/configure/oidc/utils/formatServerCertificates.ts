import { ServerCertificate } from 'data-hooks/oidc/oidcConfig.types';

export interface ServerCertificateFormatted extends ServerCertificate {
  id: number;
  parsedCertificate: string;
  dateUploadedFormatted: string;
}

const formatServerCertificate = (
  serverCertificates: ServerCertificate[]
): ServerCertificateFormatted[] => {
  let i = 1;
  return serverCertificates.map((cert) => {
    const newCert = {
      ...cert,
      id: i,
      dateUploadedFormatted: cert.date_uploaded,
      parsedCertificate: cert.certificate
        .replace(/-+BEGIN CERTIFICATE-+/, '')
        .replace(/-+BEGIN(.+)KEY-+/, '')
    };
    i += 1;
    return newCert;
  });
};

export default formatServerCertificate;
