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
loads. If any error occurs during the load of this file (including an empty
array of tabs), the code will try again after a second.
