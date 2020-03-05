(function(){
  // 独立运行不要登录设置（手机端）
  if (window.top === window) return;
  var SAVE_BTN_CHECK_LIST = [
    function (content) {
      return /另存为|导出层|存檔為|輸出成/g.test(content);
    },
    function (content) {
      return [
        'png', 'jpg', 'svg', 'gif', 'pdf', 'emf',
        'webp', 'bmp', 'ppm', 'tiff', 'ico', 'dds'
      ].some(function(type) {
        return content.indexOf(type) !== -1;
      });
    },
  ];

  function userClick(event) {
    // 判断用法是否已经登录 && 点击按钮触发源头是否在保存按钮的目录下
    var target = event.target;
    var saveBtnsContainer = document.querySelector('.cmanager');
    var htmlContent = target.innerHTML;
    if (window.__GAODING_USER_LOGIN || !saveBtnsContainer || !saveBtnsContainer.contains(target)) {
      return;
    }

    // 匹配指定按钮关键关键字
    var isTarget = SAVE_BTN_CHECK_LIST.some(function check(checkFn) {
      return checkFn(htmlContent.toLocaleLowerCase());
    });

    if (isTarget) {
      event.preventDefault();
      event.stopPropagation();
      window.top.postMessage('login', '*');
    }
  };

  document.body.addEventListener('click', userClick, true);

  // data 要求是字符串哟~，和 photopea 监听的 data 类型就是 string 的不然会报错！！！
  function handlerParentMessage({ data }) {
    if (data === 'user-init') {
      window.__GAODING_USER_LOGIN = true;
      document.body.removeEventListener('click', userClick, true);
      window.removeEventListener('message', handlerParentMessage, false);
    }
  }

  window.addEventListener('message', handlerParentMessage, false);
}());