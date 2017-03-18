$(document).ready(function () {
    $('#container ').on('click', '.btn_getdata', function () {
        var _txtID = $(this).attr("data-dropboxmact");
        $("#btn_uploadimages").attr("data-mactupload", _txtID);
        $("#btn_uploadfileexcel").attr("data-mactupload", _txtID);
    });

    $("#container").on('mouseover', '.each_project', function () {
        var des = $(this).find(".description_project");
        des.css("margin-top", "");
        var but = $(this).find(".button-project");
        but.css("display", "");
    });
    $("#container").on('mouseout', '.each_project', function () {
        var des = $(this).find(".description_project");
        des.css("margin-top", "25px");
        var but = $(this).find(".button-project");
        but.css("display", "none");
    });

});