import {SELF} from 'cloudflare:test';
import {describe, expect, it} from 'vitest';

describe('World Campus Student Cloudflare Worker', () => {

  it('responds with no affiliation if previously identified as a staff member', async () => {
    const request = new Request('https://example.com?affiliation=student');
    request.headers.set('Cookie', 'acquia_a=staff');
    const response = await SELF.fetch(request);
    expect(await response.headers.get('X-Affiliation')).equals(null);
  });

  it('responds with no affiliation if previously identified as a faculty member', async () => {
    const request = new Request('https://example.com?affiliation=student');
    request.headers.set('Cookie', 'acquia_a=faculty');
    const response = await SELF.fetch(request);
    expect(await response.headers.get('X-Affiliation')).equals(null);
  });

  it('responds with affiliation if a student affiliation link is visited', async () => {
    const response = await SELF.fetch('https://example.com?affiliation=student');
    expect(await response.headers.get('X-Affiliation')).equals('student');
  });
});
