The main idea is creating a mirror to render video as ASCII characters using Javascript, 
so when you look at the camera you can see a video stream rendered in ASCII.


Our first test was using python, testing with a raspberry pi, then we changed to Javascript to make it more flexible.

First attempt in Python

```
from PIL import Image
import ImageFont, ImageDraw
import random
from bisect import bisect

# using the bisect class to put luminosity values
# in various ranges.


# print charset
def convertimage(imgfile):
    charset = list(" .,:;i1tfLCG8@")
    fontsize = 12
    im=Image.open(imgfile)
    or_w = im.size[0]
    or_h = im.size[1]
    ratio = float(or_h) / float(or_w)

    im=im.resize((80, 60),Image.BILINEAR)
    im=im.convert("L") # convert to mono

    im_w = im.size[0]
    im_h = im.size[1]

    basewidth = 300
    hsize = int(basewidth * ratio)
    print basewidth,hsize

    image=Image.new("RGB",[basewidth,hsize])
    draw = ImageDraw.Draw(image)
    font=ImageFont.truetype("clacon.ttf",fontsize)

    str=""
    clen = len(charset);
    if(im_w == 0):
        return

    ratio = im_h / im_w

    for y in range(0,im_h):
        for x in range(0,im_w):
            lum= 255 - im.getpixel((x,y))
            myc = (lum * (clen-1)) / 255;
            str=str+ charset[myc]
        draw.text((5, y* (fontsize + 1)), str, font=font)
        str=""
    image.save("result.png")



convertimage("test.jpg")


import Image
import ImageFont, ImageDraw
image=Image.new("RGB",[320,320])
draw = ImageDraw.Draw(image)
font=ImageFont.truetype("/Library/Fonts/Arial Unicode.ttf",14)
draw.text((50, 50), a, font=font)
image.save("a.png")

zonebounds=[36,72,108,144,180,216,252]

# open image and resize
# experiment with aspect ratios according to font


# now, work our way over the pixels
# build up str

str=""
for y in range(0,im.size[1]):
    for x in range(0,im.size[0]):
        lum=255-im.getpixel((x,y))
        row=bisect(zonebounds,lum)
        possibles=greyscale[row]
        str=str+possibles[random.randint(0,len(possibles)-1)]
    str=str+"\n"

print str
```

Changing to javascript...


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
