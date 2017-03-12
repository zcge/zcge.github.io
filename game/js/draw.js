	var i, j;//计数器

	/*获取DOM*/
	var editArea;
	var selectMonster;
	var selectItem;
	var selectEnvir;
	var selectDoor;
	var selectNPC;
	var mapOutput;
	
	var target = 401, pressing = false;//选择的元素，是否确认
	/*2个数组*/
	var blocks = new Array();
	var datas = new Array();
	/*页面加载的方法*/
	window.onload = function () {
	    editArea = $('editArea');
	    selectMonster = $('selectMonster');
	    selectItem = $('selectItem');
	    selectEnvir = $('selectEnvir');
	    selectDoor = $('selectDoor');
	    selectNPC = $('selectNPC');
	    mapOutput = $('mapOutput');

	    var t;
	    for (i = 0; i < 11; i++) {
	        blocks[i] = new Array();
	        datas[i] = new Array();
	        for (j = 0; j < 11; j++) {
	            t = document.createElement('div');
	            t.style.background = 'url(./img/400.png)';
	            t.className = 'blocks';
	            t.style.top = i * 32 + 'px';
	            t.style.left = j * 32 + 'px';
	            editArea.appendChild(t);
	            blocks[i][j] = t;
	            datas[i][j] = 400;
	            bindChange(i, j);
	        }
	    }

	    

	    var u;
	   for (i = 0; i < 3; i++) {
	       for (j = 0; j < 11; j++) {
	           u = i * 11 + j;
	           if (u > 32) break;
	           t = document.createElement('div');
	           t.style.background = 'url(./img/' + u + '.png)';
	           t.className = 'blocks';
	           t.style.top = i * 32 + 'px';
	           t.style.left = j * 32 + 'px';
	           bindTarget(t, u);
	           selectMonster.appendChild(t);
	       }
	   }
	   for (i = 0; i < 3; i++) {
	       for (j = 0; j < 11; j++) {
	           u = i * 11 + j + 100;
	           if (u > 123) break;
	           t = document.createElement('div');
	           t.style.background = 'url(./img/' + u + '.png)';
	           t.className = 'blocks';
	           t.style.top = i * 32 + 'px';
	           t.style.left = j * 32 + 'px';
	           bindTarget(t, u);
	           selectItem.appendChild(t);
	       }
	   }
	   for (i = 0; i < 1; i++) {
	       for (j = 0; j < 11; j++) {
	           u = i * 11 + j + 400;
	           if (u > 408) break;
	           t = document.createElement('div');
	           t.style.background = 'url(./img/' + u + '.png)';
	           t.className = 'blocks';
	           t.style.top = i * 32 + 'px';
	           t.style.left = j * 32 + 'px';
	           bindTarget(t, u);
	           selectEnvir.appendChild(t);
	       }
	   }
	   for (i = 0; i < 1; i++) {
	       for (j = 0; j < 11; j++) {
	           u = i * 11 + j + 500;
	           if (u > 504) break;
	           t = document.createElement('div');
	           t.style.background = 'url(./img/' + u + '.png)';
	           t.className = 'blocks';
	           t.style.top = i * 32 + 'px';
	           t.style.left = j * 32 + 'px';
	           bindTarget(t, u);
	           selectDoor.appendChild(t);
	       }
	   }
	   for (i = 0; i < 1; i++) {
	       for (j = 0; j < 11; j++) {
	           u = i * 11 + j + 600;
	           if (u > 604) break;
	           t = document.createElement('div');
	           t.style.background = 'url(./img/' + u + '.png)';
	           t.className = 'blocks';
	           t.style.top = i * 32 + 'px';
	           t.style.left = j * 32 + 'px';
	           bindTarget(t, u);
	           selectNPC.appendChild(t);
	       }
	   }

	   document.onmouseup = function () {
	       pressing = false;
	   };
	};
	/*得到我需要的代码*/
    function outWhatINeed() {
            var t = new Array();
            t[0] = '[<br/>';
            for (i = 0; i < 11; i++) {
                t[t.length] = '&nbsp;&nbsp;&nbsp;&nbsp;[';
                for (j = 0; j < 11; j++) {
                    t[t.length] = datas[i][j];
                    if (j < 10) t[t.length] = ', ';
                }
                if (i < 10) t[t.length] = '], <br/>';
                else t[t.length] = '] <br/>';
            }
            t[t.length] = '], ';
            mapOutput.innerHTML = t.join('');
    };
	function bindChange(i, j) {
	    blocks[i][j].onmouseover = function () {
	        this.style.border = '1px solid #fff';
	        this.style.zIndex = 101;
	        if (pressing) {
	            datas[i][j] = target;
	            blocks[i][j].style.background = 'url(./img/' + target + '.png)';
	        }
	    };
	    blocks[i][j].onmouseout = function () {
	        this.style.border = 'none';
	        this.style.zIndex = 100;
	    };
	    blocks[i][j].onmousedown = function () {
	        pressing = true;
	        datas[i][j] = target;
	        blocks[i][j].style.background = 'url(./img/' + target + '.png)';
	        outWhatINeed();
	    }
	}
	function bindTarget(o, t) {
	    o.onmouseover = function () {
	        this.style.border = '1px solid #fff';
	        this.style.zIndex = 101;
	    };
	    o.onmouseout = function () {
	        this.style.border = 'none';
	        this.style.zIndex = 100;
	    };
	    o.onclick = function () {
	        target = t;
	    }
	}
	/*元素选择方法，方便你通过ID查找DIV*/
	function $(i) {
	    return document.getElementById(i);
	}