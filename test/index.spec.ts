import {SELF} from 'cloudflare:test';
import {describe, expect, it} from 'vitest';

describe('World Campus Student Cloudflare Worker', () => {

  it('adds the student affiliation if the user is unaffiliated', async () => {
    const request = new Request('https://example.com');
    const response = await SELF.fetch(request, { redirect: 'manual' });
    expect(await response.headers.get('X-Affiliations')).equals('Student');
  });

  it('adds the student affiliation to existing staff affiliation', async () => {
    const request = new Request('https://example.com');
    request.headers.set('Cookie', 'acquia_a=Staff');
    const response = await SELF.fetch(request, { redirect: 'manual' });
    expect(await response.headers.get('X-Affiliations')).equals('Staff,Student');
  });

  it('adds the student affiliation to existing military affiliation', async () => {
    const request = new Request('https://example.com');
    request.headers.set('Cookie', 'acquia_a=Military');
    const response = await SELF.fetch(request, { redirect: 'manual' });
    expect(await response.headers.get('X-Affiliations')).equals('Military,Student');
  });

  it('adds the student affiliation to existing staff + military affiliations', async () => {
    const request = new Request('https://example.com');
    request.headers.set('Cookie', 'acquia_a=Military,Staff');
    const response = await SELF.fetch(request, { redirect: 'manual' });
    expect(await response.headers.get('X-Affiliations')).equals('Military,Staff,Student');
  });

  it('redirects to the homepage if no destination is provided', async () => {
    const request = new Request('https://example.com');
    const response = await SELF.fetch(request, { redirect: 'manual' });
    expect(await response.headers.get('Location')).equals('https://example.com/');
  });

  it('redirects to a custom destination if provided', async () => {
    const request = new Request('https://example.com?destination=/custom-url');
    const response = await SELF.fetch(request, { redirect: 'manual' });
    expect(await response.headers.get('Location')).equals('https://example.com/custom-url');
  });

});
