export interface ServerCertificate {
  certificate: string;
  date_uploaded: string;
}

export interface PublicKey {
  kid: string;
  algorithm: string;
  value: any;
}

export interface OidcConfig {
  base_url?: string;
  oidc_enabled?: boolean;
  realm?: string;
  server_certificates?: Array<ServerCertificate>;
  public_keys?: Array<PublicKey>;
}
