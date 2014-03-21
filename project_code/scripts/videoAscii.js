var videoAscii = (function() {

    var charSet = (" .,:;i1tfLCG8@").split("");
    charSet = (" .,:;o8#@").split("");
    charSet = (".:,;+ijtfLGDKW#").split("");

    var clen = charSet.length - 1;

    var strFont = "courier new";
    var options = {
        iScale: 1,
        bColor: true,
        bAlpha: false,
        bBlock: false,
        bInvert: false,
        strResolution: "medium"
    }


    var img2asc = function(oCanvasImg) {
        var oCanvas = document.createElement("canvas");
        if (!oCanvas.getContext) {
            return;
        }
        var oCtx = oCanvas.getContext("2d");
        if (!oCtx.getImageData) {
            return;
        }




        var fResolution = 1;
        switch (options.strResolution) {
            case "low":
                fResolution = 0.25;
                break;
            case "medium":
                fResolution = 0.4;
                break;
            case "high":
                fResolution = 1;
                break;
        }

        var iWidth = parseInt(Math.round(800 * fResolution));
        var iHeight = parseInt(Math.round(600 * fResolution));

        oCanvas.width = iWidth;
        oCanvas.height = iHeight;
        oCanvas.style.display = "none";
        oCanvas.style.width = iWidth;
        oCanvas.style.height = iHeight;

        oCtx.drawImage(oCanvasImg, 0, 0, iWidth, iHeight);
        var oImgData = oCtx.getImageData(0, 0, iWidth, iHeight).data;

        var strChars = "";
        lines = [];
        for (var y = 0; y < iHeight; y += 2) {
            strChars = "";
            for (var x = iWidth; x > 0; x--) {
                var iOffset = (y * iWidth + x) * 4;

                var iRed = oImgData[iOffset];
                var iGreen = oImgData[iOffset + 1];
                var iBlue = oImgData[iOffset + 2];
                var iAlpha = oImgData[iOffset + 3];

                if (iAlpha == 0) {
                    var iBrightIdx = 0;
                } else {
                    var fBrightness = (0.3 * iRed + 0.59 * iGreen + 0.11 * iBlue) / 255;
                    var iCharIdx = Math.round(fBrightness * (charSet.length - 1));

                    //var col = (iRed + iGreen + iBlue) / 3;
                    //var iCharIdx = clen - Math.round((col * clen) / 255);
                }

                if (options.bInvert) {
                    iCharIdx = (charSet.length - 1) - iCharIdx;
                }
                var strThisChar = charSet[iCharIdx];
                // strThisChar = getGrayShade(col);
                if (strThisChar == "undefined") continue;

                if (strThisChar == " ")
                    strThisChar = "&nbsp;";

                if (options.bColor && false) {
                    strChars += "<span style='" + "color:rgb(" + iRed + "," + iGreen + "," + iBlue + ");" + (options.bBlock ? "background-color:rgb(" + iRed + "," + iGreen + "," + iBlue + ");" : "") + (options.bAlpha ? "opacity:" + (iAlpha / 255) + ";" : "") + "'>" + strThisChar + "</span>";
                } else {
                    if (strThisChar == "undefined") {
                        isPlaying = false;
                    }
                    strChars += strThisChar;
                }
            }
            if (strChars.indexOf("undefined") == -1) lines.push(strChars + "<br />");
        }


        var fFontSize = (2 / fResolution) * options.iScale + 1;
        var fLineHeight = (2 / fResolution) * options.iScale + 1;

        var fLetterSpacing = 0;
        if (options.strResolution == "low") {
            switch (options.iScale) {
                case 1:
                    fLetterSpacing = -1;
                    break;
                case 2:
                case 3:
                    fLetterSpacing = -2.1;
                    break;
                case 4:
                    fLetterSpacing = -3.1;
                    break;
                case 5:
                    fLetterSpacing = -4.15;
                    break;
            }
        }
        if (options.strResolution == "medium") {
            switch (options.iScale) {
                case 1:
                    fLetterSpacing = 0;
                    break;
                case 2:
                    fLetterSpacing = -1;
                    break;
                case 3:
                    fLetterSpacing = -1.04;
                    break;
                case 4:
                case 5:
                    fLetterSpacing = -2.1;
                    break;
            }
        }
        if (options.strResolution == "high") {
            switch (options.iScale) {
                case 1:
                case 2:
                    fLetterSpacing = 0;
                    break;
                case 3:
                case 4:
                case 5:
                    fLetterSpacing = -1;
                    break;
            }
        }


        // can't get a span or div to flow like an img element, but a table works?
        var oAscii = document.createElement("table");
        oAscii.innerHTML = "<tr><td>" + lines.join("") + "</td></tr>";

        /*if (oImg.style.backgroundColor) {
        oAscii.rows[0].cells[0].style.backgroundColor = oImg.style.backgroundColor;
        oAscii.rows[0].cells[0].style.color = oImg.style.color;
    }*/

        oAscii.cellSpacing = 0;
        oAscii.cellPadding = 0;

        var oStyle = oAscii.style;
        oStyle.display = "inline";
        oStyle.width = Math.round(iWidth / fResolution * options.iScale) + "px";
        oStyle.height = Math.round(iHeight / fResolution * options.iScale) + "px";
        oStyle.whiteSpace = "pre";
        oStyle.margin = "0px";
        oStyle.padding = "0px";
        oStyle.letterSpacing = fLetterSpacing + "px";
        oStyle.fontFamily = strFont;
        oStyle.fontSize = fFontSize + "px";
        oStyle.lineHeight = fLineHeight + "px";
        oStyle.textAlign = "left";
        oStyle.textDecoration = "none";

        //oImg.parentNode.replaceChild(oAscii, oImg);
        if (public.onComplete != null) public.onComplete(oAscii);
    }

    var public = {
        init: function(rData) {
            var oCanvasImg = new Image();
            oCanvasImg.src = rData;
            if (oCanvasImg.complete) {
                img2asc(oCanvasImg);
            } else {
                oCanvasImg.onload = function() {
                    img2asc(oCanvasImg)
                }
            }
        },
        create: function(image) {
            img2asc(image);
        },
        setBcolor: function(v) {
            options.bColor = v;
        },
        setBalpha: function(v) {
            options.bAlpha = v;
        },
        setBblock: function(v) {
            options.bBlock = v;
        },
        setBinvert: function(v) {
            options.bInvert = v;
        },
        onComplete: null,
        options: options
    }
    return public;
})();