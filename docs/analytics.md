# Public website analytics

GA4 measurement ID: G-89HGJ92WHV. Only the apex and www production website hosts can load the tag. Admin, localhost and Pages previews are excluded.

The consent component loads one async Google tag in the head after Accept analytics. Decline blocks loading; Cookie settings lets visitors change their choice. Opting out disables the measurement ID and clears accessible GA cookies. No cookieless analytics pings are sent before acceptance. The implementation manually sends one page_view per pathname change, excluding query parameters, fragments, arbitrary paths, external referrers and document titles containing user data. Advertising personalisation and Google signals are disabled in tag configuration.

## Required GA4 property setting

In Google Analytics, Admin > Data streams > the website stream > Enhanced measurement, turn Enhanced measurement OFF. This implementation supplies page views itself. Automatic history page views would duplicate them; automatic site search or form measurement could capture information this implementation deliberately omits. Do not enable automatic form interactions or site search. No enquiry/conversion events are included in this installation.

Save the stream setting, open the public site, accept analytics and use Test installation / Realtime to verify reception. Local checks verify tag commands, consent and routes; they cannot prove events have arrived in the Analytics account. Declined visitors and blocked scripts will not appear.

References: https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications
