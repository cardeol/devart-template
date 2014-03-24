var myApp = angular.module('app', ['ui.bootstrap']);

myApp.controller('mainController', function($scope, $sce) {
    $scope.rendering = false;
    $scope.options = {
        iScale: 2,
        flipH: true,
        opt_motion: false,
        opt_block: false,
        opt_invert: false,
        opt_color: false,
        opt_matrix: false,
        height: 300,
        width: 400,
        fLetterSpacing: 0,
        fResolution: 0.25,
        strResolution: 'low'
    };
    //Patch for the watchCollectionsBug
    $scope.prevOptions = angular.copy($scope.options);

    var defCharList = (" .:,;+ijtfLGDKW#").split("");
    var matrixMiddleCharLists = [(" .,:;i1tfLCG08").split(""), (" _,-;i1tPTEB0D").split("")];
    var matrixBeginCharList = [String.fromCharCode(0x30D9), String.fromCharCode(0x30DA), String.fromCharCode(0x30DB), String.fromCharCode(0x30DB)];
    var ctx = q.getContext('2d');
    var oCanvas = document.createElement("canvas");
    var oCtx = oCanvas.getContext("2d");
    var imgHash = {};
    var aDefaultColorCharList = (" CGO08@").split("");
    var width = parseInt(Math.round($scope.options.width * $scope.options.iScale));
    var height = parseInt(Math.round($scope.options.height * $scope.options.iScale));
    var currentBackColor = '#FFFFFF';
    var video = document.querySelector('video');
    // var videoCanvas = document.getElementById('videoCanvas');
    // var videoCtx = videoCanvas.getContext('2d');
    var fLineHeight;
    var errorCallback = function(e) {
        var message = "ERROR: " + e;
        alert(message);
    };

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({
            video: true,
            audio: false
        }, function(stream) {
            video.src = window.URL.createObjectURL(stream);
        }, errorCallback);
    } else {
        video.src = 'somevideo.webm';
    }

    $scope.initLoop = function() {
        $scope.initVideo();
    };

    $scope.onComplete = function() {
        if ($scope.rendering) {
            setTimeout(function() {
                $scope.initLoop();
            }, 0);
        }
    };
    $scope.$watch('rendering', function(newValue, oldValue) {
        if (newValue == true) {
            $scope.initLoop();
        }
    });
    $scope.$watchCollection('options', function(newValue, oldValue) {
        oldValue = $scope.prevOptions;

        if (newValue.opt_matrix != oldValue.opt_matrix) {
            if (newValue.opt_matrix) {
                $scope.options.opt_invert = true;
                $scope.options.opt_block = false;
                $scope.initMatrixSnakes();
                currentBackColor = 'rgba(0,0,0,1)';
            } else {
                currentBackColor = '#FFFFFF';
            }
            ctx.fillStyle = currentBackColor;
            ctx.fillRect(0, 0, width, height);
        }
        if (newValue.strResolution !== oldValue.strResolution) {
            ctx.fillStyle = currentBackColor;
            ctx.fillRect(0, 0, width, height);
            if (newValue.strResolution === "low") {
                $scope.options.fResolution = 0.25;
            }
            if (newValue.strResolution === "medium") {
                $scope.options.fResolution = 0.5;
            }
            if (newValue.strResolution === "high") {
                $scope.options.fResolution = 1;
            }
            if (newValue.opt_matrix) {
                $scope.initMatrixSnakes();
            }
        }
        $scope.prevOptions = angular.copy($scope.options);
    });

    $scope.generateSnake = function generateSnake(maxHeight) {
        var increment = Math.floor((Math.random() * 8 * $scope.options.fResolution) + 1);
        var index = Math.floor(-(Math.random() * 20 * $scope.options.fResolution));
        return {
            len: Math.floor((Math.random() * maxHeight) + 1),
            increment: increment,
            index: function() {
                return index;
            },
            step: function() {
                index += increment;
                if (index > maxHeight) {
                    index = 0;
                }
            }
        };
    };

    $scope.downloadImage = function() {
        var dimg = new Image();
        dimg.src = q.toDataURL();
        dimg.onload = function() {
          var url = dimg.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
          window.open(url);    
        }
    }

    $scope.initMatrixSnakes = function() {
        var totalSnakes = $scope.options.width * $scope.options.fResolution,
            i = 0;
        $scope.matrixSnakes = [];
        for (i = 0; i < totalSnakes; i++) {
            $scope.matrixSnakes.push($scope.generateSnake($scope.options.height));
        }
    };

    $scope.drawChar = function(c, x, y) {
        if (typeof c == "undefined") return;
        var cKey = x + "." + y;
        var old = "h";
        if (imgHash.hasOwnProperty(cKey)) {
            old = imgHash[cKey];
            if (c == old && $scope.options.opt_motion == true) {
                return false;
            }
            ctx.fillText(c, x, y);
        }
        imgHash[cKey] = c;
        ctx.fillText(c, x, y);
    }

    $scope.initVideo = function() {
        var charSet = ($scope.options.opt_color ? aDefaultColorCharList : defCharList);
        var fResolution = $scope.options.fResolution;
        var iWidth = parseInt(Math.round($scope.options.width * fResolution));
        var iHeight = parseInt(Math.round($scope.options.height * fResolution));
        var strThisChar;

        oCanvas.width = iWidth;
        oCanvas.height = iHeight;
        oCanvas.style.display = "none";
        oCanvas.style.width = iWidth;
        oCanvas.style.height = iHeight;
        oCtx.drawImage(video, 0, 0, iWidth, iHeight);


        var oImgData = oCtx.getImageData(0, 0, iWidth, iHeight).data;
        var fFontSize = (1.4 / fResolution) * $scope.options.iScale;
        var iOffset, iRed, iGreen, iBlue, iAlpha, bright, cIndex;

        fLineHeight = (1 / fResolution) * $scope.options.iScale;

        var charsetLengthMinusOne = (charSet.length - 1);

        if ($scope.options.opt_matrix) {
            angular.forEach($scope.matrixSnakes, function(value) {
                value.step();
            });
            ctx.fillStyle = 'rgba(0,0,0,.30)';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#0F0';
        } else if (!$scope.options.opt_block) {
            ctx.fillStyle = currentBackColor;
            ctx.fillRect(0, 0, width, height);
        }

        ctx.font = fFontSize + 'pt Courier New';


        for (var y = 0; y < iHeight; y += 2) {
            for (var x = iWidth - 1; x >= 0; x--) {                 
                iOffset = (y * iWidth + x) * 4;
                iRed = oImgData[iOffset];
                iGreen = oImgData[iOffset + 1];
                iBlue = oImgData[iOffset + 2];
                iAlpha = oImgData[iOffset + 3];
                bright = (0.299 * iRed + 0.587 * iGreen + 0.114 * iBlue) / 255;
                cIndex = charsetLengthMinusOne - Math.round(bright * charsetLengthMinusOne);

                var pixel = {
                    size: fLineHeight,
                    fillStyle: "#0F0",
                    x: 0,
                    y: 0,
                    c : " "
                };

                if ($scope.options.opt_invert) {
                    cIndex = charsetLengthMinusOne - cIndex;
                }
                strThisChar = charSet[cIndex];
                if (strThisChar === undefined)
                    continue;

                pixel.c = strThisChar;

                if ($scope.options.opt_block) {
                    ctx.fillStyle = 'rgba(' + iRed + ',' + iGreen + ',' + iBlue + ',' + iAlpha + ')';
                    ctx.fillRect(x * fLineHeight, y * fLineHeight, fLineHeight, fLineHeight * 2);
                } else if ($scope.options.opt_matrix) {
                    var index = $scope.matrixSnakes[x].index();
                    var len = $scope.matrixSnakes[x].len;
                    if (index > y && index < y + 4) {
                        pixel.fillStyle = '#FFF';
                        ctx.fillStyle = '#FFF';
                        pixel.c = matrixBeginCharList[y % matrixBeginCharList.length];
                        $scope.drawChar(matrixBeginCharList[y % matrixBeginCharList.length], x * fLineHeight, y * fLineHeight);
                        // ctx.fillText(matrixBeginCharList[y % matrixBeginCharList.length], x * fLineHeight, y * fLineHeight);
                    } else if (index > y && index > 0 && ((index - len) < y)) {
                        if ($scope.options.opt_color) {
                            pixel.fillStyle = 'rgba(' + iRed + ',' + iGreen + ',' + iBlue + ',' + iAlpha + ')';
                            ctx.fillStyle = 'rgba(' + iRed + ',' + iGreen + ',' + iBlue + ',' + iAlpha + ')';
                        } else {
                            pixel.fillStyle = '#0F0';
                            ctx.fillStyle = '#0F0';
                        }
                        strThisChar = matrixMiddleCharLists[index % matrixMiddleCharLists.length][cIndex];
                        $scope.drawChar(strThisChar, x * fLineHeight, y * fLineHeight);
                    }
                } else {
                    if ($scope.options.opt_color) {
                        pixel.fillStyle = 'rgba(' + iRed + ',' + iGreen + ',' + iBlue + ',1)';
                        ctx.fillStyle = 'rgba(' + iRed + ',' + iGreen + ',' + iBlue + ',1)';
                    } else {
                        pixel.fillStyle = '#000';
                        ctx.fillStyle = '#000';
                    }
                    $scope.drawChar(strThisChar, x * fLineHeight, y * fLineHeight);
                }
                // $scope.drawPixel(strThisChar, pixel);
            }
        }
        $scope.onComplete();
    };

});