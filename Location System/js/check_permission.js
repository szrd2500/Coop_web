//'use strict';
var token = "",
    account = "",
    permission = 0,
    MinimumPermission = {
        index: "0",
        Member_Setting: "0",
        Timeline: "0",
        Map_Setting: "0",
        Anchor_Setting: "0",
        Alarm_Setting: "0",
        Report: "0",
        Reference: "2",
        Account_Management: "2"
    },
    userVue = null,
    sidebarVue = null,
    PageSettings = {
        FirstFloor: {
            index: {
                isActive: false,
                href: "../index.html",
                icon: "fas fa-satellite-dish",
                text: 'homePage',
                SecondFloor: {
                    alarmlist: {
                        isActive: false,
                        class: "alarmlist",
                        href: "javascript: alarmSidebarMove();",
                        icon: "fas fa-exclamation-circle",
                        text: 'i_alarmList'
                    },
                    taglist: {
                        isActive: false,
                        class: "taglist",
                        href: "javascript: tagSidebarMove();",
                        icon: "fas fa-map-marker-alt",
                        text: 'i_tagList'
                    }
                }
            },
            Member_Setting: {
                isActive: false,
                href: "../Member_Setting.html",
                icon: "fas fa-user-cog",
                text: 'member_settingPage',
                SecondFloor: {
                    Member_Setting: {
                        isActive: false,
                        class: "setting-type",
                        href: "../Member_Setting.html",
                        icon: "fas fa-users",
                        text: 'i_memberSetting'
                    },
                    Dept_Setting: {
                        isActive: false,
                        class: "setting-type",
                        href: "../Dept_Setting.html",
                        icon: "fas fa-sitemap",
                        text: 'i_deptSetting'
                    },
                    Job_Title_Setting: {
                        isActive: false,
                        class: "setting-type",
                        href: "../Job_Title_Setting.html",
                        icon: "fas fa-id-card",
                        text: 'i_titleSetting'
                    },
                    User_Type_Setting: {
                        isActive: false,
                        class: "setting-type",
                        href: "../User_Type_Setting.html",
                        icon: "fas fa-user-tag",
                        text: 'i_usertypeSetting'
                    },
                    Preview_Color_Setting: {
                        isActive: false,
                        class: "setting-type",
                        href: "../Preview_Color_Setting.html",
                        icon: "fas fa-map-marker-alt",
                        text: 'i_previewColorSetting'
                    }
                }
            },
            Timeline: {
                isActive: false,
                href: "../Timeline.html",
                icon: "fas fa-route",
                text: 'timelinePage'
            },
            Map_Setting: {
                isActive: false,
                href: "../Map_Setting.html",
                icon: "fas fa-map",
                text: 'map_settingPage'
            },
            Anchor_Setting: {
                isActive: false,
                href: "../Anchor_Setting.html",
                icon: "fas fa-anchor",
                text: 'anchor_settingPage'
            },
            Alarm_Setting: {
                isActive: false,
                href: "../Alarm_Setting.html",
                icon: "fas fa-bell",
                text: 'alarm_settingPage'
            },
            Report: {
                isActive: false,
                href: "../Report.html",
                icon: "far fa-file-alt",
                text: 'report'
            },
            Reference: {
                isActive: false,
                href: "../Reference.html",
                icon: "fas fa-cogs",
                text: 'advance_settingPage',
                SecondFloor: {
                    Reference: {
                        isActive: false,
                        class: "setting-type",
                        href: "../Reference.html",
                        icon: "fas fa-satellite-dish",
                        text: 'i_reference'
                    },
                    Advance_cmd: {
                        isActive: false,
                        class: "setting-type",
                        href: "../Advance_cmd.html",
                        icon: "fas fa-code",
                        text: 'i_advance_cmd'
                    },
                    Update: {
                        isActive: false,
                        class: "setting-type",
                        href: "../Update.html",
                        icon: "fas fa-download",
                        text: 'i_update'
                    },
                    start: {
                        isStart: false,
                        isActive: false,
                        class: "start",
                        href: "javascript: StartClick();",
                        icon: this.isStart ? "fas fa-pause" : "fas fa-play",
                        text: this.isStart ? 'i_stopPositioning' : 'i_startPositioning'
                    },
                }
            }
        }
    };

/**
 * When web page loading.
 * First read the permission table from server
 * Second read the account_permission or get from cookie
 */

function setNavBar(parent_page, child_page) {
    $(function () {
        sidebarVue = new Vue({
            el: '#icon_navbar',
            data: {
                parent: "",
                child: "",
                parentPages: [],
                childPages: [],
                lock_state: "unlocked"
            },
            methods: {
                i18n: function (keyword) {
                    return $.i18n.prop(keyword);
                },
                getParentPages: function (pages) {
                    var page_arr = [];
                    for (var name in pages)
                        if (permission >= parseInt(MinimumPermission[name], 10))
                            page_arr.push(pages[name]);
                    return page_arr;
                },
                getChildPages: function (pages) {
                    var page_arr = [];
                    if (pages) {
                        for (var name in pages)
                            page_arr.push(pages[name]);
                    }
                    return page_arr;
                },
                load: function (parent, child) {
                    if (parent != "") {
                        PageSettings.FirstFloor[parent].isActive = true;
                        var second_floor = PageSettings.FirstFloor[parent].SecondFloor;
                        if (second_floor && second_floor[child])
                            PageSettings.FirstFloor[parent].SecondFloor[child].isActive = true;
                    }
                    this.lock_state = getCookie('lock_state') || "unlocked";
                    this.parentPages = this.getParentPages(PageSettings.FirstFloor);
                    this.childPages = this.getChildPages(PageSettings.FirstFloor[parent].SecondFloor);
                },
                lock: function () {
                    if (this.lock_state == "locked") {
                        this.lock_state = "unlocked";
                        setCookie('lock_state', "unlocked");
                    } else {
                        this.lock_state = "locked";
                        setCookie('lock_state', "locked");
                    }
                },
                launch: function (state) {
                    PageSettings.FirstFloor["Reference"].SecondFloor["start"].isStart = state;
                    PageSettings.FirstFloor["Reference"].SecondFloor["start"].icon = state ? "fas fa-pause" : "fas fa-play";
                    PageSettings.FirstFloor["Reference"].SecondFloor["start"].text = state ? 'i_stopPositioning' : 'i_startPositioning';
                },
                reset: function () {
                    this.parentPages = [];
                    this.childPages = [];
                }
            }
        });

        sidebarVue.load(parent_page, child_page);
    });
}

