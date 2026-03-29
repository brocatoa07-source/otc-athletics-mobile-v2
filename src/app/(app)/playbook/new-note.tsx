/**
 * Redirect: new-note → new-entry?type=note
 * Preserves backward compatibility for any existing routes.
 */
import { Redirect } from 'expo-router';

export default function NewNoteRedirect() {
  return <Redirect href="/(app)/playbook/new-entry?type=note" />;
}
