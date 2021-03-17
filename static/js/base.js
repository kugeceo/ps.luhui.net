$(function() {
	var VARNAME = {
		bg: 'bg',
		engine: 'eg',
		style: "style",
		content: "content"
	};
	Messenger.options = {
		extraClasses: 'messenger-fixed messenger-on-top messenger-on-left',
		theme: 'ice'
	};

	function showMessage(msg) {
		try {
			Messenger.m.hide()
		} catch (e) {}
		Messenger.m = Messenger().post({
			message: msg,
			title: '',
			hideAfter: 3,
			showCloseButton: true
		})
	};
	//if (top.location.href.indexOf('http://luhui.net/') !== 0) top.location.href = 'http://luhui.net/';

	function setBackground(img) {
		$(document.body).css('background-image', 'url(' + img + ')');
		localStorage.setItem(VARNAME.bg, img)
	};
	$("#skin-subnav").on('click', 'a', function(e) {
		e.preventDefault();
		setBackground($(this).attr('href'))
	});
	var defaultBG = localStorage.getItem(VARNAME.bg);
	if (!defaultBG) defaultBG = $("#skin-subnav a").first().attr('href');
	setBackground(defaultBG);
	var oldTitle = document.title;

	function setIframeSrc(id) {
		$(".on").removeClass('on');
		var li = $("#" + id);
		li.addClass('on');
		$("#engine").attr('src', li.find('a').attr('data'));
		document.title = oldTitle + ' - ' + li.find('a').text();
	};
	$("#foo").on('click', 'li[id]', function() {
		if (shake.isOn) return;
		if ($(this).find('a').attr('target') === '_blank') {
			window.open($(this).find('a').attr('data'));
			return
		};
		setIframeSrc($(this).attr('id'))
	});
	var defaultEngine = localStorage.getItem(VARNAME.engine);
	if (!defaultEngine) defaultEngine = $("#foo li[id]").first().attr('id');
	var hash = window.location.hash;
	if (hash) {
		defaultEngine = hash.replace('#', '');
		window.location.hash = ''
	};
	setIframeSrc(defaultEngine);
	var d = dialog({
		padding: 5,
		content: '<ul id="option"><li id="setdefaultengine"><i class="fa fa-home" style="font-size:16px"></i>设为默认</li><li id="toogleiconlist"><i class="fa fa-exchange"></i>切换宽窄</li><li id="sort"><i class="fa fa-sort" style="font-size:16px"></i>拖动排序</li></ul>'
	});

	function closeDialog() {
		if (d.open) {
			$(".t").removeClass('t on');
			d.close()
		}
	};
	var bodyHeight = $("body").height();

	function showDialog(ele) {
		var top = $(ele).offset().top;
		if (top + 70 > bodyHeight) d.align = 'right bottom';
		else d.align = 'right';
		d.show(ele)
	};
	$("#foo").on('contextmenu', 'li', function(e) {
		e.preventDefault();
		if (shake.isOn) return;
		if ($("#setdefaultengine").data('v') === $(this).attr('id') && d.open) {
			closeDialog();
			return
		};
		closeDialog();
		if (!$(this).hasClass('on')) $(this).addClass('t on');
		$("#setdefaultengine").data('v', $(this).attr('id'));
		showDialog(this)
	});
	$("body").on('click', closeDialog);
	$('#foo').on('mousewheel', closeDialog);
	$("#setdefaultengine").on('click', function() {
		var a = $("#" + $(this).data('v')).find('a');
		if (a.attr('target') === '_blank') {
			showMessage("由于该站禁止了iframe, 【" + a.text() + "】不能设置默认");
			return
		};
		localStorage.setItem(VARNAME.engine, $(this).data('v'));
		showMessage('成功设置【' + a.text() + '】为默认搜索')
	});

	function changeToIcon() {
		$(".left-nav").css('width', '171px').animate({
			width: '60px'
		}, 800);
		$("#nav").css('padding-left', '171px').animate({
			"padding-left": '60px'
		}, 800);
		$(".main").css('margin-left', '171px').animate({
			"margin-left": '60px'
		}, 800);
		$("body").addClass('icon-style');
		localStorage.setItem(VARNAME.style, 'icon');
		isIconStyle = true
	};

	function changeToList() {
		$(".left-nav").animate({
			width: '171px'
		}, 800);
		$("#nav").animate({
			"padding-left": '171px'
		}, 800);
		$(".main").animate({
			"margin-left": '171px'
		}, 800, function() {
			$("body").removeClass('icon-style')
		});
		localStorage.setItem(VARNAME.style, 'list');
		isIconStyle = false;
		hoverDialog.close()
	};
	$("#toogleiconlist").on('click', function() {
		if ($("body").hasClass("icon-style")) {
			changeToList();
			$(this).data('toggle', 'list')
		} else {
			changeToIcon();
			$(this).data('toggle', 'icon')
		}
	});
	var shake = {
		on: function() {
			$("#foo li").addClass('shake');
			$(".main").css({
				'opacity': '.5',
				'filter': 'alpha(opacity=50)'
			});
			this.isOn = true
		},
		off: function() {
			$("#foo li").removeClass('shake');
			$(".main").css({
				'opacity': '1',
				'filter': 'alpha(opacity=100)'
			});
			this.isOn = false
		},
		isOn: false
	};
	var saveDialog = dialog({
		content: '完成排序点击确定',
		title: '',
		okValue: '确定',
		ok: function() {
			endSort();
			localStorage.setItem(VARNAME.content, $("#foo").html());
			saveDialog.close();
			return false
		}
	});
	var timer = {
		start: function() {
			if (this.id === null) {
				this.id = setTimeout($.proxy(function() {
					this.doFunc();
					this.id = null
				}, this), this.delay)
			}
		},
		end: function() {
			if (this.id !== null) {
				clearTimeout(this.id);
				this.id = null
			}
		},
		doFunc: function() {
			startSort()
		},
		delay: 1000,
		id: null
	};

	function startSort() {
		shake.on();
		$("#foo").sortable('enable');
		saveDialog.show()
	};

	function endSort() {
		shake.off();
		$("#foo").sortable('disable')
	};
	$("#sort").on('click', startSort);
	$("#foo li").addClass('shake-constant');
	$("#foo").sortable().sortable('disable');
	$("#foo li").on('mousedown', function() {
		timer.start()
	}).on('mouseup', function() {
		timer.end()
	});
	var isIconStyle = $("body").hasClass("icon-style");
	var hoverDialog = dialog({
		title: '',
		conetent: '',
		align: 'right',
		padding: 10
	});
	$("#foo li").hover(function() {
		if (isIconStyle && !shake.isOn && !d.open) {
			hoverDialog.content($(this).find('a').text()).show(this)
		}
	}, function() {
		if (isIconStyle) {
			hoverDialog.close()
		}
	})
});
function isMobile(){
    return navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i);
}
function show_slider(){
	$('.left-nav').animate({left:'0'});
	$('.more-nav a').addClass('active').find('span').text('关闭');
	$('.fade').show();
}
function hide_slider(){
	$('.left-nav').animate({left:'-171px'});
	$('.more-nav a').removeClass('active').find('span').text('更多');
	$('.fade').hide();
}
$(function(){
	$('.more-nav a').click(function(){
		if($(this).hasClass('active')){
			hide_slider();
		}else{
			show_slider();
		}
	})
	$('.fade,.bsss li').click(function(){
		if(isMobile()){
			hide_slider();
		}
	})
})