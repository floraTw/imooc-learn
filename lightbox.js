;(function($){

   var LightBox = function(){
       var self = this; //保存當前構造函數的類
       //創建遮罩和彈出框
       this.popupMask = $('<div id="G-lightbox-mask">');
       this.popupWin = $('<div id="G-lightbox-popup">');

       //保存body
       this.bodyNode = $(document.body);

       //顯示剩餘的DOM,並且插入到body
       this.renderDom();

       this.picViewArea = this.popupWin.find("div.lightbox-pic-view"); //獲取圖片預覽區域
       this.popupPic = this.popupWin.find("img.lightbox-image"); //獲取圖片
       this.picCaptionArea = this.popupWin.find("div.lightbox-pic-caption"); //獲取圖片描述區域
       this.nextBtn = this.popupWin.find("span.lightbox-next-btn"); //獲取按鈕
       this.prevBtn = this.popupWin.find("span.lightbox-prev-btn");

       this.captionText = this.popupWin.find("p.lightbox-pic-desc");//獲取圖片描述
       this.currentIndex = this.popupWin.find("span.lightbox-of-index");//獲取圖片當前索引
       this.closeBtn = this.popupWin.find("span.lightbox-close-btn");//獲取關閉按鈕



       //準備開發事件委託,獲取陣列資料
       this.groupName = null;
       this.groupData=[];//放置同一組資料
       this.bodyNode.delegate(".js-lightbox,*[data-role=lightbox]","click",function(e){
           //alert(this);
           //阻止事件冒泡
           e.stopPropagation();
           //alert($(this).attr("data-group")); 獲取群名
           var currentGroupName = $(this).attr("data-group");

           if(currentGroupName != self.groupName){
               //alert(currentGroupName);
               self.groupName = currentGroupName;
               //根據當前組名獲取同一組資料
               self.getGroup();
           };

           //初始化彈出框
           self.initPopup($(this));

       });
    };
    LightBox.prototype = {

        loadPicSize:function(sourceSrc){
          //console.log(sourceSrc);
          var self = this;

            this.preLoadImg(sourceSrc,function(){
              //alert("OK");
              self.popupPic.attr("src",sourceSrc);
              var picWidth = self.popupPic.width(),
                  picHeight = self.popupPic.height();

              console.log(picWidth+";"+picHeight);

          });
        },
        preLoadImg:function(src,callback){
            var img = new Image();
            if(!!window.ActiveXObject){
                img.onreadystatechange = function(){
                    if(this.readyState == "complete"){
                        callback();
                    };
                };
            }else{
                img.onload = function(){
                    callback();
                };
            };
            img.src = src;

        },
        showMaskAndPopup:function(sourceSrc, currentId){
            //console.log(sourceSrc);
            var self = this;
            this.popupPic.hide();
            this.picCaptionArea.hide();

            this.popupMask.fadeIn();

            var winWidth = $(window).width(),
                winHeight = $(window).height();

            this.picViewArea.css({
                width:winWidth/2,
                height:winHeight/2
            });

            this.popupWin.fadeIn();

            var viewHeight = winHeight/2+10;

            this.popupWin.css({
                width:winWidth/2+10,
                height: winHeight/2+10,
                marginLeft:-(winWidth/2+10)/2,
                top: -viewHeight
            }).animate({
                top:(winHeight-viewHeight)/2
            },function(){
                //加載圖片
                self.loadPicSize(sourceSrc);
            });
            //根據當前點擊的元素ID獲取當前組別裡的索引
            this.index = this.getIndexOf(currentId);
            //console.log(this.index);
            var groupDataLength = this.groupData.length;
            if(groupDataLength>1){
                //this.nextBtn this.prevBtn

                if(this.index === 0) {
                    this.prevBtn.addClass("disabled");
                    this.nextBtn.removeClass("disabled");
                }else if(this.index === groupDataLength -1) {
                    this.nextBtn.addClass("disabled");
                    this.prevBtn.removeClass("disabled");
                }else{
                    this.nextBtn.removeClass("disabled");
                    this.prevBtn.removeClass("disabled");
                };
            };

        },
        getIndexOf:function(currentId){
            var index = 0;

            $(this.groupData).each(function(i){
                index = i;
                if(this.id === currentId){
                    return false; //等於break操作
                };
            });
            return index;
        },
        initPopup:function(currentObj){
            var self = this,
                sourceSrc = currentObj.attr("data-source"),
                currentId = currentObj.attr("data-id");
            this.showMaskAndPopup(sourceSrc,currentId);
        },
        getGroup:function(){
            var self = this;
            //根據當前的組別名稱獲取頁面中所有相同組別的對象
            var groupList = this.bodyNode.find("*[data-group="+this.groupName+"]");
            //alert(groupList.size()); 知道一組有幾張相片
            //清空陣列資料
            self.groupData.length = 0;
            groupList.each(function(){
                self.groupData.push({
                    src:$(this).attr("data-source"),
                    id:$(this).attr("data-id"),
                    caption:$(this).attr("data-caption")
                });
            });
            //console.log(self.groupData);

        },
        renderDom:function(){
            var strDom =
                '<div class="lightbox-pic-view">'+
                '<span class="lightbox-btn lightbox-prev-btn"></span>'+
                '<img class="lightbox-img" src="images/2-2.jpg">'+
                '<span class="lightbox-btn lightbox-next-btn"></span>'+
                '</div>'+
                '<div class="lightbox-pic-caption">'+
                '<div class="lightbox-caption-area">'+
                '<p class="lightbox-pic-desc">圖片標題</p>'+
                '<span class="lightbox-of-index">當前索引：0 of 0</span>'+
                '</div>'+
                '<span class="lightbox-close-btn"></span>'+
                '</div>';
            //插入到this.popupWin
            this.popupWin.html(strDom);
            //把遮罩和彈出框插入到body
            this.bodyNode.append(this.popupMask,this.popupWin);
        }

    };
    window["LightBox"] = LightBox;
})(jQuery);