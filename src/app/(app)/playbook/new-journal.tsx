/**
 * Redirect: new-journal → new-entry?type=journal
 * Preserves backward compatibility for any existing routes.
 */
import { Redirect } from 'expo-router';

export default function NewJournalRedirect() {
  return <Redirect href="/(app)/playbook/new-entry?type=journal" />;
}
