/*通用脚本*/

$(document).ready(function () {
	// topbar左上角用户信息展示
	var API_HOST = "/";
	var paramString = "m=api&c=user&a=status";
	window.getUserInfo = function () {
		$.ajax({
			url: API_HOST,
			data: paramString,
			type: "GET",
			dataType: "json",
			success: function (responseData) {
				if (!responseData.status) {
					return;
				}

				var $_userinfoContainer = $("#userinfoContainer");
				var $_usernameText = $("#usernameText");
				var $_usernameShow = $("#usernameShow");
				var $_userId = $("#userId");

				$_usernameShow.html(responseData.name);
				$_userId.html("(ID:" + responseData.id + ")");
				$("#serverCount").html(responseData.servercount);
				$("#orderCount").html(responseData.ordercount);
				$("#msgCount").html(responseData.msgcount);


				var money = responseData.money || "0";
				if (String(money).indexOf(".") == -1) {
					money += ".00";
				}
				$("#userMoney").html(money);

				var verifyClassNameMap = {
					"0": "auth-icon-unauth",
					"1": "auth-icon-company",
				};
				$_usernameText.addClass(verifyClassNameMap[responseData.identityStatus]);

				// 初始化数据之后，显示 用户面板
				$_userinfoContainer.addClass("welcome-user");

				// 动画效果
				var PANEL_EXTEND_CLASSNAME = "userinfo-container--extend";
				var EXTEND_DURATION = 300;
				var $_usernameContainer = $("#usernameContainer");
				var $_userPanel = $("#userPanel");
				var panelHeight = $_userPanel.css("height");
				$_userinfoContainer.on("mouseenter", ".userinfo-container", function () {
					$_userinfoContainer.addClass(PANEL_EXTEND_CLASSNAME);

					// 取消动画列队，不完成当前动画
					$_userPanel.stop(true, false);
					$_userPanel.css("height", 0);
					$_userPanel.animate({height: panelHeight}, EXTEND_DURATION);
				});
				$_userinfoContainer.on("mouseleave", ".userinfo-container", function () {
					// 取消动画列队，不完成当前动画
					$_userPanel.stop(true, false);
					$_userPanel.animate({height: 0}, EXTEND_DURATION, function () {
						$_userinfoContainer.removeClass(PANEL_EXTEND_CLASSNAME);
					});
				});
			}
		});
	}
	getUserInfo();

	//返回顶部按钮
	var $toTop = $("#toTop");
	$toTop.hide();
	$(window).scroll(function () {
		if ($(window).scrollTop() > 100) {
			if ($toTop.is(":hidden")) {
				$toTop.stop().fadeIn(500);
			}
		}
		else {
			if ($toTop.is(":visible")) {
				$toTop.stop().fadeOut(500);
			}
		}
	});
	$toTop.click(function () {
		$('body,html').stop().animate({scrollTop: 0}, 300);
		return false;
	});

	//二级菜单交互效果
	var $headerNavUl = $(".header-nav>ul");
	$(".header-nav-li").mouseenter(function () {
		$headerNavUl.attr({"class": ""});
		$headerNavUl.addClass("nav-bar-" + ($(this).index() + 1));
		$(this).addClass("header-nav-li--active").siblings().removeClass("header-nav-li--active");
	});
	$(".header-nav").mouseleave(function () {
		$(".header-nav-li").removeClass("header-nav-li--active");
		$headerNavUl.removeClass();
	});
	//“首页”不触发二级菜单
	$(".nav-1").hover(function () {
		$(".header-nav").addClass("hide-pop-list");
	}, function () {
		$(".header-nav").removeClass("hide-pop-list");
	});

	/*footer部分的脚本*/
	//侧边栏弹出
	$(".suspension-tel, .suspension-qrcode").hover(function () {
		$(this).children(".pop-detail").fadeIn(300);
	}, function () {
		$(this).children(".pop-detail").fadeOut(100);
	});

	$(".official-plat ul li:first-child").hover(function () {
		$(".weixin").show();
		$(".weibo").hide();
	});
	$("li[title='点击打开官方微博']").hover(function () {
		$(".weixin").hide();
		$(".weibo").show();
	});

	//href="#a_null"的统一设置为无效链接
	$("a[href='#a_null']").click(function () {
		return false;
	});

	//全图可点型banner添加打开链接方法
	$(".link-banner").each(function () {
		var $_self = $(this);
		var openURL = $_self.data("url");

		if (openURL) {
			$_self.click(function () {
				var openTarget = $_self.data("target") || "self";
				window.open(openURL, openTarget);
			});
		}
	});
	//PIE 统一设置
	if (window.PIE) {
		$('.pie-for-element').each(function () {
			PIE.attach(this);
		});
		$('.pie-for-children').children().each(function () {
			PIE.attach(this);
		});
		$('.pie-for-tree').find("*").each(function () {
			PIE.attach(this);
		});
	}
	//验证码切换
	var $_showCaptcha = $(".show-captcha");
	var $_refreshCaptcha = $(".refresh-captcha");
	var captchaSrc = "/?m=api&c=captcha";
	var createCaptchaSrc = function () {
		return captchaSrc + '&rnd=' + Math.random();
	};
	var refreshCaptchaImg = function (captchaImg) {
		$(captchaImg).attr("src", createCaptchaSrc());
	};

	refreshCaptchaImg($_showCaptcha);
	$_showCaptcha.click(function () {
		refreshCaptchaImg(this);
	});
	$_refreshCaptcha.click(function () {
		refreshCaptchaImg($(this).parent().find(".show-captcha"));
	});

	// 帮助中心菜单点击保存cookie,帮助中心首页获取选择高亮
	$(".help-content").click(function () {
		var contentId = $(this).data("content_id");
		$.cookie("helpIndex", contentId, {path: "/"});
		location.href = "/help/";
	});

});

