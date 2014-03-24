The Matrix effect was maybe the most popular and mainstream form of Ascii art.
It was peculiar that it became popular in the late 90's and beginnings of 2000's, long time after the 80's where I first began to see it.
Nevertheless, it is different. It uses a lot of japanese characters and it is phosphorus green, with differences in the bright.

Without discussing it, we arrived at the same conclusion. That we should implement a matrix effect between the choices for the user.

The implementation itself it is not that difficult, it is an exception case in the renderer.
I imagine the streams as "snakes", each with different starting point, speed, and length.
Each "snake" is randomly generated, with bright chars in the head, which it dims as it goes to the bottom of the screen.
The chars before and after the snake are darkened to enhance the effect.

Also we implemented a color version of the matrix effect, with it renders an image closer to reality.

We managed to make it fast enough, reducing the usage of javascript and the HTML 5 canvases.

It needs improvement though.

Future improvements 
//TODO There should be several snakes in each column, specially when the snakes are short.
//TODO Make full screen version!
* The Matrix effect would look REALLY cool in a huge LCD display
- It would need a spot light in front of you and a dark background, for optimal performance.
