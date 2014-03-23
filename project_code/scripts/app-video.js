var myApp = angular.module('app', ['ui.bootstrap', 'ngSanitize']);

myApp.controller('mainController', function($scope, $sce) {
    $scope.rendering = false;
    $scope.options = {
        iScale: 2,
        flipH: false,
        bblock: false,
        binvert: false,
        bcolor: false,
        bmatrix: false,
        height: 300,
        width: 400,
        interval: 10,
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
    var imgHash;
    var aDefaultColorCharList = (" CGO08@").split("");
    var width = parseInt(Math.round($scope.options.width * $scope.options.iScale));
    var height = parseInt(Math.round($scope.options.height * $scope.options.iScale));
    var currentBackColor = '#FFFFFF';
    var video = document.querySelector('video');
    var videoCanvas = document.getElementById('videoCanvas');
    var videoCtx = videoCanvas.getContext('2d');
    var errorCallback = function(e) {
        console.log('Reeeejected!', e);
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
        video.src = 'somevideo.webm'; // TODO Implement fallback.
    }

    $scope.initLoop = function() {
        videoCtx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
        $scope.initVideo(videoCanvas.toDataURL('image/png'));
        //$scope.initVideo(videoCtx.getImageData(0, 0, videoCanvas.width, videoCanvas.height))
    };

    $scope.onComplete = function() {
        if ($scope.rendering) {
            setTimeout(function() {
                $scope.initLoop();
            }, $scope.options.interval);
        }
    };
    $scope.$watch('rendering', function(newValue, oldValue) {
        if (newValue == true) {
            $scope.initLoop();
        }
    });
    $scope.$watchCollection('options', function(newValue, oldValue) {
        oldValue = $scope.prevOptions;
        if (newValue.flipH != oldValue.flipH) {
            videoCtx.translate(videoCanvas.width, 0);
            videoCtx.scale(-1, 1);
        }

        if (newValue.bmatrix != oldValue.bmatrix) {
            if (newValue.bmatrix) {
                $scope.options.binvert = true;
                $scope.options.bblock = false;
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
            if (newValue.bmatrix) {
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

    $scope.initMatrixSnakes = function() {
        var totalSnakes = $scope.options.width * $scope.options.fResolution,
            i = 0;
        $scope.matrixSnakes = [];
        for (i = 0; i < totalSnakes; i++) {
            $scope.matrixSnakes.push($scope.generateSnake($scope.options.height));
        }
    };

    $scope.initVideo = function(rData) {
        var oCanvasImg = new Image();
        oCanvasImg.src = rData;
        if (oCanvasImg.complete) {
            $scope.img2asc(oCanvasImg);
        } else {
            oCanvasImg.onload = function() {
                $scope.img2asc(oCanvasImg);
            };
        }
    };

    $scope.drawChar = function(c, x, y) {
        if (typeof c == "undefined") return;
        if (y > 40) console.log(x + " " + y);
        ctx.fillText(c, x, y);
    }

    $scope.img2asc = function(oCanvasImg) {
        var charSet = ($scope.options.bColor ? aDefaultColorCharList : defCharList);
        var fResolution = $scope.options.fResolution;

        var iWidth = parseInt(Math.round($scope.options.width * fResolution));
        var iHeight = parseInt(Math.round($scope.options.height * fResolution));

        oCanvas.width = iWidth;
        oCanvas.height = iHeight;
        oCanvas.style.display = "none";
        oCanvas.style.width = iWidth;
        oCanvas.style.height = iHeight;
        oCtx.drawImage(oCanvasImg, 0, 0, iWidth, iHeight);

        var oImgData = oCtx.getImageData(0, 0, iWidth, iHeight).data;
        var fFontSize = (1.4 / fResolution) * $scope.options.iScale;
        var fLineHeight = (1 / fResolution) * $scope.options.iScale;

        var charsetLengthMinusOne = (charSet.length - 1);

        if ($scope.options.bmatrix) {
            angular.forEach($scope.matrixSnakes, function(value) {
                value.step();
            });
            ctx.fillStyle = 'rgba(0,0,0,.30)';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#0F0';
        } else if (!$scope.options.bblock) {
            ctx.fillStyle = currentBackColor;
            ctx.fillRect(0, 0, width, height);
        }
        ctx.font = fFontSize + 'pt Courier New';
        for (var y = 0; y < iHeight; y += 2) {
            for (var x = iWidth - 1; x >= 0; x--) {
                var iOffset = (y * iWidth + x) * 4;
                var iRed = oImgData[iOffset];
                var iGreen = oImgData[iOffset + 1];
                var iBlue = oImgData[iOffset + 2];
                var iAlpha = oImgData[iOffset + 3];
                var fBrightness = (0.3 * iRed + 0.59 * iGreen + 0.11 * iBlue) / 255;
                var iCharIdx = charsetLengthMinusOne - Math.round(fBrightness * charsetLengthMinusOne);

                if ($scope.options.binvert) {
                    iCharIdx = charsetLengthMinusOne - iCharIdx;
                }
                var strThisChar = charSet[iCharIdx];
                if (strThisChar === undefined)
                    continue;

                if ($scope.options.bblock) {
                    ctx.fillStyle = 'rgba(' + iRed + ',' + iGreen + ',' + iBlue + ',' + iAlpha + ')';
                    ctx.fillRect(x * fLineHeight, y * fLineHeight, fLineHeight, fLineHeight * 2);
                } else if ($scope.options.bmatrix) {
                    var index = $scope.matrixSnakes[x].index();
                    var len = $scope.matrixSnakes[x].len;
                    if (index > y && index < y + 4) {
                        ctx.fillStyle = '#FFF';
                        $scope.drawChar(matrixBeginCharList[y % matrixBeginCharList.length], x * fLineHeight, y * fLineHeight);
                        // ctx.fillText(matrixBeginCharList[y % matrixBeginCharList.length], x * fLineHeight, y * fLineHeight);
                    } else if (index > y && index > 0 && ((index - len) < y)) {
                        if ($scope.options.bcolor) {
                            ctx.fillStyle = 'rgba(' + iRed + ',' + iGreen + ',' + iBlue + ',' + iAlpha + ')';
                        } else {
                            ctx.fillStyle = '#0F0';
                        }
                        strThisChar = matrixMiddleCharLists[index % matrixMiddleCharLists.length][iCharIdx];
                        $scope.drawChar(strThisChar, x * fLineHeight, y * fLineHeight);
                    }
                } else {
                    if ($scope.options.bcolor) {
                        ctx.fillStyle = 'rgba(' + iRed + ',' + iGreen + ',' + iBlue + ',1)';
                    } else {
                        ctx.fillStyle = '#000';
                    }
                    $scope.drawChar(strThisChar, x * fLineHeight, y * fLineHeight);
                }
            }
        }
        $scope.onComplete();
    };

});