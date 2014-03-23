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


## Link to Prototype
Working on that

[Example Link](http://www.google.com "Example Link")

## Getting Webcam String
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
 NOTE: You can also use this space to link to external libraries or Github repositories you used on your project.

[Angularjs](http://angularjs.org/ "Angular JS")
[Twiiter Bootstrap](http://getbootstrap.com/ "Twitter Bootstrap")
[W3C Media Capture and Streams](http://dev.w3.org/2011/webrtc/editor/getusermedia.html "W3C Media Captura and Streams")

