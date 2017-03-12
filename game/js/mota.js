/**
 *魔塔游戏：
 *韩柯炜
 使用MVC模式的思想，一个数据层，一个控制层，一个视图层
 */
/*--------------控制层--------------------------------*/
//监听按键，所有的控制源于按键的监听
function keydown(e) {
    var ev = e || event;
    var key = ev.keyCode || ev.which || ev.charCode;
    switch (key) {
        case 32://空格键
            if(isonlog){
                off();
            }else if(isonJ){
                if(canfloor(selectJ)){
                    gofloor(selectJ);
                    offJ();
                }else{
                    offJ();
                    onLog("不能飞到你没到达过的楼层");
                }
            }else if(isonShop&&shopnum==4){
                offShop();
            }else if(isonShop&&shopnum==1){
                buyone();
            }else if(isonShop&&shopnum==2){
                buytwo();
            }else if(isonShop&&shopnum==3){
                buythree();
            }
        break;
        case 98://2
            if(isonShop){
                $("shop-"+shopnum).style.background='#2E64FE';
                shopnum++;
                if(shopnum==5){
                    shopnum=1;
                }
                $("shop-"+shopnum).style.background='#000';
            }
        break;
        case 104://8
            if(isonShop){
                $("shop-"+shopnum).style.background='#2E64FE';
                shopnum--;
                if(shopnum==0){
                    shopnum=4;
                }
                $("shop-"+shopnum).style.background='#000';
            }
        break;
        case 76://L
            if(isonL){
                offL();
            }else{
                onL();
            }
        break;
        case 74://J
            if(isonJ){
                offJ();
            }else{
                onJ();
            }
        break;
        case 38:  // 上
            if(!isonlog&&!isonJ&&!isonShop){
                movePlayer(1);
            }else if(isonJ){
                j_box[selectJ].style.background='#2E64FE';
                selectJ--;
                if(selectJ>=0){
                    j_box[selectJ].style.background='#000';
                }else{
                    selectJ=22;
                    j_box[selectJ].style.background='#000';
                }
            }
            break;
        case 40:  // 下
            if(!isonlog&&!isonJ&&!isonShop){
                movePlayer(2);
            }else if(isonJ){
                j_box[selectJ].style.background='#2E64FE';
                selectJ++;
                if(selectJ<=22){
                    j_box[selectJ].style.background='#000';
                }else{
                    selectJ=0;
                    j_box[selectJ].style.background='#000';
                }
            }
            break;
        case 37:  // 左
            if(!isonlog&&!isonJ&&!isonShop){
                movePlayer(3);
            }
            break;
        case 39:  // 右
            if(!isonlog&&!isonJ&&!isonShop){
                movePlayer(4);
            }
            break;
        default:
    }
}
document.onkeydown = keydown;
//移动人物
function movePlayer(num){//num是移动方向
    wipeHero();
    switch(num){
        case 1:
            py--;
            if(isRunaway()){
                py++;
            }else{
                eventHanding(num);//处理事件
            }
            face=1;
        break;
        case 2:
            py++;
            isRunaway();
            if(isRunaway()){
                py--;
            }else{
                eventHanding(num);//处理事件
            }
            face=2;
        break;
        case 3:
            px--;
            if(isRunaway()){
                px++;
            }else{
                eventHanding(num);//处理事件
            }
            face=3;
        break;
        case 4:
            px++;
            if(isRunaway()){
                px--;
            }else{
                eventHanding(num);//处理事件
            }
            face=4;
        break;
    }
    hero();
    showInfo();
}
//人物移动后判断是否超出边界
function isRunaway(){
    if(px>10||px<0||py>10||py<0){
        return true;
    }else{
        return false;
    }
}
//不能按指定方向移动
function cantmove(num){
    switch(num){
        case 1:
        py++;
        break;
        case 2:
        py--;
        break;
        case 3:
        px++;
        break;
        case 4:
        px--;
        break;
    }
}
//设置到过的最高层，在上楼时执行
function setVisited(){
    if(visited<=floor){
        visited=floor;
    }
}
//升级
function levelUp(sjcs){//sjcs升级次数
    for(i=0;i<sjcs;i++){
        hp=hp+1000;
        att=att+7;
        def=def+7;
        rank++;
    }
}
//能否战斗，会死不战斗，胜利战斗
function canfighting(m_x){//m_x怪物的编号
  var fhp=hp;
  var fatt=att;
  var fdef=def;
  var mhp=monster[m_x][0];
  var matt=monster[m_x][1];
  var mdef=monster[m_x][2];
  var giveAtt=fatt-mdef;
  var getAtt=matt-fdef;
  if(getAtt<0){
    getAtt=0;
  }
  if(giveAtt>0&&getAtt==0){
        return true;
  }else if(giveAtt>0&&getAtt>0){
    mhp=mhp-giveAtt;
    while(mhp>0){
        fhp=fhp-getAtt;
        mhp=mhp-giveAtt;
    }
    if(fhp>0){
        return true;
    }else{
        return false;
    }
  }
}
//打啊
function attMonster(m_x){
  var fhp=hp;
  var fatt=att;
  var fdef=def;
  var mhp=monster[m_x][0];
  var matt=monster[m_x][1];
  var mdef=monster[m_x][2];
  var giveAtt=fatt-mdef;
  var getAtt=matt-fdef;
  if(getAtt<0){
    getAtt=0;
  }
  mhp=mhp-giveAtt;
    while(mhp>0){
        fhp=fhp-getAtt;
        mhp=mhp-giveAtt;
    }  
    hp=fhp;
}
//你从怪物的尸体上得到了什么
function youGetFromMonster(m_x){
    gold=gold+monster[m_x][3];
    exp=exp+monster[m_x][4];
    onLog("你得到了"+monster[m_x][3]+"金币和"+monster[m_x][3]+"点经验");
}
//事件触发器
function  eventHanding(num){
    /*这里是遇到怪物的基础事件。战斗，得到基础奖励*/
    if(rawFloorData[floor][py][px]<=33&&rawFloorData[floor][py][px]>=0){
            var an_logo_num=rawFloorData[floor][py][px];
            if(canfighting(an_logo_num)){
                rawFloorData[floor][py][px]=400;
                attMonster(an_logo_num);
                youGetFromMonster(an_logo_num);
            }else{
                onLog("你个垃圾");
                cantmove(num);
            }
    }
    /*特殊事件处理*/
    if(rawFloorData[4][3][5]==400){
        rawFloorData[4][2][5]=400;
    }
    if(rawFloorData[7][2][5]==400||rawFloorData[7][6][5]==400||
            rawFloorData[7][4][7]==400||rawFloorData[7][4][3]==400){
        rawFloorData[7][3][5]=400;
        rawFloorData[7][5][5]=400;
        rawFloorData[7][4][6]=400;
        rawFloorData[7][4][4]=400;
    }
    if(rawFloorData[13][5][3]==400){
        rawFloorData[13][5][4]=400;
        rawFloorData[13][6][3]=400;
    }
    if(rawFloorData[14][5][5]==400){
        rawFloorData[14][4][5]=400;
    }
    if(rawFloorData[18][6][5]==400){
        rawFloorData[18][5][5]=400;
    }
    if(rawFloorData[2][6][8]==400){
        rawFloorData[2][7][7]=400;
        rawFloorData[2][7][9]=400;
    }
    if(rawFloorData[19][5][2]==400){
        rawFloorData[19][6][2]=400;
    }
    if(rawFloorData[19][5][7]==400){
        rawFloorData[19][6][7]=400;
    }
    switch(rawFloorData[floor][py][px]){
        /*上楼*/
        case 404:
            floor++;//楼层+1
            setVisited();
            for(i=0;i<11;i++){//找到上一层的下楼楼梯口
                for(j=0;j<11;j++){
                    if(rawFloorData[floor][i][j]==405){
                        px=j;
                        py=i;
                    }
                }
            }
            if(floor==21){
                px=5;
                py=5;
                onLog("风之罗盘被魔王毁灭，打败魔王获得胜利。");
                compass = false;
            }
            refreshMap();
        break;
        /*下楼*/
        case 405:
            floor--;
            for(i=0;i<11;i++){//找到下一层的上楼楼梯口
                for(j=0;j<11;j++){
                    if(rawFloorData[floor][i][j]==404){
                        px=j;
                        py=i;
                    }
                }
            }
            refreshMap();
        break;
        /*撞墙*/
        case 401:
            cantmove(num);
        break;
        /*不能进入岩浆*/
        case 402:
            cantmove(num);
        break;
        /*不能进入星空*/
        case 403:
            cantmove(num);
        break;
        case 406:
            cantmove(num);
        break;
        case 407:
            if(floor==3){
                initShop("+800生命值/25gold","+4攻击力/25gold","+4防御力/25gold","离开商店");
                onShop();
            }
            if(floor==11){
                initShop("+4000生命值/100gold","+20攻击力/100gold","+20防御力/100gold","离开商店");
                onShop();
            }
            cantmove(num);
        break;
        case 408:
            cantmove(num);
        break;
        /*道具的获得事件*/
        case 100:
            onLog('获得 黄色钥匙。');
            yellowkey++;
            rawFloorData[floor][py][px]=400;
            break;
        case 101:
            onLog('获得 蓝色钥匙。');
            bluekey++;
            rawFloorData[floor][py][px]=400;
            break;
        case 102:
            onLog('获得 红色钥匙。');
            redkey++;
            rawFloorData[floor][py][px]=400;
            break;
        case 103:
            onLog('获得 钥匙盒。<br/>所有颜色钥匙各增加1把。');
            yellowkey++;
            bluekey++;
            redkey++;
            rawFloorData[floor][py][px]=400;
            break;
        case 105:
            onLog('获得 红宝石。<br/>攻击力+5。');
            att += 5;
            rawFloorData[floor][py][px]=400;
            break;
        case 106:
            onLog('获得 蓝宝石。<br/>防御力+5。');
            def += 5;
            rawFloorData[floor][py][px]=400;
            break;
        case 107:
            onLog('获得 绿宝石。<br/>攻击力、防御力+5。');
            att += 5;
            def += 5;
            rawFloorData[floor][py][px]=400;
            break;
        case 108:
            onLog('获得 大血瓶。<br/>生命+500。');
            hp += 500;
            rawFloorData[floor][py][px]=400;
            break;
        case 109:
            onLog('获得 小血瓶。<br/>生命+200。');
            hp += 200;
            rawFloorData[floor][py][px]=400;
            break;
        case 110:
            onLog('获得 大金币。<br/>金币+300。');
            gold += 300;
            rawFloorData[floor][py][px]=400;
            break;
        case 111:
            onLog('获得 十字架。<br/>仙子的物品，能释放出强大的力量。');
            cross = true;
            feary++;
            rawFloorData[floor][py][px]=400;
            break;
        case 112:
            onLog('获得 圣光徽章。<br/>用神圣的光芒照耀敌人，显示敌人的能力。<br/>&lt;L&gt;键发动，显示怪物的详细资料。');
            badge = true;
            rawFloorData[floor][py][px]=400;
            break;
        case 113:
            onLog('获得 风之罗盘。<br/>依靠风的力量快速移动。<br/>&lt;J&gt;键发动，可快速到达已经经过的楼层。');
            compass = true;
            rawFloorData[floor][py][px]=400;
            break;
        case 114:
            if (floor == 6) {
                onLog('获得 小飞羽，提升1级！');
                levelUp(1);
                rawFloorData[floor][py][px]=400;
            }
            else if (floor == 13) {
                onLog('获得 大飞羽，提升3级！');
                levelUp(3);
                rawFloorData[floor][py][px]=400;
            }
            break;
        case 115:
            onLog('获得 圣水，生命值翻倍！');
            hp *= 2;
            rawFloorData[floor][py][px]=400;
            break;
        case 116:
            onLog('获得 星光神锒。<br/>注入了星光力量的锄头。');
            hammer = true;
            rawFloorData[floor][py][px]=400;
            break;
        case 117:
            onLog('获得 铁剑。<br/>攻击力+10。');
            att += 10;
            rawFloorData[floor][py][px]=400;
            break;
        case 118:
            onLog('获得 青锋剑。<br/>攻击力+70。');
            att += 70;
            rawFloorData[floor][py][px]=400;
            break;
        case 119:
            onLog('获得 星光神剑。<br/>攻击力+150。');
            att += 150;
            rawFloorData[floor][py][px]=400;
            break;
        case 120:
            onLog('获得 铁盾。<br/>防御力+10。');
            def += 10;
            rawFloorData[floor][py][px]=400;
            break;
        case 121:
            onLog('获得 黄金盾。<br/>防御力+85。');
            def += 85;
            rawFloorData[floor][py][px]=400;
            break;
        case 122:
            onLog('获得 光芒神盾。<br/>防御力+190。');
            def += 190;
            rawFloorData[floor][py][px]=400;
            break;
        case 123:
            rawFloorData[floor][py][px]=400;
        break;
        case 500:
            if(yellowkey>0){
                yellowkey--;
                rawFloorData[floor][py][px]=400;
            }else{
                cantmove(num);
                 onLog('你有钥匙吗？'); 
            }
        break;
        case 501:
            if(bluekey>0){
                bluekey--;
                rawFloorData[floor][py][px]=400;
            }else{
               cantmove(num);
               onLog('你有钥匙吗？'); 
            }
        break;
        case 502:
            if(redkey>0){
                redkey--;
                rawFloorData[floor][py][px]=400;
            }else{
               cantmove(num);
               onLog('你有钥匙吗？'); 
            }
        break;
        case 503:
            cantmove(num);
            onLog("这门非特殊技能者无法打开");
        break;
        case 504:
            cantmove(num);
            onLog("去打败守卫才能开门")
        break;
        case 600:
            if(feary==0){
                onLog('我是仙子我会给你一串钥匙');
                bluekey++;
                redkey++;
                yellowkey++;
                feary++;
                onLog('得到了钥匙串');
                rawFloorData[floor][py][px]=400;
                rawFloorData[floor][py][px-1]=600;
                blocks[py][px-1].style.background='url(./img/600.png)';

            }else if(feary==1){
                onLog('你快去救公主吧');
                cantmove(num);
            }else if(feary==2&&cross==true){
                onLog('你居然帮我找回了我的十字架，我帮你提升力量吧');
                cross=false;
                hp=hp+(hp-hp%3)/3;
                att=att+(att-att%3)/3;
                def=def+(def-def%3)/3;
                onLog('是不是感觉充满了力量,我要离开了，哈哈');
                rawFloorData[floor][py][px]=400;
                cantmove(num);
            }
        break;
        case 601:
            if (floor == 2) {
                onLog("你救了我，给你把+30的剑吧");
                att += 30;
                showInfo();
                rawFloorData[floor][py][px] = 400;
                refreshMap();
            }else if(floor == 5){
                initShop("提升一级/100exp","+5攻击力/30exp","+5防御力/30exp","离开商店");
                onShop();
            }else if(floor == 13){
                initShop("提升三级/270exp","+17攻击力/95exp","+17防御力/95exp","离开商店");
                onShop();
            }else if(floor ==15){
                if(exp<500){
                    onLog("有500经验我可以把我+120的剑给你");
                }else{
                    onLog("强制吸取你500点经验，我的+120的剑给你了")
                    exp-=500;
                    att+=120;
                    showInfo();
                    rawFloorData[floor][py][px] = 400;
                    refreshMap();
                }
            }
            cantmove(num);
        break;
        case 602:
            if(!hammer){
                onLog('我是小偷,我帮你打开了2层的门,把我的神器星光神锒交给我，我还可以帮你打开18层的暗道');
                rawFloorData[2][6][1] = 400;
                cantmove(num);
            }else{
                onLog('我帮你打开了18层的暗道');
                hammer=false;
                rawFloorData[18][8][5] = 400;  // 18层路障消失
                rawFloorData[18][9][5] = 400;
                rawFloorData[floor][py][px] = 400;
                rawFloorData[21][1][3] = 602;
                cantmove(num);
            }
        break;
        case 603:
            if(floor==2){
                onLog("你救了我，给你把+30的盾吧");
                def += 30;
                showInfo();
                rawFloorData[floor][py][px] = 400;
                refreshMap();
            }else if(floor==5){
                initShop("黄钥匙/10gold","蓝钥匙/50gold","红钥匙/100gold","不再买钥匙");
                onShop();
            }else if(floor==12){
                initShop("7gold/黄钥匙","35gold/蓝钥匙","70gold/红钥匙","不再卖钥匙");
                onShop();
            }else if(floor==15){
                if(gold<500){
                    onLog("有500gold我可以把我+120的盾给你");
                }else{
                    onLog("你居然凑到了500gold，强制收取了，我的+120的盾给你了")
                    gold-=500;
                    def+=120;
                    showInfo();
                    rawFloorData[floor][py][px] = 400;
                    refreshMap();
                }
            }
            cantmove(num);
        break;
        case 604:
            if(floor==18){
                onLog('美丽的公主：父王怎么派了个土鳖来救我,魔王用法力把我带到了21层，救我');
                rawFloorData[18][4][5] = 400;
                rawFloorData[18][10][10] = 404;
                rawFloorData[21][1][7]=604;
                refreshMap();
            }
            if(floor==21){
                if(rawFloorData[21][1][5] != 400){
                    onLog("快去杀死那只魔王啊");
                }else{
                    onLog("勇士你获得了胜利，带着公主去做该做的事情吧");
                }
            }
            cantmove(num);
        break;
    }
}
function gofloor(fly){//飞到该楼层
    //去除人物
    blocks[py][px].style.background='url(./img/400.png';
    floor=fly;
    //刷新地图
    refreshMap();
    showInfo();
    //画上人物
    for(i=0;i<11;i++){//找到上一层的下楼楼梯口
        for(j=0;j<11;j++){
            if(rawFloorData[floor][i][j]==405){
                px=j;
                py=i;
            }
        }
    }
    if(fly==0){
        px=5;
        py=10;
    }
    hero();
}
function canfloor(fly){//能否飞到该楼层
    if(fly<=visited)
        return true;
    else
        return false;
}
//千里眼界面要用到的方法
function floorMonsterList(){//返回当前楼层的怪兽种类数组下标
    var listMonster = new Array();
    var theList=new Array();
    for(i=0;i<34;i++){
        listMonster[i]=0;
    }
    for(i=0;i<11;i++){
        for(j=0;j<11;j++){
            if(rawFloorData[floor][i][j]<34){
                listMonster[rawFloorData[floor][i][j]]=1;
            }
        }
    }
    for(i=0,j=0;i<34;i++){
        if(listMonster[i]==1){
            theList[j]=i;
            j++;
        }
    }
    return theList;
}
function ifYouAtt(m_x){//如果你攻击该怪兽,你将受到的伤害
    var hurt;
    if(!canfighting(m_x)){
        hurt='?';
    }else{
        hurt=0;
        var fhp=hp;
        var fatt=att;
        var fdef=def;
        var mhp=monster[m_x][0];
        var matt=monster[m_x][1];
        var mdef=monster[m_x][2];
        var giveAtt=fatt-mdef;
        var getAtt=matt-fdef;
        if(getAtt<0){
          getAtt=0;
        }
        mhp=mhp-giveAtt;
            while(mhp>0){
                fhp=fhp-getAtt;
                mhp=mhp-giveAtt;
                hurt=hurt+getAtt;
            }   
    }
    return hurt;
}
//买商品的方法
function buyone(){
    if(floor==3){
        gold=gold-25;
        if(gold>=0){
            hp+=800;
            showInfo();
        }else{
            gold+=25;
            offShop();
            onLog("屌丝没钱滚蛋");
        }
    }else if(floor==11){
        gold=gold-100;
        if(gold>=0){
            hp+=4000;
            showInfo();
        }else{
            gold+=100;
            offShop();
            onLog("屌丝没钱滚蛋");
        }
    }else if(floor==5&&px<5){//5层左侧那老头
        exp=exp-100;
        if(exp>=0){
            levelUp(1);
            showInfo();
        }else{
            exp+=100;
            offShop();
            onLog("经验不足");
        }
    }else if(floor==5&&px>5){//5层右侧那奸商
        gold=gold-10;
        if(gold>=0){
            yellowkey++;
            showInfo();
        }else{
            gold+=10;
            offShop();
            onLog("没钱的屌丝，滚开");
        }
    }else if(floor==12){
        yellowkey--;
        if(yellowkey>=0){
            gold+=7;
            showInfo();
        }else{
            yellowkey++;
            offShop();
            onLog("一手货一手钱");
        }
    }else if(floor==13){
        exp-=270;
        if(exp>=0){
            levelUp(3);
            showInfo();
        }else{
            exp+=270;
            offShop();
            onLog("经验不足");
        }
    }
}
function buytwo(){
    if(floor==3){
        gold=gold-25;
        if(gold>=0){
            att+=4;
            showInfo();
        }else{
            gold+=25;
            offShop();
            onLog("屌丝没钱滚蛋");
        }
    }else if(floor==11){
        gold=gold-100;
        if(gold>=0){
            att+=20;
            showInfo();
        }else{
            gold+=100;
            offShop();
            onLog("屌丝没钱滚蛋");
        }
    }else if(floor==5&&px<5){//5层左侧那老头
        exp=exp-30;
        if(exp>=0){
            att+=30;
            showInfo();
        }else{
            exp+=30;
            offShop();
            onLog("经验不足");
        }
    }else if(floor==5&&px>5){//5层右侧那奸商
        gold=gold-50;
        if(gold>=0){
            bluekey++;
            showInfo();
        }else{
            gold+=50;
            offShop();
            onLog("没钱的屌丝，滚开");
        }
    }else if(floor==12){
        bluekey--;
        if(bluekey>=0){
            gold+=35;
            showInfo();
        }else{
            bluekey++;
            offShop();
            onLog("一手货一手钱");
        }
    }else if(floor==13){
        exp-=95;
        if(exp>=0){
            att+=17;
            showInfo();
        }else{
            exp+=95;
            offShop();
            onLog("经验不足");
        }
    }
}
function buythree(){
    if(floor==3){
        gold=gold-25;
        if(gold>=0){
            def+=4;
            showInfo();
        }else{
            gold+=25;
            offShop();
            onLog("屌丝没钱滚蛋");
        }
    }else if(floor==11){
        gold=gold-100;
        if(gold>=0){
            def+=20;
            showInfo();
        }else{
            gold+=100;
            offShop();
            onLog("屌丝没钱滚蛋");
        }
    }else if(floor==5&&px<5){//5层左侧那老头
        exp=exp-30;
        if(exp>=0){
            def+=30;
            showInfo();
        }else{
            exp+=30;
            offShop();
            onLog("经验不足");
        }
    }else if(floor==5&&px>5){//5层右侧那奸商
        gold=gold-100;
        if(gold>=0){
            redkey++;
            showInfo();
        }else{
            gold+=100;
            offShop();
            onLog("没钱的屌丝，滚开");
        }
    }else if(floor==12){
        redkey--;
        if(redkey>=0){
            gold+=70;
            showInfo();
        }else{
            redkey++;
            offShop();
            onLog("一手货一手钱");
        }
    }else if(floor==13){
        exp-=95;
        if(exp>=0){
            def+=17;
            showInfo();
        }else{
            exp+=95;
            offShop();
            onLog("经验不足");
        }
    }
}
/*--------------控制层--------------------------------*/
/*--------------视图层--------------------------------*/
//在页面加载的时候先把游戏主区域的div创建完毕
window.onload = function (){
    gameArea=$("gameArea");
    var t;
    for (i = 0; i < 11; i++) {
        blocks[i] = new Array(); 
        for (j = 0; j < 11; j++) {
            t = document.createElement('div');
            t.style.background = 'url(./img/'+rawFloorData[floor][i][j]+'.png)';
            t.className = 'blocks';
            t.style.top = i * 32 + 'px';
            t.style.left = j * 32 + 'px';
            blocks[i][j] = t;
            gameArea.appendChild(t);
        }
    }
    hero();
    showInfo();
    j=$("j");
    var j_n;
    for(i=0;i<23;i++){
        j_n=document.createElement('div');
        j_n.innerHTML=i;
        j_n.className = 'j_block';
        j_box[i]=j_n;
        j.appendChild(j_n);
    }
    j_box[0].style.background='#000';
};
//刷新地图，用于上下楼层时候刷新界面
function refreshMap(){
    for (i = 0; i < 11; i++) {
        for (j = 0; j < 11; j++) {
            blocks[i][j].style.background = 'url(./img/'+rawFloorData[floor][i][j]+'.png)';
        }
    }
}
//刷新游戏旁边的人物属性信息
function showInfo(){
    $('floor').innerHTML=floor;
    $('att').innerHTML=att;
    $('def').innerHTML=def;
    $('gold').innerHTML=gold;
    $('exp').innerHTML=exp;
    $('hp').innerHTML=hp;
    $('rank').innerHTML=rank;
    $('redkey').innerHTML=redkey;
    $('bluekey').innerHTML=bluekey;
    $('yellowkey').innerHTML=yellowkey;
}
//画人物到游戏界面上
function hero(){
    blocks[py][px].style.background = 'url(./img/player_'+face+'.gif)';
}
//显示游戏信窗口
function onLog(msg){
    $("log").innerHTML=msg;
    $("log-on-off").style.display = 'block';
    isonlog=true;
}
//关闭游戏信息窗口
function off(){
    $("log-on-off").style.display = "none";
    isonlog=false;
}
//显示电梯界面J
function onJ(){
    if(compass==true){//只有有风之罗盘的人才能够做电梯
        $("j").style.display = 'block';
        isonJ=true;
    }
}
function offJ(){
    $("j").style.display = 'none';
    isonJ=false;
}
//移除原来的人物图画
function wipeHero(){
     blocks[py][px].style.background = 'url(./img/'+rawFloorData[floor][py][px]+'.png)';
}
function showLook(){//构造千里眼界面
    var list = floorMonsterList();
    var size =list.length;
    var l=$("l");
    var str=new Array();
    str[0]="怪物图标";
    str[1]="怪物名称";
    str[2]="怪物生命";
    str[3]="怪物攻击";
    str[4]="怪物防御";
    str[5]="受到伤害";
    str[6]="金币/经验";
    var tableNode=document.createElement("table");
    mycurrent_row = document.createElement("tr");

    for(var i = 0; i < 7; i++){
        th=document.createElement("th");
        currenttext = document.createTextNode(str[i]);
        th.appendChild(currenttext);
        mycurrent_row.appendChild(th);
    }
    tableNode.appendChild(mycurrent_row);
    for(var j = 0; j < size; j++) {
        // 创建一个<tr>元素
        mycurrent_row = document.createElement("tr");
        for(var i = 0; i < 7; i++) {
        // 创建一个<td>元素
            mycurrent_cell = document.createElement("td");
            switch(i){
                case 0:
                currenttext = document.createElement("div");
                currenttext.style.background = 'url(./img/'+list[j]+'.png)';
                currenttext.className='l-m-div';
                break;
                case 1:
                currenttext = document.createTextNode(monster[list[j]][5]);
                break;
                case 2:
                currenttext = document.createTextNode(monster[list[j]][0]);
                break;
                case 3:
                currenttext = document.createTextNode(monster[list[j]][1]);
                break;
                case 4:
                currenttext = document.createTextNode(monster[list[j]][2]);
                break;
                case 5:
                currenttext = document.createTextNode(ifYouAtt(list[j]));
                break;
                case 6:
                currenttext = document.createTextNode(monster[list[j]][3]+"/"+monster[list[j]][4]);
                break;
            }
            // 将创建的文本节点添加到<td>里
            mycurrent_cell.appendChild(currenttext);
            // 将列<td>添加到行<tr>
            mycurrent_row.appendChild(mycurrent_cell);
        }
        tableNode.appendChild(mycurrent_row);
    }
    l.appendChild(tableNode);
}
//显示千里眼界面
function onL(){
    if(badge){
        showLook();//构造千里眼界面
        $("l").style.display = 'block';
        isonL=true;
    }
}
function offL(){
    //清空千里眼界面
    for(i=1;$("l").childNodes[i]!=null;i++){
        $("l").removeChild($("l").childNodes[i]);
    }
    $("l").style.display = 'none';
    isonL=false;
}
//构造商店框
function initShop(str1,str2,str3,str4){
    $("shop-1").innerHTML=str1;
    $("shop-2").innerHTML=str2;
    $("shop-3").innerHTML=str3;
    $("shop-4").innerHTML=str4;
}
//显示商店框
function onShop(){
    $("shop").style.display = 'block';
    $("shop-"+shopnum).style.background='#000';
    isonShop=true;
}
function offShop(){
    $("shop").style.display = 'none';
    $("shop-"+shopnum).style.background='#2E64FE';
    shopnum=1;
    isonShop=false;
}
/*--------------视图层--------------------------------*/
/*--------------数据层--------------------------------*/
/*Dom对象*/
var gameArea;

