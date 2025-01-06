export default {
  async fetch(request: Request): Promise<Response> {

    // Fetch the original response from the origin server
    let response: Response = await fetch(request);

    let faculty_or_staff = false;
    const cookieString = request.headers.get('Cookie') ?? '';
    const cookies = cookieString.split(';');
    for (const cookie of cookies) {
      if (cookie === 'acquia_a=staff' || cookie === 'acquia_a=faculty') {
        faculty_or_staff = true;
        break;
      }
    }

    // Only set the student affiliation for non-faculty, non-staff members.
    if (!faculty_or_staff) {
      response = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      response.headers.append('Set-Cookie', 'acquia_a=student; Max-Age=31536000; Path=/; Domain=.' + new URL(request.url).hostname + '; HttpOnly');
      response.headers.set('X-Affiliation', 'student');
    }

    return response;
  },
} satisfies ExportedHandler;
