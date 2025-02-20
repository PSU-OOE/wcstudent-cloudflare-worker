export default {
  async fetch(request) {
    // Multiple affiliations are packed into a single cookie because there are
    // a finite number of cookies that can be used to segment and personalize
    // the user journey on the Acquia platform.
    //
    // See https://docs.acquia.com/acquia-cloud-platform/performance/varnish/cookies

    // Assume no prior affiliations initially.
    let affiliations = [];

    // If there is already an affiliation, use that instead.
    const cookieString = request.headers.get('Cookie') ?? '';
    const cookies = cookieString.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=').map(c => c.trim());
      if (name === 'acquia_a') {
        affiliations = value.split(',');
        break;
      }
    }

    // Add the student affiliation (if not already present).
    if (!affiliations.includes('Student')) {
      affiliations.push('Student');
    }

    // Sort in ascending order to reduce variations.
    affiliations.sort();

    // Extract several parts of the original request...
    const { origin, search } = new URL(request.url);

    // Redirect to the proper location while setting a long-lived affiliation
    // cookie. The cookie is set on the .worldcampus.psu.edu domain for ~13
    // months -- the practical maximum age that cookies can live for. If no
    // destination query parameter was provided, redirect the user to the
    // origin homepage.
    return new Response(null, {
      status: 302,
      headers: {
        'Location': origin + '/' + ((new URLSearchParams(search)).get('destination') ?? '/').trim('/'),
        'Set-Cookie': 'acquia_a=' + affiliations.join(',') + '; Max-Age=34560000; Path=/; Domain=.worldcampus.psu.edu; Secure',
        'X-Affiliations': affiliations.join(','),
      }
    });
  },
};
