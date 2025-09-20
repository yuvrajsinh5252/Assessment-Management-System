import { withAuth } from './httpClient.js';

export async function generateReport(sessionId, token) {
  const client = withAuth(token);
  const { data } = await client.post('/generate-report', { session_id: sessionId });
  return data;
}

export async function fetchSessions(token) {
  const client = withAuth(token);
  const { data } = await client.get('/sessions');
  return data;
}
