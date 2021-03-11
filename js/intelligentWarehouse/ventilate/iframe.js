// 全局保存当前选中窗口
var g_iWndIndex = 0; //可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选择窗口
var m_CheckPluginInstall = -1;
$(function () {
//	$("#downloadVideo").attr('href',modelpath+"download/WebComponentsKit.exe");
	$("#downloadVideo").attr('href',modelpath+"download/SGMPInstaller.msi");
	m_CheckPluginInstall = WebVideoCtrl.I_CheckPluginInstall();
	if (-1 == m_CheckPluginInstall||-2 == m_CheckPluginInstall) {
		$("#videoInfo").show();
		$("#divPlugin").hide();
		$(".videoheight").css("height","100%");
		$(".download").css("height","93%");
		//alert("您还未安装过插件，双击开发包目录里的WebComponents.exe安装！");
		return;
	}
	else{
		$("#videoInfo").hide();	
		$("#divPlugin").show();
	}
	var oPlugin = {
		iWidth: $('#divPlugin').width(),			// plugin width
		iHeight: $('#divPlugin').height()-26			// plugin height
	};
	// 初始化插件参数及插入插件
	WebVideoCtrl.I_InitPlugin(oPlugin.iWidth, oPlugin.iHeight, {
        bWndFull: true,//是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
        iWndowType: 1,
		cbSelWnd: function (xmlDoc) {
			
		}
	});
	WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
	
});
function initVideo(oWebVideoCtrl,oLiveView){
	oWebVideoCtrl.I_Login(oLiveView.szIP, oLiveView.iProtocol, oLiveView.szPort, oLiveView.szUsername, oLiveView.szPassword, {
	    success: function (xmlDoc) {
	        // 开始预览
	        oWebVideoCtrl.I_StartRealPlay(oLiveView.szIP, {
	            iStreamType: oLiveView.iStreamType,
	            iChannelID: oLiveView.iChannelID,
	            bZeroChannel: oLiveView.bZeroChannel
	        });
	    }
	});
}