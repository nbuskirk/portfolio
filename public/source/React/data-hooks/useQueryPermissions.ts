import { API } from 'utils/helpers/api';
import { useQuery } from '@tanstack/react-query';
import { ROLE_PERMISSIONS } from 'constants/queryKeys';

export type Privilege =
  | 'admin' // Perform administrative actions
  | 'security' // Create/modify/delete/activate/deactivate users and roles
  | 'ingestion' // May ingest via Tape Manager or LAN Indexer, May visit the Process Data application
  | 'configure' // Control the indexing, extraction, collection, and segment configuration of an engine
  | 'logs' // View system logs
  | 'search' // Use the search application
  | 'readall' // Grants the user to include any index entry as a search result without regard to its ACL
  | 'content' // Query and reconstruct content of documents in search results
  | 'reports' // Use the reports application
  | 'storedq' // View/load saved queries
  | 'configindex' // Visit and modify indexing service options such as ingestion mode and file filter enable/disable status
  | 'preferences' // Change index/project preferences within the search UI
  | 'seebackup' // See backup information
  | 'tagging' // Add or remove tags, may run action queries that add or remove tags
  | 'archive' // Add and edit archive location which used to keep nfs and cifs mounts active
  | 'csvfile' // Do CSV download of query results
  | 'extract' // Create extract jobs and see job status
  | 'results' // See query results
  | 'reconstruct' // See query result reconstruction and filter on details there
  | 'summaryreport' // See query reports and create a CSV downloads
  | 'editfilters' // Modify the filters stack//panel, and filter on summary reports if applicable, may upload filters
  | 'editquery' // Make the query box editable and fill in a free//form query, may upload a query
  | 'locations' // Sees the locations stack//panel in search application
  | 'tapeconfig' // Change device settings within Tape Manager, but may not alter other configure
  | 'editstoredq' // View or add or save or delete saved queries
  | 'editlocations' // Modify the locations checkbox tree in locations panel of search application
  | 'delete' // Run action queries that affect delete/undelete
  | 'ingestionrun' // Run indexing jobs, and take certain other actions affecting index segments, etc
  | 'actionq' // View or run action queries
  | 'editactionq' // View or create or modify or delete action queries
  | 'configsystem' // Modify the network and system configuration of engine
  | 'setowner' // Change the owner of an object
  | 'addrmcollection' // create/delete collections
  | 'editcollection' // edit collections
  | 'deletefromlan' // Delete files from file servers
  | 'productiononly' // Manage productions
  | 'alertmgmt' // Can do alert configuration, clear alert, enable/disable emailnotifiactions, access special criteria
  | 'thresholdmgmt' // Configure/edit/delete activity_alert_levels and thresholds, configure and edit rss threasholds
  | 'usermgmt' // Create/update/delete users, get roles
  | 'netsecmgmt' // Configure active directory, upload security certificates, diagnostics and reporting, Login settings
  | 'indexmgmt' // Index maintainance settings
  | 'policyjob' // Run indexing
  | 'querymgmt' // Create/edit jobinstances and jobdefinations
  | 'licensemgmt' // Setup License
  | 'enginemgmt'; // Configure scratch storage

interface RolePermissionsReturnData {
  privileges: Array<Privilege>;
}

export const getPermissions = (fedid: string, roleId: number) => () =>
  API.get<RolePermissionsReturnData>(
    `/federations/${fedid}/roles/${roleId}`
  ).then((res) => res.data);

export const getPermissionsQuery = (fedid?: string, roleId?: number) =>
  ({
    queryKey: [ROLE_PERMISSIONS, fedid, roleId],
    queryFn: getPermissions(fedid!, roleId!),
    enabled: fedid !== undefined && roleId !== undefined
  }) as const;

interface Params {
  fedid?: string;
  roleId?: number;
}

const useQueryPermissions = ({ fedid, roleId }: Params) => {
  return useQuery(getPermissionsQuery(fedid, roleId));
};

export default useQueryPermissions;
