This is AnyViewer, a kiosk-style website that displays a set of URLs in order
and with animation.

To start, make a clone of this repository somewhere on a static web server and
modify the tabs.json to contain an array of entries like this:

    {
      url: 'http://google.com/',
      seconds: 20
    }

The entries will be shown in order, starting with the first one, waiting
`seconds` seconds, then moving on to the next one. The file is re-requested for
every move, so changes to the file will be applied as soon as the next tab
loads.

If any error occurs during the load of this file (including an empty array of
tabs), the code will try again after a second. If a tab fails to load, for
example because a request to its URL times out, it will be skipped. By default,
a timeout is diagnosed after the URL did not load in ten seconds; this can be
changed for specific tabs by setting their 'timeout' property to the number of
seconds. You can set this to a short amount for pages that should load quickly,
or to a large amount for pages that you know can take a while to load:

    {
      url: 'http://slowy.example.org/generateStatistics',
      seconds: 20,
      timeout: 20
    }