// 封装工具类方法
$(function () {
	window.NY = window.NY || {};

	// add feedback tips: warn/success/error
	if ($.dialog && $.dialog.tips) {
		var DEFAULT_TIPS_SHOW_DURATION = 3;
		var tipsTypeList = ["warn", "success", "error", "loading"];
		var tipsTypeMap = {
			warn: "alert"
		};

		$.each(tipsTypeList, function (i, tipsType) {
			var basicMethodType = tipsTypeMap[tipsType] || tipsType;

			window.NY[tipsType] = function (text, duration, callback) {
				duration = duration || DEFAULT_TIPS_SHOW_DURATION;

				return $.dialog.tips(text, duration, basicMethodType, callback);
			};
		});
	}

	// 作为ajax请求失败时 提示使用
	if (NY.warn) {
		NY.showBusy = function (duration, callback) {
			return NY.warn("服务器繁忙，请稍后重试！", duration, callback);
		};
	}

	// 显示登录框
	if ($.dialog) {
		var loginHost = "/";
		var loginFrameURL = loginHost + "login/?type=frame";
		var loginActionURL = loginHost + "login/login.html";

		// loginSuccessCallback 仅登录成功后会调用
		NY.showLoginDialog = function (loginSuccessCallback, dialogConfig) {
			var loginDialog = null;
			var defaultDialogConfig = {
				title: "会员登录",
				okVal: "登录",
				width: 455,
				height: 220,
				ok: function () {
					var iframe = this.iframe.contentWindow;
					var iframe_form = $(iframe.document).find("form");
					var param = {};
					iframe_form.find("[name]").each(function () {
						var $_input = $(this);

						param[$_input.prop("name")] = $_input.val();
					});
					//禁用登录按钮
					$(".aui_state_highlight").prop({"disabled": true});
					
					$.ajax({
						type: "post",
						url: loginActionURL,
						data: param,
						success: function (dataString) {
							//登录按钮解除禁用
							$(".aui_state_highlight").prop({"disabled": false});
							var responseData = (typeof dataString == "string") ? eval('(' + dataString + ')') : dataString;
							if (!responseData.result) {
								NY.warn(responseData.text);
								$(".show-captcha", iframe.document).click();
								return;
							}

							loginDialog.close();

							loginSuccessCallback.call(loginDialog, responseData);
						},
						error: function () {
							//登录按钮解除禁用
							$(".aui_state_highlight").prop({"disabled": false});
							NY.showBusy();
						}
					});
					return false;
				},
				cancel: true
			};

			// 统一代理登录请求，不接收ok按钮事件重载
			delete dialogConfig.ok;
			var config = $.extend(defaultDialogConfig, dialogConfig);

			loginDialog = $.dialog.open(loginFrameURL, config);

			return loginDialog;
		};

		// 业务方法：检查登录，弹出登录框并提交表单
		// afterLoginCall 接收 1 个参数：true:表示回调函数调用时为已登录状态，false:表示回调函数调用时为弹窗登录成功状态
		NY.loginCheckThenDo = function (afterLoginCall, dialogConfig) {
			$.ajax({
				url: "/login/check.html",
				cache: false,
				dataType: "json",
				success: function (responseData) {
					if (!responseData.result) {
						//检测,当为手机版未登录时,跳转到手机版登录页
						if(responseData.isMobile){
							location.href="/login/"
							return false;
						}
						var config = $.extend({
							okVal: "登录并提交"
						}, dialogConfig);

						NY.showLoginDialog(function (data) {
							if (!data.result) {
								NY.warn(data.text);
							} else {
								NY.success(data.text, 2, function () {
									afterLoginCall(false);
								});
							}
						}, config);
					} else {
						afterLoginCall(true);
					}
				},
				error: function () {
					NY.showBusy();
				}
			});
		}
	}
	
	// 封装回车键事件响应方法
	NY.enterKey = function (element, handler, options) {
		options = options || {};
		var eventType = options.eventType || "keypress";
		var eventData = options.eventData;
		var isCtrlKey = options.isCtrlKey;
		var isShiftKey = options.isShiftKey;
		var isAltKey = options.isAltKey;
		
		var isBoolean = function (param) {
			return (typeof param === "boolean");
		};
		// 尽在按下回车键 且组合键符合设置时 才触发回调事件
		var myHandler = function (e) {
			var keyCode = e.which;
			var that = this;
			
			if ((keyCode == 10) || (keyCode == 13)) {
				// 如果指定了Ctrl、Shift、Alt等，则严格匹配相应组合键
				if (isBoolean(isCtrlKey) && (isCtrlKey !== e.ctrlKey)) {
					return;
				}
				else if (isBoolean(isShiftKey) && (isShiftKey !== e.shiftKey)) {
					return;
				}
				else if (isBoolean(isAltKey) && (isAltKey !== e.altKey)) {
					return;
				}
				
				handler.call(that, e);
			}
		};
		
		// 相当于 将【$(element).keypress(eventData, myHandler);】中的keypress换成变量
		return $(element)[eventType](eventData, myHandler);
	};

	NY.ajax = function (url, options) {
		// 照搬jquery的ajax方法的参数判断
		if (typeof url === "object") {
			options = url;
			url = undefined;
		}

		// 缓存 计算后的设置
		var isShowWaitTip = (options.isShowWaitTip !== false);

		// 默认ajax配置
		var settings = $.extend({
			url: url,
			type: "post",
			dataType: "json",
			error: function () {
				NY.showBusy();
			},
			// 注意，如果使用options.complete覆盖了这里的默认行为，则需要手动调用NY.hideWaiting()
			complete: function (jqXHR, textStatus) {
				if (isShowWaitTip) {
					NY.hideWaiting();
				}
			}
		}, options);
		// 删除扩展的参数
		delete settings.isCoverSuccess;
		delete settings.successResultFalse;
		delete settings.isSuccessShowTip;
		delete settings.isSuccessJump;
		delete settings.isResultFalseWarn;
		delete settings.waitText;
		delete settings.isShowWaitTip;
		delete settings.isShowWaitMask;
		delete settings.waitMaskStyle;

		// isCoverSuccess表示 是否覆盖增强的success方法。若值为true，则不使用增强的success方法。若值不为true，则使用增强的success方法。
		if (options.isCoverSuccess !== true) {
			// 增强的success方法：对响应数据的status做判断，并在错误时显示后端提示信息，正确时才调用原来的options.success
			settings.success = function (responseData, textStatus, jqXHR) {
				var context = this;
				// 缓存响应数据
				var responseDataText;
				var responseDataTime = responseData.time;
				if (responseData.result) {
					responseDataText = responseData.text || "操作成功";
				} else {
					responseDataText = responseData.text || "操作失败";
				}
				// status 标识不成功时的处理
				if (!responseData.result) {
					// 对successResultFalse的 容错调用封装
					var resultFalseHandler = function () {
						var successResultFalse = options.successResultFalse;

						if ($.isFunction(successResultFalse)) {
							successResultFalse.call(context, responseData, textStatus, jqXHR);
						}
					};

					// 弹窗提示警告信息（当 options.isResultFalseWarn 配置不为 false 时执行）
					if (options.isResultFalseWarn !== false) {
						NY.warn(responseDataText, responseDataTime, function () {
							resultFalseHandler();
						});
					}
					else {
						resultFalseHandler();
					}

					return;
				}

				/*
				 * status标识成功时的处理（默认处理方式：先弹窗提示成功信息，再根据responseData的url或reload值 进行页面跳转或刷新）
				 */
				var successHandler = function () {
					var optionSuccess = options.success;
					var isJumpAfterCall = true;
					// 如果有传入options.success回调，则调用该方法
					if ($.isFunction(optionSuccess)) {
						isJumpAfterCall = optionSuccess.call(context, responseData, textStatus, jqXHR);
					}

					// 自动跳转（当 isSuccessJump 配置不为 false 且optionSuccess没有返回false 时执行）
					if ((options.isSuccessJump !== false) && (isJumpAfterCall !== false)) {
						// 若后端有返回url时，则跳转
						if (responseData.url) {
							window.location.href = responseData.url;
						}
						// 若后端有返回reload时，则刷新
						else if (responseData.reload) {
							window.location.reload();
						}
					}
				};

				// 弹窗提示成功信息（当 isSuccessShowTip 配置不为 false 时执行）
				if ((options.isSuccessShowTip !== false) && responseDataText) {
					// 使用成功提示框显示信息，并在指定时间后自动关闭
					NY.success(responseDataText, responseDataTime, function () {
						successHandler();
					});
				}
				else {
					successHandler();
				}
			};
		}

		// 发送ajax之前，根据配置 展示 waitTip
		if (isShowWaitTip) {
			NY.waiting(options.waitText, options.isShowWaitMask);
		}
		// 发送ajax
		return $.ajax(settings);
	};
	// 获取hash的通用方法
	NY.getHash = function (hashName) {
		var reg = new RegExp("(^|&)" + hashName + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return '';
	}
});

// 埋点统计
$(function () {
	var deleteCookie = function (name) {
		document.cookie = name + "=;path=/;expires=" + (new Date().toUTCString());
	};

	// #id=richu-xxx[-yyy]
	var hash = location.hash.slice(1);
	var matchGroups = hash.match(/(\-\d+)/g);
	if (!matchGroups || (matchGroups.length > 2)) {
		// 不符合规则时，return但不删除识别码
		// deleteCookie("channelID");
		// deleteCookie("channelType");
		return;
	}

	var channelType = (matchGroups[0] || "").slice(1);
	var channelID = (matchGroups[1] || "").slice(1);
	if (!channelID) {
		channelID = channelType;
		deleteCookie("channelType");
	}
	else {
		document.cookie = "channelType=" + channelType + ";path=/";
	}
	document.cookie = "channelID=" + channelID + "; path=/";
});


//波浪动画
$(function () {
	var marqueeScroll = function (id1, id2, id3, timer) {
		var $parent = $("#" + id1);
		var $goal = $("#" + id2);
		var $closegoal = $("#" + id3);
		$closegoal.html($goal.html());
		function Marquee() {
			if (parseInt($parent.scrollLeft()) - $closegoal.width() >= 0) {
				$parent.scrollLeft(parseInt($parent.scrollLeft()) - $goal.width());
			}
			else {
				$parent.scrollLeft($parent.scrollLeft() + 1);
			}
		}

		setInterval(Marquee, timer);
	}
	var marqueeScroll1 = new marqueeScroll("marquee-box", "wave-list-box1", "wave-list-box2", 20);
	var marqueeScroll2 = new marqueeScroll("marquee-box3", "wave-list-box4", "wave-list-box5", 40);
});
function randomNum(index) {
	var result = '';
	for (var i = 0; i < index; i++) {
		var item = '' + Math.floor(Math.random() * 10);
		result += item;
	}
	return result;
};