/*通過blocks[i][j]找到對應的DIV*/
var blocks = new Array();
//怪物的数据
var monster = [
    /*[ 0][  1][  2][   3][  4][   5][  6]*/
    /*[hp][att][def][gold][exp][name][logo] */
    [50, 20, 1, 1, 1, "绿头怪", 0],
    [70, 15, 2, 2, 2, "红头怪", 1],
    [200, 35, 10, 5, 5, "青头怪", 2],
    [100, 20, 5, 3, 3, "小蝙蝠", 3],
    [110, 25, 5, 5, 4, "骷髅人", 4],
    [150, 40, 20, 8, 6, "骷髅士兵", 5],
    [125, 50, 25, 10, 7, "初级法师", 6],
    [300, 75, 45, 13, 10, "兽面人", 7],
    [250, 120, 70, 20, 17, "麻衣法师", 8,'100'],
    [150, 65, 30, 10, 8, "大蝙蝠", 9],
    [550, 160, 90, 25, 20, "红蝙蝠", 10],
    [400, 90, 50, 15, 12, "骷髅队长", 11],
    [500, 400, 260, 47, 45, "红衣法师", 12, '300'],
    [500, 115, 65, 15, 15, "石头怪人", 13],
    [450, 150, 90, 22, 19, "初级卫兵", 14],
    [850, 350, 200, 45, 40, "金卫士", 15],
    [1200, 620, 520, 65, 75, "双手剑士", 16],
    [100, 200, 110, 30, 25, "高级法师", 17],
    [1300, 300, 150, 40, 35, "白衣武士", 18, 'hp/6'],
    [900, 750, 650, 77, 70, "金队长", 19],
    [900, 450, 330, 50, 50, "兽面武士", 20],
    [1250, 500, 400, 55, 55, "冥卫兵", 21],
    [1500, 560, 460, 60, 60, "高级卫兵", 22],
    [2500, 900, 850, 84, 75, "冥队长", 23],
    [2000, 680, 590, 70, 65, "冥战士", 24],
    [1200, 980, 900, 88, 75, "灵武士", 25],
    [3100, 900, 850, 92, 80, "影子战士", 26],
    [1500, 830, 730, 80, 70, "灵法师", 27, 'hp/5'],
    [15000, 1000, 1000, 100, 100, "红衣魔王", 28],
    [700, 250, 125, 32, 30, "怪王", 29],
    [2000, 1106, 973, 312, 275, "灰灵法师", 30],
    [20000, 1333, 1333, 133, 133, "绿袍魔王", 31],
    [30000, 1700, 1500, 250, 220, "冥灵魔王", 32],
    [45000, 2550, 2000, 250, 220, "冥灵魔王", 33],
];
/*各个楼层的怪物，道具，环境，门和NPC分布*/
var rawFloorData = [
    [ // 0
        [403, 403, 403, 403, 403, 404, 403, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 400, 403, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 400, 403, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 400, 403, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 400, 403, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 400, 403, 403, 403, 403, 403],
        [401, 403, 403, 403, 403, 400, 403, 403, 403, 403, 401],
        [401, 401, 401, 401, 401, 500, 401, 401, 401, 401, 401],
        [402, 401, 402, 401, 400, 600, 400, 401, 402, 401, 402],
        [402, 402, 402, 402, 402, 400, 402, 402, 402, 402, 402],
        [402, 402, 402, 402, 402, 400, 402, 402, 402, 402, 402]

    ],
    [ // 1
        [404, 400, 100, 0, 1, 0, 400, 400, 400, 400, 400],
        [401, 401, 401, 401, 401, 401, 401, 401, 401, 401, 400],
        [109, 400, 4, 500, 400, 401, 109, 100, 109, 401, 400],
        [100, 4, 105, 401, 400, 401, 109, 100, 109, 401, 400],
        [401, 500, 401, 401, 400, 401, 401, 401, 2, 401, 400],
        [100, 5, 400, 401, 400, 500, 6, 0, 3, 401, 400],
        [106, 400, 101, 401, 400, 401, 401, 401, 401, 401, 400],
        [401, 500, 401, 401, 400, 400, 400, 400, 400, 400, 400],
        [400, 5, 400, 401, 401, 502, 401, 401, 401, 500, 401],
        [109, 108, 100, 401, 102, 400, 400, 401, 100, 7, 101],
        [109, 112, 100, 401, 400, 405, 400, 401, 100, 100, 100]
    ],
    [ // 2
        [405, 401, 400, 19, 400, 401, 105, 106, 100, 102, 401],
        [400, 401, 106, 401, 108, 401, 105, 106, 100, 101, 401],
        [400, 401, 100, 401, 100, 401, 105, 106, 100, 15, 401],
        [400, 401, 100, 401, 100, 401, 401, 401, 401, 500, 401],
        [400, 401, 400, 401, 400, 400, 400, 500, 400, 400, 401],
        [400, 401, 500, 401, 401, 500, 401, 401, 500, 401, 401],
        [400, 503, 400, 400, 400, 400, 401, 400, 15, 400, 401],
        [400, 401, 500, 401, 401, 501, 401, 504, 401, 504, 401],
        [400, 401, 100, 401, 108, 109, 401, 400, 401, 400, 401],
        [400, 401, 100, 401, 108, 109, 401, 400, 401, 400, 401],
        [404, 401, 105, 401, 108, 109, 401, 601, 401, 603, 401]
    ],
    [ // 3
        [117, 1, 100, 401, 406, 407, 408, 401, 401, 401, 401],
        [1, 100, 400, 401, 400, 400, 400, 401, 400, 3, 400],
        [100, 4, 400, 401, 401, 500, 401, 401, 400, 401, 400],
        [401, 500, 401, 401, 400, 4, 400, 401, 100, 401, 1],
        [400, 400, 400, 401, 401, 401, 400, 401, 100, 401, 3],
        [0, 401, 400, 3, 1, 3, 400, 401, 100, 401, 1],
        [0, 401, 401, 401, 401, 401, 400, 400, 400, 401, 400],
        [400, 400, 400, 400, 400, 401, 401, 500, 401, 401, 400],
        [401, 401, 401, 401, 3, 401, 1, 400, 1, 401, 400],
        [401, 400, 400, 400, 400, 401, 105, 3, 100, 401, 400],
        [405, 400, 401, 401, 401, 401, 106, 108, 100, 401, 404]
    ],
    [ // 4
        [400, 2, 400, 401, 400, 602, 400, 401, 400, 2, 400],
        [500, 401, 500, 401, 400, 400, 400, 401, 500, 401, 500],
        [400, 401, 400, 401, 401, 504, 401, 401, 400, 401, 400],
        [400, 401, 4, 401, 9, 10, 9, 401, 4, 401, 400],
        [3, 401, 109, 401, 106, 9, 106, 401, 109, 401, 3],
        [3, 401, 109, 401, 401, 502, 401, 401, 109, 401, 3],
        [1, 401, 400, 401, 7, 14, 7, 401, 400, 401, 1],
        [400, 401, 400, 401, 105, 7, 105, 401, 400, 401, 400],
        [400, 401, 400, 401, 401, 501, 401, 401, 400, 401, 400],
        [400, 401, 400, 401, 100, 400, 100, 401, 400, 401, 400],
        [404, 401, 400, 2, 400, 400, 400, 2, 400, 401, 405]
    ],
    [ // 5
        [103, 401, 109, 401, 108, 6, 400, 400, 6, 100, 101],
        [400, 401, 105, 401, 6, 400, 400, 400, 400, 6, 100],
        [3, 401, 400, 401, 4, 400, 401, 401, 500, 401, 401],
        [400, 500, 400, 401, 120, 4, 401, 400, 7, 4, 603],
        [3, 401, 6, 401, 401, 401, 401, 400, 400, 400, 4],
        [105, 401, 400, 400, 400, 3, 4, 400, 400, 400, 400],
        [106, 401, 401, 2, 401, 401, 401, 401, 400, 400, 400],
        [400, 601, 401, 2, 401, 400, 400, 400, 7, 14, 400],
        [401, 401, 401, 3, 401, 500, 401, 501, 401, 500, 401],
        [400, 400, 401, 400, 401, 3, 401, 106, 500, 400, 401],
        [405, 400, 3, 400, 400, 400, 401, 100, 401, 404, 401]
    ],
    [ // 6
        [114, 11, 401, 106, 401, 100, 29, 110, 401, 108, 108],
        [11, 100, 401, 105, 401, 400, 100, 29, 401, 13, 108],
        [100, 10, 501, 400, 501, 10, 400, 100, 401, 400, 13],
        [400, 400, 401, 14, 401, 400, 400, 400, 401, 12, 400],
        [401, 401, 401, 502, 401, 401, 401, 401, 401, 500, 401],
        [400, 400, 17, 400, 100, 100, 100, 400, 17, 400, 400],
        [400, 401, 401, 401, 401, 401, 401, 401, 401, 401, 401],
        [400, 401, 9, 500, 9, 400, 400, 400, 400, 400, 401],
        [400, 401, 500, 401, 500, 401, 401, 401, 401, 501, 401],
        [400, 401, 9, 401, 400, 400, 401, 401, 400, 400, 401],
        [400, 400, 400, 401, 404, 400, 500, 500, 400, 405, 401]
    ],
    [ // 7
        [404, 400, 400, 400, 400, 400, 400, 400, 401, 401, 401],
        [401, 401, 400, 10, 401, 501, 401, 11, 400, 401, 401],
        [401, 400, 10, 106, 401, 18, 401, 105, 11, 400, 401],
        [400, 400, 401, 401, 401, 504, 401, 401, 401, 400, 400],
        [400, 400, 501, 18, 504, 111, 504, 18, 501, 400, 400],
        [400, 401, 401, 401, 401, 504, 401, 401, 401, 401, 400],
        [400, 401, 109, 105, 401, 18, 401, 106, 109, 401, 400],
        [400, 401, 100, 109, 401, 501, 401, 109, 100, 401, 400],
        [400, 401, 401, 101, 101, 108, 101, 101, 401, 401, 400],
        [400, 400, 401, 401, 401, 502, 401, 401, 401, 400, 400],
        [401, 400, 400, 500, 405, 400, 400, 500, 400, 400, 401]
    ],
    [ // 8
        [405, 401, 400, 400, 400, 400, 401, 100, 400, 11, 400],
        [400, 401, 400, 401, 401, 500, 401, 500, 401, 401, 400],
        [400, 401, 400, 401, 400, 400, 501, 400, 400, 401, 105],
        [400, 401, 400, 401, 8, 401, 401, 401, 9, 401, 2],
        [9, 401, 400, 401, 109, 401, 404, 400, 400, 401, 2],
        [10, 401, 106, 401, 109, 401, 401, 401, 401, 401, 400],
        [9, 401, 2, 401, 400, 400, 400, 401, 400, 10, 400],
        [400, 401, 2, 401, 401, 401, 14, 401, 500, 401, 401],
        [400, 401, 400, 11, 400, 401, 11, 401, 400, 400, 400],
        [400, 401, 401, 401, 500, 401, 400, 401, 401, 401, 400],
        [400, 400, 8, 400, 400, 401, 400, 29, 18, 29, 400]
    ],
    [ // 9
        [113, 100, 400, 401, 401, 401, 400, 400, 400, 401, 400],
        [100, 400, 20, 500, 400, 400, 400, 401, 400, 500, 11],
        [401, 500, 401, 401, 400, 401, 401, 401, 400, 401, 100],
        [400, 400, 400, 401, 400, 401, 400, 400, 400, 401, 100],
        [400, 400, 400, 502, 400, 401, 405, 401, 400, 401, 109],
        [401, 501, 401, 401, 400, 401, 401, 401, 400, 401, 401],
        [106, 12, 105, 401, 8, 401, 404, 401, 400, 401, 109],
        [401, 500, 401, 401, 400, 400, 400, 500, 400, 401, 100],
        [11, 109, 11, 401, 401, 501, 401, 401, 400, 401, 100],
        [101, 11, 109, 401, 13, 8, 13, 401, 400, 500, 11],
        [118, 101, 11, 500, 108, 13, 108, 401, 400, 401, 400]
    ],
    [ // 10
        [400, 401, 401, 106, 20, 401, 20, 105, 401, 401, 400],
        [400, 400, 401, 401, 500, 401, 500, 401, 401, 400, 12],
        [400, 400, 400, 400, 400, 401, 400, 400, 400, 12, 108],
        [400, 401, 400, 401, 401, 401, 401, 401, 400, 401, 401],
        [9, 401, 400, 400, 100, 100, 100, 400, 400, 401, 100],
        [10, 401, 400, 401, 401, 401, 401, 500, 401, 401, 100],
        [9, 401, 400, 400, 400, 405, 401, 400, 500, 10, 400],
        [400, 401, 401, 401, 401, 401, 401, 500, 401, 401, 400],
        [400, 401, 109, 106, 105, 401, 400, 10, 400, 401, 100],
        [400, 401, 109, 106, 105, 502, 8, 401, 8, 401, 100],
        [404, 401, 109, 106, 105, 401, 101, 401, 101, 401, 109]
    ],
    [ // 11
        [109, 401, 100, 401, 101, 401, 102, 401, 108, 121, 108],
        [109, 401, 100, 401, 101, 401, 102, 401, 21, 22, 21],
        [109, 401, 100, 401, 101, 401, 102, 401, 400, 21, 400],
        [500, 401, 500, 401, 500, 401, 500, 401, 401, 501, 401],
        [400, 400, 400, 400, 400, 401, 400, 400, 400, 400, 400],
        [500, 401, 401, 501, 401, 401, 401, 501, 401, 401, 500],
        [106, 401, 400, 21, 108, 16, 108, 21, 400, 401, 105],
        [106, 401, 20, 401, 401, 401, 401, 401, 20, 401, 105],
        [106, 401, 20, 401, 406, 407, 408, 401, 20, 401, 105],
        [401, 401, 502, 401, 109, 400, 109, 401, 502, 401, 401],
        [405, 400, 400, 400, 400, 400, 400, 400, 400, 400, 404]
    ],
    [ // 12
        [603, 106, 401, 400, 15, 19, 15, 400, 401, 108, 116],
        [105, 400, 401, 400, 401, 500, 401, 400, 401, 400, 108],
        [400, 400, 401, 400, 401, 19, 401, 400, 401, 400, 400],
        [400, 16, 401, 400, 401, 100, 401, 400, 401, 25, 400],
        [16, 24, 401, 400, 401, 100, 401, 400, 401, 27, 25],
        [401, 501, 401, 400, 401, 109, 401, 400, 401, 501, 401],
        [400, 400, 400, 400, 401, 109, 401, 400, 400, 400, 400],
        [401, 401, 401, 400, 401, 401, 401, 400, 401, 401, 401],
        [106, 16, 500, 21, 21, 22, 21, 21, 500, 105, 106],
        [401, 401, 401, 401, 401, 501, 401, 401, 401, 401, 401],
        [404, 400, 400, 400, 400, 400, 400, 400, 400, 400, 405]
    ],
    [ // 13
        [400, 16, 400, 400, 400, 400, 400, 401, 400, 24, 400],
        [400, 401, 401, 401, 401, 401, 500, 401, 400, 401, 400],
        [400, 401, 400, 400, 400, 21, 400, 401, 400, 401, 400],
        [108, 401, 502, 401, 401, 401, 400, 401, 400, 401, 400],
        [15, 401, 400, 400, 24, 401, 21, 401, 105, 401, 400],
        [19, 401, 400, 23, 504, 401, 22, 401, 105, 401, 400],
        [15, 401, 24, 504, 601, 401, 21, 401, 105, 401, 106],
        [400, 401, 401, 401, 401, 401, 400, 401, 400, 401, 106],
        [400, 15, 400, 401, 400, 400, 400, 24, 400, 401, 106],
        [401, 401, 400, 401, 108, 401, 401, 401, 401, 401, 400],
        [405, 400, 400, 501, 400, 404, 401, 114, 23, 500, 400]
    ],
    [ // 14
        [401, 400, 25, 103, 404, 400, 400, 400, 400, 400, 401],
        [401, 400, 108, 401, 401, 401, 401, 401, 108, 400, 401],
        [401, 400, 401, 401, 401, 401, 401, 401, 401, 400, 401],
        [401, 400, 401, 401, 401, 115, 401, 401, 401, 400, 401],
        [401, 400, 401, 401, 401, 504, 401, 401, 401, 400, 401],
        [401, 400, 109, 401, 401, 24, 401, 401, 109, 400, 401],
        [401, 400, 403, 403, 401, 23, 401, 403, 403, 400, 401],
        [401, 400, 403, 403, 401, 24, 401, 403, 403, 400, 401],
        [401, 400, 403, 403, 401, 501, 401, 403, 403, 400, 401],
        [401, 21, 22, 21, 501, 400, 501, 21, 22, 21, 401],
        [401, 401, 401, 401, 401, 405, 401, 401, 401, 401, 401]
    ],
    [ // 15
        [400, 400, 400, 400, 405, 403, 404, 400, 400, 400, 400],
        [400, 403, 403, 403, 403, 403, 403, 403, 403, 403, 400],
        [400, 403, 403, 401, 401, 401, 401, 401, 403, 403, 400],
        [400, 403, 401, 401, 601, 401, 603, 401, 401, 403, 400],
        [400, 403, 401, 401, 106, 401, 106, 401, 401, 403, 400],
        [400, 403, 401, 401, 105, 401, 105, 401, 401, 403, 400],
        [400, 403, 403, 401, 400, 401, 400, 401, 403, 403, 400],
        [400, 403, 403, 401, 500, 401, 500, 401, 403, 403, 400],
        [400, 403, 403, 403, 400, 400, 400, 403, 403, 403, 400],
        [400, 403, 403, 403, 403, 502, 403, 403, 403, 403, 400],
        [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400]
    ],
    [ // 16
        [403, 403, 403, 403, 403, 400, 405, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 400, 403, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 400, 403, 403, 403, 403, 403],
        [403, 403, 403, 403, 401, 502, 401, 403, 403, 403, 403],
        [403, 403, 403, 401, 401, 400, 401, 401, 403, 403, 403],
        [403, 403, 403, 401, 401, 28, 401, 401, 403, 403, 403],
        [403, 403, 403, 401, 401, 400, 401, 401, 403, 403, 403],
        [403, 403, 403, 401, 401, 404, 401, 401, 403, 403, 403],
        [403, 403, 403, 403, 401, 401, 401, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403]
    ],
    [ // 17
        [403, 25, 23, 400, 400, 400, 400, 400, 400, 400, 25],
        [403, 23, 403, 403, 403, 403, 403, 403, 403, 403, 400],
        [403, 400, 403, 25, 400, 400, 400, 400, 400, 400, 25],
        [403, 400, 403, 400, 403, 403, 403, 403, 403, 403, 403],
        [403, 400, 403, 400, 403, 25, 400, 400, 400, 25, 403],
        [403, 400, 403, 25, 400, 400, 403, 403, 403, 400, 403],
        [403, 400, 403, 403, 403, 403, 403, 25, 400, 25, 403],
        [403, 23, 403, 403, 403, 405, 403, 400, 403, 403, 403],
        [403, 25, 23, 400, 26, 400, 403, 25, 400, 400, 25],
        [403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 400],
        [404, 400, 400, 26, 400, 400, 400, 400, 400, 400, 25]
    ],
    [ // 18
        [403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403],
        [403, 403, 403, 403, 401, 401, 401, 403, 403, 403, 403],
        [403, 403, 403, 401, 401, 604, 401, 401, 403, 403, 403],
        [403, 403, 403, 401, 401, 504, 401, 401, 403, 403, 403],
        [403, 403, 403, 401, 401, 502, 401, 401, 403, 403, 403],
        [403, 403, 403, 403, 401, 502, 401, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 401, 403, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 401, 403, 403, 403, 403, 403],
        [405, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400]
    ],
    [ // 19
        [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
        [400, 403, 400, 403, 403, 403, 403, 403, 400, 403, 400],
        [400, 403, 400, 403, 403, 403, 403, 403, 400, 403, 400],
        [400, 403, 400, 403, 403, 404, 403, 403, 400, 403, 400],
        [400, 403, 400, 403, 403, 400, 403, 403, 400, 403, 400],
        [400, 403, 28, 403, 403, 32, 403, 403, 28, 403, 400],
        [400, 403, 504, 403, 403, 400, 403, 403, 504, 403, 400],
        [400, 403, 119, 403, 403, 400, 403, 403, 122, 403, 400],
        [400, 403, 403, 403, 403, 400, 403, 403, 403, 403, 400],
        [400, 403, 403, 403, 403, 400, 403, 403, 403, 403, 403],
        [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 405]
    ],
    [ // 20
        [26, 105, 18, 109, 23, 102, 23, 109, 18, 105, 26],
        [108, 403, 100, 403, 101, 403, 101, 403, 100, 403, 108],
        [403, 106, 18, 400, 25, 400, 25, 400, 18, 106, 403],
        [109, 403, 100, 403, 400, 405, 400, 403, 100, 403, 109],
        [23, 101, 25, 400, 400, 400, 400, 400, 25, 101, 23],
        [102, 403, 400, 403, 400, 403, 400, 403, 400, 403, 102],
        [23, 101, 25, 400, 400, 400, 400, 400, 25, 101, 23],
        [109, 403, 100, 403, 400, 404, 400, 403, 100, 403, 109],
        [403, 106, 18, 400, 25, 400, 25, 400, 18, 106, 403],
        [108, 403, 100, 403, 101, 403, 101, 403, 100, 403, 108],
        [26, 105, 18, 109, 23, 102, 23, 109, 18, 105, 26]
    ],
    [ // 21
        [403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403],
        [403, 403, 400, 602, 403, 33, 403, 604, 400, 403, 403],
        [403, 400, 400, 403, 403, 27, 403, 403, 400, 400, 403],
        [403, 403, 400, 400, 403, 27, 403, 400, 400, 403, 403],
        [403, 403, 400, 400, 400, 400, 400, 400, 400, 403, 403],
        [403, 403, 403, 400, 400, 400, 400, 400, 403, 403, 403],
        [403, 403, 403, 403, 400, 403, 400, 403, 403, 403, 403],
        [403, 403, 403, 403, 504, 405, 504, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403],
        [403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403]
    ],
    [ // 22 用于测试的。。。。。。没什么用
        [403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403],
        [403, 400, 400, 400, 400, 400, 25, 27, 32, 33, 403],
        [403, 400, 14, 21, 22, 24, 18, 28, 31, 400, 403],
        [403, 400, 400, 400, 400, 400, 400, 400, 400, 400, 403],
        [403, 400, 13, 7, 20, 15, 19, 16, 26, 400, 403],
        [403, 400, 400, 400, 400, 400, 400, 400, 400, 400, 403],
        [403, 400, 3, 9, 10, 4, 5, 11, 23, 400, 403],
        [403, 400, 400, 400, 400, 400, 400, 8, 12, 400, 403],
        [403, 400, 0, 1, 2, 29, 6, 17, 30, 400, 403],
        [403, 400, 400, 400, 400, 400, 400, 400, 400, 400, 403],
        [403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403]
    ]
];
//特殊道具：圣光辉章、十字架、风之罗盘、星光神锒
var badge=false, cross=false, 
    compass=false, hammer=false;
//仙子的事件计数器
var feary=0;
// 坐标、朝向、到过最高楼层
var px=5, py=10, face=1, visited=0;
//所在楼层
var floor=0;
var rank=1,att=10,def=10,hp=1000,gold=0,exp=0;
var redkey=0,bluekey=0,yellowkey=0;
/*消息窗口是否打开*/
var isonlog=false;
var j_box=new Array();
/*电梯*/
var isonJ=false;
var selectJ=0;
/*千里眼*/
var isonL=false;
/*买东西的框*/
var isonShop=false;
var shopnum=1;//商店框的记录数字

/*--------------数据层--------------------------------*/
/*--------------一些方法------------------------------*/
function $(i) {
    return document.getElementById(i);
}
function demo(){
//用于测试代码
}
//我们需要一个创建div的方法
/*----------------------------------------------------*/
function zuobi(){
    if($('zuobi').value=="HkWismyfather"){
        gold+=10000;
    }else if($('zuobi').value=="addMyatt"){
        att+=1000;
    }else if($('zuobi').value=="addMydef"){
        def+=1000;
    }else if($('zuobi').value=="1"){
        visited=22;
        compass=true;
    }
    showInfo();
}