function checkPermissionOfPage(parent_page) {
    var pass = false;
    //沒有設定權限等同訪客帳號
    if (parent_page in MinimumPermission) {
        var minimum = parseInt(MinimumPermission[parent_page], 10);
        pass = permission >= minimum ? true : false;
    } else {
        alert("Error! Please call the administrator for help.");
        pass = false;
    }
    if (!pass) {
        switch (parent_page) {
            case "Account_Management":
            case "index":
                alert("Permission denied!");
                history.back();
                break;
            case "Member_Setting":
            case "Anchor_Setting":
            case "Timeline":
            case "Map_Setting":
            case "Alarm_Setting":
            case "Report":
            case "Reference":
                alert("Permission denied!");
                window.location.href = '../index.html';
                break;
            default:
                alert("Permission denied!");
                history.back();
                break;
        }
    }
}

function getPermission() {
    return [{
            page_name: 'homePage',
            permission: MinimumPermission["index"]
        },
        {
            page_name: 'member_settingPage',
            permission: MinimumPermission["Member_Setting"]
        },
        {
            page_name: 'timelinePage',
            permission: MinimumPermission["Timeline"]
        },
        {
            page_name: 'map_settingPage',
            permission: MinimumPermission["Map_Setting"]
        },
        {
            page_name: 'anchor_settingPage',
            permission: MinimumPermission["Anchor_Setting"]
        },
        {
            page_name: 'alarm_settingPage',
            permission: MinimumPermission["Alarm_Setting"]
        },
        {
            page_name: 'advance_settingPage',
            permission: MinimumPermission["Reference"]
        },
        {
            page_name: 'account_managementPage',
            permission: MinimumPermission["Account_Management"]
        }
    ];
}

function loadUserData() {
    userVue = new Vue({
        el: '#login_user',
        data: {
            info: {}
        },
        methods: {
            getUser: function () {
                var cookie = getCookie("login_user");
                var user_info = typeof (cookie) === 'undefined' ? null : JSON.parse(cookie);
                if (user_info) {
                    this.info = user_info;
                    token = user_info.api_token || "";
                    permission = user_info.userType && typeof (parseInt(user_info.userType, 10)) === 'number' ?
                        parseInt(user_info.userType, 10) : 0;
                    var html = "<span class=\"i18n\" name=\"i_welcome\">" + $.i18n.prop('i_welcome') +
                        "</span><div class=\"dropdown\"><label id=\"user_btn\" class=\"btn-user\">" +
                        user_info.cname + " <span class=\"caret\" style=\"color:white;\"></span></label>" +
                        "<div class=\"dropdown-content\">";
                    if (user_info.userType == "2") {
                        html += "<a href=\"../Account_Management.html\" class=\"i18n\"" +
                            " name=\"account_managementPage\">" + $.i18n.prop('account_managementPage') +
                            "</a>";
                    }
                    return html + "<a href=\"javascript: resetLogin();\" class=\"i18n\" name=\"i_logout\">" +
                        $.i18n.prop('i_logout') + "</a></div></div>";
                } else {
                    return "<a href=\"../Login.html\" style=\"margin:0px 20px 0px 5px;\">" +
                        "<span class=\"i18n\" name=\"i_login\">" + $.i18n.prop('i_login') + "</span></a>";
                }
            },
            reset: function () {
                this.info = {};
            }
        }
    });
}

function checkTokenAlive(token, response) {
    if (token == "") {
        return false;
    } else if (!response) {
        return false;
    } else if (response.status == 1) {
        return true;
    } else {
        if (response.msg == "Without token access") {
            //login overtime
            //alert("帳號閒置過久，此次登入失效，請重新登入");
            //window.location.href = '../Login.html';
            setCookie("login_user", null);
            location.reload();
        } else if (response.msg == "Account is not exist") {
            //other user use the account login successfully
            if (token != "") {
                //alert("此帳號已在別處登入，此次登入失效，請重新登入");
                //window.location.href = '../Login.html';
                setCookie("login_user", null);
                location.reload();
            }
        }
        return false;
    }
}

function resetLogin() {
    var json_request = JSON.stringify({
        "Command_Name": ["logout"],
        "Value": [{
            "api_token": token
        }]
    });
    var jxh = createJsonXmlHttp("user");
    jxh.onreadystatechange = function () {
        if (jxh.readyState == 4 || jxh.readyState == "complete") {
            var revObj = JSON.parse(this.responseText);
            if (revObj && revObj.Value[0].success > 0) {
                alert($.i18n.prop('i_logoutSuccess'));
            }
            setCookie("login_user", null);
            location.reload();
        }
    };
    jxh.send(json_request);
}