var myLayout;
var editor;

$(document).ready(function () {

  // 构造上中右三个面板
  myLayout = $('body').layout({
    resizerDblClickToggle: false,
    resizable: false,
    slidable: false,
    togglerLength_open: '100%',
    togglerLength_closed: '100%',
    center: {
      childOptions: {
        resizerDblClickToggle: false,
        resizable: false,
        slidable: false,
        togglerLength_open: '100%',
        togglerLength_closed: '100%',
        north: {
          size: '1px', // 只是占位，真实大小由内容决定
          togglerTip_open: 'Hide Toolbar',
          togglerTip_closed: 'Show Toolbar'
        }
      }
    },
    east: {
      size: '50%',
      togglerTip_open: 'Hide Preview',
      togglerTip_closed: 'Show Preview',
      onresize: function(){
        editor.session.setUseWrapMode(false); // ACE的wrap貌似有问题，这里手动触发一下。
        editor.session.setUseWrapMode(true);
      }
    }
  });

  // 左侧编辑器
  editor = ace.edit("editor");
  editor.$blockScrolling = Infinity;
  editor.renderer.setShowPrintMargin(false);
  editor.session.setMode("ace/mode/markdown");
  editor.session.setUseWrapMode(true);
  editor.setFontSize('14px');
  editor.focus();

  // 设置marked
  var renderer = new marked.Renderer();
  renderer.listitem = function(text) {
    var taskListRegex1 = /^\[ \]\s/;
    var taskListRegex2 = /^\[x\]\s/;
    var _text = text.replace(taskListRegex1, '<input type="checkbox" disabled/> ')
               .replace(taskListRegex2, '<input type="checkbox" disabled checked/> ');
    var result = marked.Renderer.prototype.listitem(_text);
    if(_text !== text) {
      result = $(result).addClass('none-style')[0].outerHTML;
    }
    return result;
  }
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: true
  });

  // 实时监听用户的编辑
  editor.session.on('change', function(){
    $('.markdown-body').html(marked(editor.session.getValue())); // 实时预览
    $('pre').addClass('prettyprint').addClass('linenums');
    prettyPrint(); // 语法高亮
  });

});
