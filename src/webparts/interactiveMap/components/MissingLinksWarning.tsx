import * as React from 'react';
import { MessageBar, MessageBarButton, MessageBarType } from '@fluentui/react';
import * as strings from 'InteractiveMapWebPartStrings';
import styles from './InteractiveMap.module.scss';

export interface IMissingLinksWarningProps {
  /** UFs still without a valid link. */
  ufs: readonly string[];
  /** Opens the property pane. */
  onConfigure: () => void;
}

/**
 * F4: edit-mode warning listing the states that still have no link. Loaded lazily by
 * InteractiveMap (only authors editing the page ever see it), so the Fluent UI code it pulls in
 * stays out of the bundle that every page visitor downloads.
 */
const MissingLinksWarning: React.FC<IMissingLinksWarningProps> = ({ ufs, onConfigure }) => (
  <MessageBar
    className={styles.missingLinks}
    messageBarType={MessageBarType.warning}
    isMultiline={true}
    actions={<MessageBarButton onClick={onConfigure}>{strings.ConfigureLinksButton}</MessageBarButton>}
  >
    {strings.MissingLinksWarning.replace('{0}', String(ufs.length)).replace('{1}', ufs.join(', '))}
  </MessageBar>
);

export default MissingLinksWarning;
