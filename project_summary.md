```
     /\    / ____|/ ____|_   _|_   _| |  \/  |_   _|  __ \|  __ \ / __ \|  __ \ 
    /  \  | (___ | |      | |   | |   | \  / | | | | |__) | |__) | |  | | |__) |
   / /\ \  \___ \| |      | |   | |   | |\/| | | | |  _  /|  _  /| |  | |  _  / 
  / ____ \ ____) | |____ _| |_ _| |_  | |  | |_| |_| | \ \| | \ \| |__| | | \ \ 
 /_/    \_\_____/ \_____|_____|_____| |_|  |_|_____|_|  \_\_|  \_\\____/|_|  \_\
```                                                                              
                                                                                
## Authors
- Carlos De Oliveira - @cardeol (github) - cardeol@gmail.com 
- Esteban Garcia Alonso - @estebangarciaalonso (github) - estebanjgarcia@gmail.com

## Description
The main idea is creating a mirror to render video as ASCII characters using Javascript, so when you look at the camera you can see a video stream rendered in ASCII.


![Example Image](https://raw.githubusercontent.com/cardeol/devart-template/master/project_images/womanascii.jpg "ASCII Video rendered in realtime")


## Link to Prototype (best experience in Chrome)

[index.html](https://dl.dropboxusercontent.com/u/11648849/ascii/index.html "index.html")

## Getting the Video Stream

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

## Links to External Libraries
 
[Angularjs](http://angularjs.org/ "Angular JS")
[Twiiter Bootstrap](http://getbootstrap.com/ "Twitter Bootstrap")
[W3C Media Capture and Streams](http://dev.w3.org/2011/webrtc/editor/getusermedia.html "W3C Media Captura and Streams")
[HTML Canvas 2D Context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/ "HTML Canvas 2D Context")
