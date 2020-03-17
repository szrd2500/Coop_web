var noImagePng = "../image/no_image.png";
var leftSide_isOpen = false;
var rightSide_isOpen = false;

function alarmSidebarMove() {
    $(function () {
        if (!leftSide_isOpen) {
            //側邊欄由左向右滑動
            $('#content').addClass('left_open');
            $('.alarm-sideBar').animate({
                left: '30px'
            }, 370); //0
        } else {
            //側邊欄由右向左滑動
            $('#content').removeClass('left_open');
            $('.alarm-sideBar').animate({
                left: '-330px'
            }, 310); //-330
        }
        leftSide_isOpen = !leftSide_isOpen;
    });
}

function tagSidebarMove() {
    $(function () {
        var $aside = $('#page_rightSide > aside');
        if (!rightSide_isOpen) {
            $('#content').addClass('right_open');
            $aside.stop(true).animate({
                right: '0px'
            }, 350);
        } else {
            $('#content').removeClass('right_open');
            $aside.stop(true).animate({
                right: '-350px'
            }, 310);
        }
        rightSide_isOpen = !rightSide_isOpen;
    });
}



/**
 * About Alarm Data Setting
 */
function inputAlarmData(element, index) {
    /**
     * Alarm Card DOM => {
     * thumb_id = "alarmCard_" + index,
     * thumb_img = "alarmCard_img_" + index,
     * thumb_number = "alarmCard_number_" + index,
     * thumb_focus_btn_id = "alarmCard_focus_btn_" + index,
     * thumb_unlock_btn_id = "alarmCard_unlock_btn_" + index,
     * tagid_alarm = element.id + element.alarm_type; //used by count & date & time 
     * }
     */
    var obj = element;
    obj["index"] = index;
    obj["time_arr"] = TimeToArray(element.alarm_time);
    switch (element.alarm_type) {
        case "low_power":
            obj["color"] = "#72ac1b";
            obj["status"] = 'i_lowPowerAlarm';
            break;
        case "help":
            obj["color"] = "#ff8484";
            obj["status"] = 'i_helpAlarm';
            break;
        case "still":
            obj["color"] = "#FF6600";
            obj["status"] = 'i_stillAlarm';
            break;
        case "active":
            obj["color"] = "#FF6600";
            obj["status"] = 'i_activeAlarm';
            break;
        case "Fence":
            obj["color"] = '#ffae00';
            obj["status"] = 'i_electronicFence';
            break;
        case "stay":
            obj["color"] = '#4876ff';
            obj["status"] = 'i_stayAlarm';
            break;
        case "hidden":
            obj["color"] = '#6f6ff8';
            obj["status"] = 'i_hiddenAlarm';
            break;
        default:
            obj["color"] = "#FFFFFF"; //unknown
            obj["status"] = '';
    }
    return obj;
}

function setAlarmDialog(Obj) {
    var color = "",
        status = "",
        time_arr = TimeToArray(Obj.alarm_time);
    switch (Obj.alarm_type) {
        case "low_power":
            color = "#72ac1b";
            status = $.i18n.prop('i_lowPowerAlarm');
            break;
        case "help":
            color = "#ff8484";
            status = $.i18n.prop('i_helpAlarm');
            break;
        case "still":
            color = "#FF6600";
            status = $.i18n.prop('i_stillAlarm');
            break;
        case "active":
            color = "#FF6600";
            status = $.i18n.prop('i_activeAlarm');
            break;
        case "Fence":
            color = '#ffae00';
            status = $.i18n.prop('i_electronicFence');
            break;
        case "stay":
            color = '#4876ff';
            status = $.i18n.prop('i_stayAlarm');
            break;
        case "hidden":
            color = '#6f6ff8';
            status = $.i18n.prop('i_hiddenAlarm');
            break;
        default:
            color = "#FFFFFF"; //unknown
            status = "";
    }
    $("#alarm_dialog").css('background-color', color);
    setMemberPhoto("alarm_dialog_image", "alarm_dialog_number", Obj.number);
    $("#alarm_dialog_number").text(Obj.number);
    $("#alarm_dialog_name").text(Obj.name);
    $("#alarm_dialog_id").text(Obj.user_id);
    $("#alarm_dialog_date").text(time_arr[0]);
    $("#alarm_dialog_time").text(time_arr[1]);
    $("#alarm_dialog_status").text(status);
    $("#alarm_dialog_btn_focus").off("click").on("click", function () {
        changeFocusAlarm(Obj.id, Obj.alarm_type);
    });
    $("#member_dialog").dialog("close");
    $("#alarm_dialog").dialog("open");
}

function setTagDialog(Obj) {
    $("#member_dialog_tag_id").text(Obj.user_id);
    $("#member_dialog_number").text(Obj.number);
    $("#member_dialog_name").text(Obj.name);
    setMemberPhoto("member_dialog_image", "member_dialog_number", Obj.number);
    $("#member_dialog_btn_focus").off("click").on("click", function () {
        var tag_id = Obj.id;
        locateTag(tag_id);
    });
    $("#alarm_dialog").dialog("close");
    $("#member_dialog").dialog("open");
}

function setMemberPhoto(img_id, number_id, number) {
    if (number == "") {
        document.getElementById(img_id).setAttribute("src", noImagePng);
    } else {
        var json_request = JSON.stringify({
            "Command_Type": ["Read"],
            "Command_Name": ["GetOneStaff"],
            "Value": {
                "number": number
            },
            "api_token": [token]
        });
        var jxh = createJsonXmlHttp("sql");
        jxh.onreadystatechange = function () {
            if (jxh.readyState == 4 || jxh.readyState == "complete") {
                var revObj = JSON.parse(this.responseText);
                if (checkTokenAlive(token, revObj) && revObj.Value[0].success > 0 && revObj.Value[0].Values) {
                    var revInfo = revObj.Value[0].Values[0];
                    if (document.getElementById(number_id).innerText != number) {
                        document.getElementById(img_id).setAttribute("src", noImagePng);
                        return;
                    }
                    if (revInfo.file_ext != "" && revInfo.photo != "")
                        document.getElementById(img_id).setAttribute("src", "data:image/" + revInfo.file_ext + ";base64," + revInfo.photo);
                    else
                        document.getElementById(img_id).setAttribute("src", noImagePng);
                }
            }
        };
        jxh.send(json_request);
    }
}