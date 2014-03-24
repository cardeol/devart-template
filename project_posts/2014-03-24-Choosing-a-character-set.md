The character set is the set of all ASCII characters which are capable of appearing in the generated ASCII artwork. 

Prior to the conversion process, each character in the specified character set will be analyzed using an specific font with fixed width. 

We are experimenting using [Web Fonts API](https://developers.google.com/fonts/ "Web Fonts API") with fonts like ["Ubuntu Mono"](https://www.google.com/fonts/specimen/Ubuntu+Mono "Ubuntu Mono") or Courier New.

```
<link href='//fonts.googleapis.com/css?family=Ubuntu+Mono' rel='stylesheet' type='text/css'>
``` 

Therefore, it is important that the character set be chosen with care.

```
 var palette = " .:,;+ijtfLGDKW#";
 var charSet = palette.split("");
```

This means that the first character " " represents the lightest color, and "#" the darkest using this formula and scale it to the array lenght.


```
  bright = (0.299 * Red + 0.587 * Green + 0.114 * Blue) / 255;
  // Red, Green and Blue has possible values between 0 to 255.
  
  // to get the index in relation to the palette lenght 
   cIndex = (palette.lenght - 1) - Math.round(bright * (palette.lenght - 1));
  
  // Finally 
  
  // character reperesentation of the brightness in a particular pixel
  var myFinalCharacter = charSet[cIndex];  
```





