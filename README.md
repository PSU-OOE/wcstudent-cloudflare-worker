# Cloudflare Worker for the wcstudent application
The wcstudent application must set a long-lived cookie for helping to determine end-user affliation(s) with the University.  This is challenging for a couple reasons:

## Apple Intelligent Tracking Prevention (ITP)
Apple's ITP feature in the Safari web browser has severe limitations applied in that first-party cookies set through `document.cookie` will expire in 7 days in a **best case scenario**. Certain conditions may force such cookies to expire in 24 hours.

## Acquia's Infrastructure
The Acquia infrastructure (that is, the hosting provider of the wcstudent application) actively strips all `Set-Cookie` HTTP headers from responses for anonymous users.  When this application was migrated from on-prem to cloud based hosting back in 2017, we were forced to start using the `document.cookie` to set many cookies.  Since then, this strategy has been becoming less effective progressively.

Acquia does not allow for any customizations to the Varnish configuration that would normally be able to be used to meet this requirement.

## Web Vitals Performance
We strive to stay "in the green" with web vitals in order to reap the SEO benefits that come from having a fast site as recorded in the Chrome User Experience Report.  Disabling full page cache in order to set durable first-party cookies for anonymous users is not an acceptable solution.

# What's the path forward?
Given the preconditions, the chosen solution was to utilize Cloudflare Workers to provide a mechanism that allows us to set long-lived cookies for anonymous users without sacrificing the performance that we've worked so hard to achieve.

## Cloudflare Worker
This worker acts as a cookie setter, and redirection service.  It listens to requests coming in on https://\*student.worldcampus.psu.edu/affiliation/student\* and will run the following logic:

1. Read the visitor's current affiliations.
2. If the user does not have a student affiliation in their `acquia_a` cookie, add it to the affiliations.
3. If there is a "destination" query parameter, treat the query parameter as a relative URL to the current origin, else assume `/`.
4. Send a _HTTP/302_ response with an appropriate `Set-Cookie` and `Location` header based on #2 and #3. 
5. If anything at all goes wrong, send a _HTTP/400_ response.

This worker is intended to respond to links that current students will visit in email correspondence from the University.
