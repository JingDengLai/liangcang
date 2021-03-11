var cameraList = null;

$(function () {
	getWareHouseList();
	grainInfo();
	// 查询按钮事件
	$('#submit_search').click(function() {
		grainInfo();
	});
});

//视频摄像头
function grainInfo(){
	$.ajax({
		type: 'get',
		url : 'grainQuantity/mapVideo/videoInfo',
	    data:{groupId: $("#groupId").val(),warehouseId: $("#warehouseId").val()},
	}).done(function(data) {
		cameraList=data;
		//iframeLoaded1();*/
		//底部需要显示的视频设备
		var bottomdiv = "";
		var isShowData = data;
		if(isShowData){
			$("#isshowCamera").empty();
			$.each(isShowData,function(i,n){
				var location="";
				var wareHouseName="";
				var name="";
				if(n.wareHouseName!=null&&n.wareHouseName!=""){
					wareHouseName=n.wareHouseName+'_';
				}
				if(n.location!=null){
					location='_'+n.location;
				}
				if(n.name!=null&&n.name!=""){
					name=n.name;
				}
				var carmeraTitle=wareHouseName+name+location;
				bottomdiv += '<div class="rigion rigion-video-same" id="righttop" style="height: 350px;"<div class="m-video-item rigion-video-info" style="padding:0">'+
				'<div class="video-item-container m-v-detail" id="cameralist_59"><span id="cameraTitle'+i+'">'+carmeraTitle+'</span>' +
				'<a id="enlargeBtn1" onclick="cameraPlay(this)" flag="'+i+'" class="enlarge-btn enlarge-btn-common" href="javascript:void(0)"></a></div>' +
				'<div class="video-item-body" style="padding-top: 26px;">' +
				'<iframe id="cameraframe" style="height: 100%;width:100%;" name="cameraframe_'+i+'" src="grainQuantity/mapVideo/iframe" frameborder="0"></iframe>' +
				'</div>' + 
				'</div>' + 
				'</div>';
			});
			$("#isshowCamera").append(bottomdiv);
			//底部视频加载,这里加了2秒延时加载
			var g_aIframe = $("#isshowCamera iframe");
			setTimeout(iframeLoaded,2000,isShowData,g_aIframe);
		}
	}).fail(function(err) {
	});
}
//底部视频加载
function iframeLoaded(obj,aIframe){
	var oLiveView;
	$.each(aIframe, function (i, oIframe) {
    	var oWebVideoCtrl = getWebVideoCtrl(oIframe);
    	// 登录设备
    	for(var j=0;j<obj.length;j++){
    		oLiveView = {
		            iProtocol: 1,					// protocol 1：http, 2:https
		            szIP: obj[i].ip,				// protocol ip
		            szPort: obj[i].port,			// protocol port
		            szUsername: obj[i].username,	// device username
		            szPassword: obj[i].password,	// device password
		            szType: obj[i].type,			// video type,1球机；2 枪机
		            iStreamType: 1,					// stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
		            iChannelID: 1,					// channel no
		            bZeroChannel: false				// zero channel
		        };
    	}
    	if(i == 0){
    		cameraframe_0.window.initVideo(oWebVideoCtrl,oLiveView);
    	}else if(i == 1){
    		cameraframe_1.window.initVideo(oWebVideoCtrl,oLiveView);
    	}else if(i == 2){
    		cameraframe_2.window.initVideo(oWebVideoCtrl,oLiveView);
    	}else if(i == 3){
    		cameraframe_3.window.initVideo(oWebVideoCtrl,oLiveView);
    	}else if(i == 4){
    		cameraframe_4.window.initVideo(oWebVideoCtrl,oLiveView);
    	}else if(i == 5){
    		cameraframe_5.window.initVideo(oWebVideoCtrl,oLiveView);
    	}else if(i == 6){
    		cameraframe_6.window.initVideo(oWebVideoCtrl,oLiveView);
    	}
    	
    });
}



function getWebVideoCtrl(oIframe) {
    return oIframe.contentWindow.WebVideoCtrl;
}
//点击放大查看视频
function cameraPlay(obj) {
	var n = $(obj).attr("flag");
	var location="";
	var wareHouseName="";
	var name="";
	if(cameraList[n].wareHouseName!=null&&cameraList[n].wareHouseName!=""){
		wareHouseName=cameraList[n].wareHouseName+'_';
	}
	if(cameraList[n].location!=null){
		location='_'+cameraList[n].location;
	}
	if(cameraList[n].name!=null){
		name=cameraList[n].name;
	}
	var carmeraTitle=wareHouseName+name+location;
	oLiveView = {
            iProtocol: 1,			// protocol 1：http, 2:https
            szIP: cameraList[n].ip,	// protocol ip
            szPort: cameraList[n].port,			// protocol port
            szUsername: cameraList[n].username,	// device username
            szPassword: cameraList[n].password,	// device password
            szType:  cameraList[n].type,			// video type,1球机；2 枪机
            szName:  cameraList[n].name,			// video type,1球机；2 枪机
            carmeraTitle: carmeraTitle,			// video type,1球机；2 枪机
            iStreamType: 1,			// stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
            iChannelID: 1,			// channel no
            bZeroChannel: false		// zero channel
        };
	$(".fullscreen-video").show();
	child.window.initcloudVideo(oLiveView);
};

var warehouseData;
//获取有设备的仓间
function getWareHouseList(){
	var groupId = $("#groupId").val();
	$.ajax({
		url : 'grainQuantity/mapVideo/groupId/'+groupId,
		type : 'GET'
	}).done(function(data) {
		warehouseData=data;
		$("#warehouseId").empty();
		$("#warehouseId").append("<option value=''>全部</option>");
		$.each(data,function(index,items){
			$("#warehouseId").append("<option value='"+items.warehouseId+"'>"+items.code+"</option>");
		});
	}).fail(function(err) {
		
	}).always(function() {
		
	});
}