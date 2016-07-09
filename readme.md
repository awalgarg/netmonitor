# netmonitor

**A Chrome extension which shows background network activity of web pages after they are loaded.**

The "loading" icon for tabs in browsers only spins while the page is loading.  Web pages can do network IO via JavaScript in background without the user knowing, even after the first page load.  This extension highlights such network activity and shows a count of requests performed till now by the page in a small indicator.  It is updated in real-time for each tab.

A lot of web pages use background network requests for tracking user actions and sending data to remote servers, lazily loading heavy assets, etc., and all that goes unnoticed by the user. Ideally, the browser's "loading icon" should spin for those requests as well, but since it doesn't, I wrote this extension.

### Screenshots

Web page constantly making requests even after page load:

![](./screenshots/netmonitor-state-making-requests.png)

*note the hexagonal red icon and the request count*

Simple and good web page which makes two requests at load and then does nothing:
![](./screenshots/netmonitor-state-done.png)

*simple network icon with request count*


### Author

Awal Garg <awalgarg@gmail.com>, [@awalGarg](https://twitter.com/awalGarg)

### License

[WTFPL](http://www.wtfpl.net/)
