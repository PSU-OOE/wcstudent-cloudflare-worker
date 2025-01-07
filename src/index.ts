export default {

  async fetch(request: Request): Promise<Response> {

    // Multiple affiliations are packed into a single cookie because there are
    // a finite number of cookies that can be used to segment and personalize
    // the user journey on the Acquia platform.
    //
    // See https://docs.acquia.com/acquia-cloud-platform/performance/varnish/cookies
	  const STUDENT_AFFILIATION_MASK = 0x1;
    // const STAFF_AFFILIATION_MASK = 0x2;
    // const MILITARY_AFFILIATION_MASK = 0x4;

    // Assume no prior affiliations initially.
    let affiliations = 0x0;

    // If there is already an affiliation, use that instead.
    const cookieString = request.headers.get('Cookie') ?? '';
    const cookies = cookieString.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'acquia_a') {
        affiliations = Number(value);
        break;
      }
    }

    // Add the student affiliation.
    affiliations |= STUDENT_AFFILIATION_MASK;

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
        'Location': origin + ((new URLSearchParams(search)).get('destination') ?? '/'),
        'Set-Cookie': 'acquia_a=' + String(affiliations) + '; Max-Age=34560000; Path=/; Domain=.worldcampus.psu.edu; Secure',
        'X-Affiliations': String(affiliations),
      }
    });
  },
} satisfies ExportedHandler;
