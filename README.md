# Cloudflare Worker for the wcstudent application
The wcstudent application must set a long-lived cookie for helping to determine end-user affliation(s) with the University.

Since the expectation is that anonymous visitors to the site are served cached document responses from a content delivery network, a worker must be used to set such a cookie in a secure fashion.

Test commit!
