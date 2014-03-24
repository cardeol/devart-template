The main idea is creating a mirror to render video as ASCII characters using Javascript, 
so when you look at the camera you can see a video stream rendered in ASCII.

## Getting the Video Stream (updated to HTML 5)

We were using a flash proxy in the beginning to capture a video stream and send it to a html5 img using javascript with a bas64 src. We have changed to a better scheme using getUserMedia (available in modern browsers).

All the code is processed in the client side by javascript. We choose to use getUser Media to render a &lt;video&gt; tag in this way.

```
  navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
```


Formula in javascript to get a pixel brightness by RGB.

```
var bright = (0.299 * Red + 0.587 * Green + 0.114 * Blue) 
```
