var isPlaying = false;

var baseUrl = function() {
    var href = window.location.href.split('/');
    return href[0] + '//' + href[2] + '/';
}

var base64_tofield = function() {
    $('#formfield').val($.scriptcam.getFrameAsBase64());
};
var base64_toimage = function() {
    isPlaying = !isPlaying;
    initLoop();
};
var initLoop = function() {
    var data = "data:image/png;base64," + $.scriptcam.getFrameAsBase64();
    videoAscii.init(data);
}

var changeCamera = function() {
    $.scriptcam.changeCamera($('#cameraNames').val());
}

var onError = function(errorId, errorMsg) {
    $("#btn1").attr("disabled", true);
    $("#btn2").attr("disabled", true);
    alert(errorMsg);
}
var onWebcamReady = function(cameraNames, camera, microphoneNames, microphone, volume) {
    var lista = [];
    $.each(cameraNames, function(index, text) {
        lista.push('<li><a href="javascript:;" data-value="' + index + '" class="camera_opt">' + text + '</a></li>');
    });
    $('#sel_cameras').html(lista.join(''));
    $("#menu_cam").show();
}

$(document).ready(function() {
    $(".home").attr("href", document.URL);
    if (!swfobject.hasFlashPlayerVersion("1")) {
        $("#content").hide();
        $("#noflash").show();
    }
    $("#webcam").scriptcam({
        showMicrophoneErrors: false,
        onWebcamReady: onWebcamReady
    });
    $("#start_cam").click(function() {
        base64_toimage();
    })
    videoAscii.onComplete = function(response) {
        $("#webcam").attr("width", "0");
        $("#webcam").attr("height", "0");
        $("#result").html(response);
        if (isPlaying) setTimeout(function() {
            initLoop();
        }, 200);
    };
    $(".options").change(function() {
        var v = $(this).is(":checked");
        var type = $(this).attr("name");
        if (type == "bcolor") videoAscii.setBcolor(v);
        if (type == "balpha") videoAscii.setBalpha(v);
        if (type == "bblock") videoAscii.setBblock(v);
        if (type == "binvert") videoAscii.setBblock(v);
        return false;
    });
    $(".options").each(function(i, item) {
        var type = $(item).attr("name");
        var v = false;
        if (type == "bcolor") v = videoAscii.options.bColor;
        if (type == "balpha") v = videoAscii.options.bAlpha;
        if (type == "bblock") v = videoAscii.options.bBlock;
        if (type == "binvert") v = videoAscii.options.bInvert;
        if (v == true) $("input[name='" + type + "']").attr("checked", "checked");
        else $("input[name='" + type + "']").removeAttr("checed");

    });
});