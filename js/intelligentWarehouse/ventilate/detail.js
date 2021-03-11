g_aIframe = $("iframe");
//视频摄像头
var cameraList = null;

var downloadPath = modelpath+"data/model/window/";

function init3d(winModel,windows){
	var a = grainTempocx.object;
	if (a != null) {		
		
		var width = $("#ocx").width();
		var height = $("#ocx").height();
		setTimeout(function() {
			$("#grainTempocx").width(width);
			$("#grainTempocx").height(height);
			grainTempocx.initHWWindow(width, height,winModel,windows);
			$("#grainTempocx").show();
			$(".download").hide();
		}, 10);
	} 
}


$(function() {
	
	var groupId = $("#groupId").val();
	var warehouseId_hidden = $("#warehouseId_hidden").val();
	$(".close-video").click(function() {
		$(".fullscreen-video").hide();
	})
	var isVentilating = $("#isVentilating").val();
	if(isVentilating=='1'){
		$("#tongfenging").show();
	}else{
		$("#tongfenging").hide();
	}
	//获取仓房内粮情  h 18-3.21
	$.ajax({
		type: 'get',
		url : 'ventilate/detail/getWarehouseTempData',
	    data:{"groupId": groupId,"warehouseId":warehouseId_hidden}
	}).done(function(content) {
		if(content.averageWaterValue){//水分
			$("#averageWaterValue").text(content.averageWaterValue+"%");
		}else{
			$("#averageWaterValue_text").hide();
		}
		if(content.humValue){//仓湿
			$("#humValue").text(content.humValue+"%");
		}else{
			$("#humValue_text").hide();
		}
		if(content.outHumValue){//外湿
			$("#outHumValue").text(content.outHumValue+"%");
		}else{
			$("#outHumValue_text").hide();
		}
		if(content.averageTemp){//粮温
			$("#averageTemp").text(content.averageTemp+"℃");
		}else{
			$("#averageTemp_text").hide();
		}
		if(content.tempValue){//仓温
			$("#tempValue").text(content.tempValue+"℃");
		}else{
			$("#tempValue_text").hide();
		}
		if(content.outTempValue){//外温
			$("#outTempValue").text(content.outTempValue+"℃");
		}else{
			$("#outTempValue_text").hide();
		}
		if(content.o2){//仓内含氧量
			$("#o2").text(content.o2+"%");
		}else{
			$("#o2_text").hide();
		}
	}).fail(function(err) {
	});
	//获取摄像头列表
	$.ajax({
		type: 'get',
		url : 'ventilate/videoInfo',
	    data:{"groupId": groupId,"warehouseId":warehouseId_hidden}
	}).done(function(data) {
		cameraList=data;
		iframeLoaded1();
	}).fail(function(err) {
	});
	var a = grainTempocx.object;
	if (a != null) {
		
		$("#grainTempocx").hide();
		$(".download").show();
		$("#download").hide();
		$("#loading").show();
	} else {
		$("#grainTempocx").hide();
		$(".download").show();
		$("#loading").hide();
		$("#download").show();
	}
	//获取通风道列表及状态
	$.ajax({
		url : "ventilate/getAirVents",
		type : 'GET',
		async: false,
		timeout : 10000,
		dataType : "json",
		data:{'groupId':groupId,'warehouseId':warehouseId_hidden}
	}).done(function(data) {
		if(data){
			var allType = '0';
			var html_left = '';
			var html_right = '';
			$.each(data,function(index,item){
				var code = item.equipCode;
				var statusStyle = "";
				if(item.equipStatus=='1'){
					allType = '1';
					statusStyle="on";
				}else{
					allType = '0';
					statusStyle="off";
				};
				if(index>1){
					html_right = '<div class=""><lable for="">' + item.equipName+'</label>&emsp;<i onclick="opereateSwitch(this,'+groupId+",\'"+warehouseId_hidden+"\',"+item.equipStatusId+',\''+code+'\',\'all_vent_opertor\',\'all_air_vent\')" class="ventilate-detail-state-other '+statusStyle+'"></i></div>'
					$("#air_vent_right").append(html_right);
				}else{
					html_left = '<div class=""><lable for="">' + item.equipName+'</label>&emsp;<i onclick="opereateSwitch(this,'+groupId+",\'"+warehouseId_hidden+"\',"+item.equipStatusId+',\''+code+'\',\'all_vent_opertor\',\'all_air_vent\')" class="ventilate-detail-state-other '+statusStyle+'"></i></div>'
					$("#air_vent_left").append(html_left);
				}
			});
			
			//allType
			if(data.length==0){
				$("#all_air_vent_text").hide();
				$("#all_air_vent").hide();
				$(".airvent_left_right").hide();
				$(".airvent_pic").show();
				$(".ventilate-detail-footer").hide();
			}else if(allType=='1'){
				$("#all_air_vent").removeClass("off");
				$("#all_air_vent").addClass("on");
				$("#all_air_vent_text").text("全部开启");
				$(".airvent_pic").hide();
				$(".ventilate-detail-footer").show();
			}else{
				$("#all_air_vent").removeClass("on");
				$("#all_air_vent").addClass("off");
				$("#ventilateDao").val("1");
				$("#all_air_vent_text").text("全部关闭");
				$(".airvent_pic").hide();
				$(".ventilate-detail-footer").show();
			}
		}
	}).fail(function() {
		alert("请求失败！","warning");
	});
	
	//获取轴流风机列表及状态
	$.ajax({
		url : "ventilate/getAxialfan",
		type : 'GET',
		async: false,
		timeout : 10000,
		dataType : "json",
		data:{'groupId':groupId,'warehouseId':warehouseId_hidden}
	}).done(function(data) {
		if(data){
			var allType = '0';
			var html_left = '';
			var html_right = '';
			$.each(data,function(index,item){
				var code = item.equipCode;
				var equipStatusId = item.equipStatusId;
				var statusStyle = "";
				if(item.equipStatus=='1'){
					allType = '1';
					statusStyle="on";
				}else{
					allType = '0';
					statusStyle="off";
				};
				if(index>1){
					html_right = '<div class=""><lable for="">' + item.equipName+'</label>&emsp;<i onclick="opereateSwitch(this,'+groupId+",\'"+warehouseId_hidden+"\',"+item.equipStatusId+',\''+code+'\',\'all_axialfan_opertor\',\'all_axialfan\')"  id="axialfan_'+equipStatusId+'" class="ventilate-detail-state-other '+statusStyle+'"></i></div>'
					$("#Axialfan_right").append(html_right);
				}else{
					html_left = '<div class=""><lable for="">' + item.equipName+'</label>&emsp;<i onclick="opereateSwitch(this,'+groupId+",\'"+warehouseId_hidden+"\',"+item.equipStatusId+',\''+code+'\',\'all_axialfan_opertor\',\'all_axialfan\')"  id="axialfan_'+equipStatusId+'"  class="ventilate-detail-state-other '+statusStyle+'"></i></div>'
					$("#Axialfan_left").append(html_left);
				}
			});
			//allType
			if(data.length==0){
				$("#all_axialfan_text").hide();
				$("#all_axialfan").hide();
				$(".axialfan_left_right").hide();
				$(".ventilate-detail-footer").hide();
				$(".axialfan_pic").show();
			}else if(allType=='1'){
				$("#all_axialfan").removeClass("off");
				$("#all_axialfan").addClass("on");
				$("#all_axialfan_text").text("全部开启");
				$(".axialfan_pic").hide();
				$(".ventilate-detail-footer").show();
			}else{
				$("#all_axialfan").removeClass("on");
				$("#all_axialfan").addClass("off");
				$("#all_axialfan_text").text("全部关闭");
				$("#ventilateFengJi").val("1");
				$(".axialfan_pic").hide();
				$(".ventilate-detail-footer").show();
			}
		}
	}).fail(function() {
		alert("请求失败！","warning");
	});
	
	var ventilateStrategy = $("#ventilateStrategy").val();
	if(ventilateStrategy=='1'){
		$("#model_hand_smart_text").text($("#ventilateStrategyName").val());
		$("#model_hand_smart").removeClass("on");
		$("#model_hand_smart").addClass("off");
	}else if(ventilateStrategy=='2'){
		$("#model_hand_smart_text").text($("#ventilateStrategyName").val());
		$("#model_hand_smart").removeClass("off");
		$("#model_hand_smart").addClass("on");
		var text = $("#ventilateTypeName").val();
		$("#smart_ventilate_model").text(text);
	}else{
		$("#model_hand_smart_text").text($("#ventilateStrategyName").val());
		$("#model_hand_smart").removeClass("on");
		$("#model_hand_smart").addClass("off");
	}
	getWindow(groupId, warehouseId_hidden);
	
	$("#scaleModel").click(function () {
		$("#ocx").css({
			"position": "fixed",
			    "top": "30px",
			    "left": "0",
			    "z-index": "9999"
		})
		$("#window_right").empty();
		$("#window_left").empty();
		$(".ventilate-detail-video-content").hide();
		$(".ventilate-detail-middle-top").hide();
		$("#closeModel").parent().show();
		$("#closeModel").click(function (){
			$("#ocx").css({
				"position": "static"
			})
			$("#window_right").empty();
			$("#window_left").empty();
			getWindow(groupId, warehouseId_hidden);
			$(".ventilate-detail-video-content").show();
			$(".ventilate-detail-middle-top").show();
			$(this).parent().hide();
		})
		$("#downloadMsi").attr('href',modelpath+"download/SGMPInstaller.msi");
		getWindow(groupId, warehouseId_hidden);
	})
	
});

function getWindow(groupId, warehouseId_hidden) {
	//获取窗户列表以及状态
	$.ajax({
		url : "ventilate/getWindows",
		type : 'GET',
		async: false,
		timeout : 10000,
		dataType : "json",
		data:{'groupId':groupId,'warehouseId':warehouseId_hidden}
	}).done(function(data) {
		if(data){
			var html_left = '';
			var html_right = '';
			var allType = '0';
			var windows = "";
			$.each(data,function(index,item){
				var code = item.equipCode;
				var equipStatusId = item.equipStatusId;
				var statusStyle = "";
				if(item.equipStatus=='1'){
					allType = '1';
					statusStyle="on";
				}else if(item.equipStatus=='0'){
					allType = '0';
					statusStyle="off";
				};
				
				if(data.length==4){/*如果是四个窗户，左右各两个*/
					if(index>1){
						html_right = '<div class=""><lable for="">' + item.equipName+'</label>&emsp;<i onclick="opereateSwitch(this,'+groupId+',\''+warehouseId_hidden+"\',"+equipStatusId+',\''+code+'\',\'all_window_opertor\',\'all_window\')" id="window_'+equipStatusId+'" class="ventilate-detail-state-other '+statusStyle+'"></i></div>'
						
						$("#window_right").append(html_right);
					}else{
						html_left = '<div class=""><lable for="">' + item.equipName+'</label>&emsp;<i onclick="opereateSwitch(this,'+groupId+",\'"+warehouseId_hidden+"\',"+equipStatusId+',\''+code+'\',\'all_window_opertor\',\'all_window\')" id="window_'+equipStatusId+'" class="ventilate-detail-state-other '+statusStyle+'"></i></div>'
						
						$("#window_left").append(html_left);
					}
				}else{/*如果是六个窗户，左右各三个个*/
					if(index>2){
						html_right = '<div class=""><lable for="">' + item.equipName+'</label>&emsp;<i onclick="opereateSwitch(this,'+groupId+',\''+warehouseId_hidden+"\',"+equipStatusId+',\''+code+'\',\'all_window_opertor\',\'all_window\')" id="window_'+equipStatusId+'" class="ventilate-detail-state-other '+statusStyle+'"></i></div>'
						
						$("#window_right").append(html_right);
					}else{
						html_left = '<div class=""><lable for="">' + item.equipName+'</label>&emsp;<i onclick="opereateSwitch(this,'+groupId+",\'"+warehouseId_hidden+"\',"+equipStatusId+',\''+code+'\',\'all_window_opertor\',\'all_window\')" id="window_'+equipStatusId+'" class="ventilate-detail-state-other '+statusStyle+'"></i></div>'
						
						$("#window_left").append(html_left);
					}
				}
				
				var model = "";
				switch (code) {
					case "11":
						model="w1";
						break;
					case "12":
						model="w2";
						break;
					case "13":
						model="w3";
						break;
					case "14":
						model="w4";
						break;
					case "15":
						model="w5";
						break;
					case "16":
						model="w6";
						break;
					case "17":
						model="w7";
						break;
					case "18":
						model="w8";
						break;
					case "19":
						model="w9";
						break;
					default:
						break;
				}
				windows += equipStatusId+"," + downloadPath +model+".ive," +item.equipStatus+";";
			});
			if(data.length==0){
				$("#all_window").hide();
				$("#all_window_text").hide();
				$(".window_left_right").hide();
				$(".ventilate-detail-footer").hide();
				$(".window_pic").show();
			}else if(allType=='1'){
				$("#all_window").removeClass("off");
				$("#all_window").addClass("on");
				$("#all_window_text").text("全部开启");
				$(".ventilate-detail-footer").show();
				$(".window_pic").hide();
			}else{
				$("#all_window").removeClass("on");
				$("#all_window").addClass("off");
				$("#all_window_text").text("全部关闭");
				$("#ventilateWindow").val("1");
				$(".ventilate-detail-footer").show();
				$(".window_pic").hide();
			}
			var warehouseType = $("#warehouseType").val();
			//2  浅圆仓 1  平房仓
			var winModel =  downloadPath + "warehouse.ive";
			if(warehouseType=="2"){
				winModel = downloadPath + "warehouse_Q.ive";
			}
//		    var winModel = downloadPath + "warehouse.ive";
			
			
			$.ajax({
				url : "ventilate/getAxialfan",
				type : 'GET',
				async: false,
				timeout : 10000,
				dataType : "json",
				data:{'groupId':groupId,'warehouseId':warehouseId_hidden}
			}).done(function(data) {
				if(data){
					$.each(data,function(index,item){
						var code = item.equipCode;
						var equipStatusId = item.equipStatusId;
						var model = "";
						switch (code) {
							case "31":
								model="wz1";
								break;
							case "32":
								model="wz2";
								break;
							case "33":
								model="wz3";
								break;
							case "34":
								model="wz4";
								break;
							default:
								break;
						}
						windows +=  equipStatusId+"," + downloadPath +model+".ive," +item.equipStatus+";";
					});
				}
			}).fail(function() {
				alert("请求失败！","warning");
			});
			
			init3d(winModel,windows);
		}
	}).fail(function() {
		alert("请求失败！","warning");
		$(".modal-dialog").css({"margin-top":"-8rem"});
	});
}

$(".collecting").hover(function(){
    $("#collecting").css('display','block'); 
  //作业详情
	$.ajax({
		url : "ventilate/ventilateTimeDetail",
		type : 'GET',
		async: false,
		timeout : 10000,
		dataType : "json",
		data:{'warehouseId':$("#warehouseId_hidden").val(),'groupId':$("#groupId").val()}
	}).done(function(data) {
		if(data){
			//窗户
			var window_status = '';
			var window = data.windows;
			$.each(window,function(index,item){
				window_status = '<div class=""><span >' + item.equipName+'开启</span>&emsp;<span>运行时长'+item.timeDifference+'</span></div>'
				$("#window_status").append(window_status);
			});
			//通风道
			var air_vent_status = '';
			var air_vent = data.airvents;
			$.each(air_vent,function(index,item){
				air_vent_status = '<div class=""><span >' + item.equipName+'开启</span>&emsp;<span>运行时长'+item.timeDifference+'</span></div>'
				$("#air_vent_status").append(air_vent_status);
			});
			//轴流风机 
			var axialfan_status = '';
			var axialfan = data.axialfans;
			$.each(axialfan,function(index,item){
				axialfan_status = '<div class=""><span >' + item.equipName+'开启</span>&emsp;<span>运行时长'+item.timeDifference+'</span></div>'
				$("#axialfan_status").append(axialfan_status);
			});
		}
	}).fail(function() {
		alert("请求失败！","warning");
	});
	//三温三湿图
	var groupId = $("#groupId").val();
	var warehouseId_hidden = $("#warehouseId_hidden").val();
	//var now = new Date();
   	//var nowyear = now.getFullYear();   //年
	var myChart = echarts.init(document.getElementById('doubleThree-chart'));
	$.ajax({
		type: 'get',
		url: 'ventilate/getThreeTempHumByDay',
		timeout : 10000,
		dataType: 'json',
	    data:{"groupId": groupId,"warehouseId":warehouseId_hidden},
		success: function(content){
			if(content==null){
				return
			}else{
				if(content.datelist){//x轴时间
					data.xAxisdata = content.datelist;
				}
				if(content.tempList){//外温
					data.seriesdata[0].data = content.tempList;
				}
				if(content.humidityList){//外湿
					data.seriesdata[1].data = content.humidityList;
				}
				if(content.warehouseTempList){//仓温
					data.seriesdata[2].data = content.warehouseTempList;
				}
				if(content.warehouseHumidityList){//仓湿
					data.seriesdata[3].data = content.warehouseHumidityList;
				}
				if(content.grainTempList){//粮温
					data.seriesdata[4].data = content.grainTempList;
				}
				if(content.grainWaterList){//水分
					data.seriesdata[5].data = content.grainWaterList;
				}
				
				myChart.setOption(data2Option_graininfo(data));
			}
	    }		
   });
},function(){
	$("#collecting").css('display','none');
	$("#window_status").html("");
	$("#axialfan_status").html("");
	$("#air_vent_status").html("");
});

//操作单个设备的开关
function opereateSwitch(obj,groupId,warehouseId,equipStatusId,equipCode,allOpertorId,allId){
	var remoteStatus = $("#remoteStatusHidden").val();
	if(remoteStatus=='1'){
		alert("本地状态下不可操作！");
		$(".modal-dialog").css({"margin-top":"-8rem"});
		return;
	}else if(remoteStatus=='2'){
		alert("无通风设备，不可操作！");
		$(".modal-dialog").css({"margin-top":"-8rem"});
		return;
	}
	var text = "";
	var status = "";
	if($(obj).hasClass("on")) {
		text = "关闭";
		status = "0";
	} else {
		text = "开启";
		status = "1";
	}
	confirm("是否确认"+text+"？",function (){
		var date = {
				'equipStatusId':equipStatusId,'equipCode':equipCode,'equipStatus':status,'groupId':groupId,'warehouseId':warehouseId
		};
		$.ajax({
			url : "ventilate/opereateEquipStatus",
			type : 'PUT',
			async: false,
			timeout : 10000,
			dataType : "json",
			data:JSON.stringify(date)
		}).done(function(data) {
			if(data.code=='200'){
				
				if($(obj).hasClass("on")) {
					$(obj).removeClass("on").addClass("off");
					var ii = 0;
					$("#"+allOpertorId).find("i").each(function(i,value){
						if($(this).hasClass("off")) {
							ii++;
						}
					});
					//判断是否所有设备全部关闭，关闭全部按钮
					if(ii===$("#"+allOpertorId).find("i").size()){
						$("#"+allId).removeClass("on").addClass("off");
						if(allId=="all_window"){
							$("#ventilateWindow").val("1");
						}else if(allId=="all_air_vent"){
							$("#ventilateDao").val("1");
						}else if(allId=="all_axialfan"){
							$("#ventilateFengJi").val("1");
						}
						var ventilateWindow = $("#ventilateWindow").val();
						var ventilateDao = $("#ventilateDao").val();
						var ventilateFengJi = $("#ventilateFengJi").val();
						if(ventilateWindow=="1"&&ventilateDao=="1"&&ventilateFengJi=="1"){
							$("#tongfenging").hide();
						}
					}
					
				} else {
					$(obj).removeClass("off").addClass("on");
					var ii = 0;
					$("#"+allOpertorId).find("i").each(function(i,value){
						if($(this).hasClass("on")) {
							ii++;
						}
					});
					//判断是否所有设备全部开启，开启全部按钮
					if(ii===$("#"+allOpertorId).find("i").size()){
						$("#"+allId).removeClass("off").addClass("on");
					}
					$("#tongfenging").show();
				}
				alert("操作成功！");
				$(".modal-dialog").css({"margin-top":"-8rem"});
				//只对窗户进行3d操作
				if("all_window_opertor"==allOpertorId){
					grainTempocx.windowOperatorByCode(equipStatusId, status);
				}else if("all_axialfan_opertor"==allOpertorId){
					grainTempocx.windowOperatorByCode(equipStatusId, status);
				}
			}else if(data.code=='201'){
				alert("正在熏蒸，不能开启通风设备！");
				$(".modal-dialog").css({"margin-top":"-8rem"});
			}
			else if(data.code=='401'){
				alert("设备异常，请检查硬件设备及网络！");
				$(".modal-dialog").css({"margin-top":"-8rem"});
			}else {
				alert("操作失败！","warning");
				$(".modal-dialog").css({"margin-top":"-8rem"});
			}
		}).fail(function() {
			alert("操作失败！","warning");
			$(".modal-dialog").css({"margin-top":"-8rem"});
		});
	});
	$(".modal-dialog").css({"margin-top":"-8rem"});
}

	function onWarehouseChange(warehouseId) {
		var groupId = $("#groupId").val();
		var isshow = $("#isshow").val();
		if(isshow=="1"){
			window.location.href=getRootPath_dc()+"/ventilate/detail?groupId="+groupId+"&warehouseId="+warehouseId+"&isshow=1";
		}else{
			window.location.href=getRootPath_dc()+"/ventilate/detail?groupId="+groupId+"&warehouseId="+warehouseId;
		}
	}
	
	function onGroupChange(groupId){
		$.ajax({
			url : "ventilate/warehouseList",
			type : 'get',
			async: false,
			dataType : "json",
			data:{'groupId':groupId}
		}).done(function(data) {
			if(data){
				var isshow = $("#isshow").val();
				if(data[0]==undefined){
					if(isshow=="1"){
						window.location.href=getRootPath_dc()+"/ventilate/detail?groupId="+groupId+"&warehouseId=-1"+"&isshow=1";
					}else{
						window.location.href=getRootPath_dc()+"/ventilate/detail?groupId="+groupId+"&warehouseId=-1";
					}
				}else{
					if(isshow=="1"){
						window.location.href=getRootPath_dc()+"/ventilate/detail?groupId="+groupId+"&warehouseId="+data[0].warehouseId+"&isshow=1";
					}else{
						window.location.href=getRootPath_dc()+"/ventilate/detail?groupId="+groupId+"&warehouseId="+data[0].warehouseId;
					}
				}
			}
		}).fail(function() {
			alert("操作失败！","warning");
		});
	}
//操作某种设备的全部开关
	function opereateSwitchAll(obj,type){
		var remoteStatus = $("#remoteStatusHidden").val();
		if(remoteStatus=='1'){
			alert("本地状态下不可操作！");
			$(".modal-dialog").css({"margin-top":"-8rem"});
			return;
		}else if(remoteStatus=='2'){
			alert("无通风设备，不可操作！");
			$(".modal-dialog").css({"margin-top":"-8rem"});
			return;
		}
		var warehouseId_hidden = $("#warehouseId_hidden").val();
		var operateStatus = "";
		var text = "";
		if($(obj).hasClass("on")) {
			equipStatus = '0';
			text = "全部关闭";
		} else {
			equipStatus = '1';
			text = "全部开启";
		};
		confirm("是否确认"+text+"？",function (){
			opereateSwitchAllData(obj,warehouseId_hidden,equipStatus,type);
		});
		$(".modal-dialog").css({"margin-top":"-8rem"});
	}
	
	

	function opereateSwitchAllData(obj,warehouseId,equipStatus,type){
		var groupId = $("#groupId").val();
		var date = {
			'warehouseId':warehouseId,'equipStatus':equipStatus,'equipType':type,'groupId':groupId
		};
		$.ajax({
			url : "ventilate/opereateSwitchAlls",
			type : 'PUT',
			async: false,
			timeout : 10000,
			dataType : "json",
			data:JSON.stringify(date)
		}).done(function(data) {
			if(data.code=='200'){
				
				if($(obj).hasClass("on")) {
					$(obj).parent().find("label").text("全部关闭");
					$(obj).parent().parent().parent().find("i").removeClass("on");
					$(obj).parent().parent().parent().find("i").addClass("off");
					if(type=="2"){
						$("#ventilateWindow").val("1");
					}else if(type=="6"){
						$("#ventilateDao").val("1");
					}else if(type=="3"){
						$("#ventilateFengJi").val("1");
					}
					var ventilateWindow = $("#ventilateWindow").val();
					var ventilateDao = $("#ventilateDao").val();
					var ventilateFengJi = $("#ventilateFengJi").val();
					if(ventilateWindow=="1"&&ventilateDao=="1"&&ventilateFengJi=="1"){
						$("#tongfenging").hide();
					}
				} else {
					$(obj).parent().parent().parent().find("i").removeClass("off");
					$(obj).parent().parent().parent().find("i").addClass("on");
					$(obj).parent().find("label").text("全部开启");
					if(type=="2"){
						$("#ventilateWindow").val("0");
					}else if(type=="6"){
						$("#ventilateDao").val("0");
					}else if(type=="3"){
						$("#ventilateFengJi").val("0");
					}
					$("#tongfenging").show();
				}
				alert("操作成功！");
				$(".modal-dialog").css({"margin-top":"-8rem"});
				//只对窗户进行操作，2为窗户 通风道为6 轴流风机为3
				if(type=="2"){
					//grainTempocx.windowOperatorByCode(equipStatusId, equipStatus);
					$("#all_window_opertor").find("i").each(function(i,value){
						var window_id = $(this).attr("id");
						var equipId = window_id.split("_");
						grainTempocx.windowOperatorByCode(equipId[1], equipStatus);
					});
				}else if(type=="3"){
					$("#all_axialfan_opertor").find("i").each(function(i,value){
						var window_id = $(this).attr("id");
						var equipId = window_id.split("_");
						grainTempocx.windowOperatorByCode(equipId[1], equipStatus);
					});
				}
			}else if(data.code=='201'){
				alert("正在熏蒸，不能开启通风设备！");
				$(".modal-dialog").css({"margin-top":"-8rem"});
			}else if(data.code=='401'){
				alert("设备异常，请检查硬件设备及网络！");
				$(".modal-dialog").css({"margin-top":"-8rem"});
			}else {
				alert("操作失败！","warning");
				$(".modal-dialog").css({"margin-top":"-8rem"});
			}
		}).fail(function() {
			alert("操作失败！","warning");
		});
	}
	
	//手动智能模式切换
	var ventilateStrategyId = $("#ventilateStrategyId").val();
	function opereateSwitchModel(obj, index) {
		var remoteStatus = $("#remoteStatusHidden").val();
		if(remoteStatus=='1'){
			alert("本地状态下不可操作！");
			$(".modal-dialog").css({"margin-top":"-8rem"});
			return;
		}else if(remoteStatus=='2'){
			alert("无通风设备，不可操作！");
			$(".modal-dialog").css({"margin-top":"-8rem"});
			return;
		}
		if($(obj).hasClass("on")) {
			confirm("确定要切换到手动模式？",function (){
				updateVentilateModel(obj,ventilateStrategyId,1,"");
			});
			$(".modal-dialog").css({"margin-top":"-8rem"});
		} else {
			$("#smartModel").modal("show");
		}
	}
	$("#submitBtn").on('click', function() {
		var up = $("input[name='up']:checked").val();
		var text = "";
		if(up==''||up==undefined){
			alert("请选择智能模式");
			$(".modal-dialog").css({"margin-top":"-8rem"});
			return;
		}else{
			text = smartVentilateType(up);
		}
		
		confirm("确定要进行【"+text+"】？",function (){
			updateVentilateModel("",ventilateStrategyId,2,up);
		});
		$(".modal-dialog").css({"margin-top":"-8rem"});
	});
	
	function updateVentilateModel(obj,id,type,value){
		var warehouseCode = $("#warehouseId").find("option:selected").text();
		var date = {"ventilateStrategyId":id,"ventilateStrategy":type,"ventilateType":value,"warehouseCode":warehouseCode};
		$.ajax({
			url : "ventilate/updateVentilateModel",
			type : 'PUT',
			async: false,
			dataType : "json",
			data:JSON.stringify(date)
		}).done(function(data) {
			if(data.code=='200'){
				if(type=='1'){
					$(obj).removeClass("on");
					$(obj).addClass("off");
					$(obj).parent().find("label").text("手动模式");
					$("#ventilateStrategy").val('1');
					$("#smart_ventilate_model").text("");
				}else{
					$("#smartModel").modal("hide");
					$("#model_hand_smart").removeClass("off");
					$("#model_hand_smart").addClass("on");
					$("#model_hand_smart_text").text("智能模式");
					$("#smart_ventilate_model").text(smartVentilateType(value));
					$("#ventilateStrategy").val('2');
				}
				alert("操作成功！");
				$(".modal-dialog").css({"margin-top":"-8rem"});
			}else{
				alert("操作失败！","warning");
				$(".modal-dialog").css({"margin-top":"-8rem"});
			}
		}).fail(function() {
			alert("操作失败！","warning");
		});
	}
	function smartVentilateType(up){
		var text = "";
		if(up=='1'){
			text = "上行智能化机械通风降温";
		}else if(up=='2'){
			text = "下行智能化机械通风降温";
		}else if(up=='3'){
			text = "智能自然降温通风";
		}else if(up=='4'){
			text = "智能排积热通风";
		}else if(up=='5'){
			text = "上行智能化机械通风降水";
		}else if(up=='6'){
			text = "下行智能化机械通风降水";
		}else if(up=='7'){
			text = "上行智能化机械通风调质";
		}else if(up=='8'){
			text = "下行智能化机械通风调质";
		}
		return text;
	}
	
	function data2Option_graininfo(json) {

		return {
			color: ['#62c8f9', '#15be60', '#767676', '#e8e600', '#f56f6c'],
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: json.legenddata,
				top: 10,
				textStyle:{
					color: "#fff"
				}
			},
			grid: {
				bottom: "10%"
			},
			smooth: true,
			calculable: true,
			xAxis: [{
				type: 'category',
				boundaryGap: false,
				data: json.xAxisdata,
				axisLabel: {
					textStyle:{
						color: "#fff"
					}
				},
				axisLine:{
					lineStyle:{
						color: "#fff"
					}
				}
			}],
			yAxis: [{
				type: 'value',
				axisLabel: {
					textStyle:{
						color: "#fff"
					},
					formatter: '{value} °C'
				},
				axisLine:{
					lineStyle:{
						color: "#fff"
					}
				}
			}, {
				type: 'value',
				axisLabel: {
					textStyle:{
						color: "#fff"
					},
					formatter: '{value} %'
				},
				axisLine:{
					lineStyle:{
						color: "#fff"
					}
				}
			}],
			series: json.seriesdata
		};
	};
	
	
	function iframeLoaded1() {
		var oLiveView;
	        $.each(g_aIframe, function (i, oIframe) {
	        	var oWebVideoCtrl = getWebVideoCtrl(oIframe);
	        	// 登录设备
	        	for (var j = 0; j < cameraList.length; j++) {
	    			oLiveView = {
	    		            iProtocol: 1,			// protocol 1：http, 2:https
	    		            szIP: cameraList[i].ip,	// protocol ip
	    		            szPort: cameraList[i].port,			// protocol port
	    		            szUsername: cameraList[i].username,	// device username
	    		            szPassword: cameraList[i].password,	// device password
	    		            warehouseName:cameraList[i].wareHouseName,
	    		            location:cameraList[i].location,
	    		            iStreamType: 1,			// stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
	    		            iChannelID: 1,			// channel no
	    		            bZeroChannel: false		// zero channel
	    		        };
					if (i == 0) {
						cameraframe_0.window.initVideo(oWebVideoCtrl,oLiveView);
					} else if (i == 1) {
						cameraframe_1.window.initVideo(oWebVideoCtrl,oLiveView);
					} 
					break;
	    		}
	           
	        });
	}
	
	function getWebVideoCtrl(oIframe) {
	    return oIframe.contentWindow.WebVideoCtrl;
	}
	function cameraPlay(obj) {
		var cameraid = obj.attr("id");
		
		if(cameraid==="enlargeBtn1"){
			$(".fullscreen-video").show();
			var location="";
			var wareHouseName="";
			var name="";
			if(cameraList[0].wareHouseName!=null){
				wareHouseName=cameraList[0].wareHouseName;
			}
			if(cameraList[0].location!=null){
				location='_'+cameraList[0].location;
			}
			if(cameraList[0].name!=null){
				name="_"+cameraList[0].name;
			}
			var carmeraTitle=wareHouseName+name+location;
			oLiveView = {
		            iProtocol: 1,			// protocol 1：http, 2:https
		            szIP: cameraList[0].ip,	// protocol ip
		            szName: cameraList[0].name,	// video title
		            szType: cameraList[0].type,	// video type,球机 枪机
		            szPort: cameraList[0].port,			// protocol port
		            szUsername: cameraList[0].username,	// device username
		            szPassword: cameraList[0].password,	// device password
		            carmeraTitle: carmeraTitle,	
		            iStreamType: 1,			// stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
		            iChannelID: 1,			// channel no
		            bZeroChannel: false		// zero channel
		        };
			
			child.window.initcloudVideo(oLiveView);
		}else if(cameraid==="enlargeBtn2"){
			$(".fullscreen-video").show();
			var location="";
			var wareHouseName="";
			var name="";
			if(cameraList[1].wareHouseName!=null){
				wareHouseName=cameraList[1].wareHouseName;
			}
			if(cameraList[1].location!=null){
				location='_'+cameraList[1].location;
			}
			if(cameraList[1].name!=null){
				name="_"+cameraList[1].name;
			}
			var carmeraTitle=wareHouseName+name+location;
			oLiveView = {
		            iProtocol: 1,			// protocol 1：http, 2:https
		            szIP: cameraList[1].ip,	// protocol ip
		            szPort: cameraList[1].port,			// protocol port
		            szName: cameraList[1].name,	// video title
		            szType: cameraList[1].type,	// video type,球机 枪机
		            szUsername: cameraList[1].username,	// device username
		            szPassword: cameraList[1].password,	// device password
		            carmeraTitle: carmeraTitle,	
		            iStreamType: 1,			// stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
		            iChannelID: 1,			// channel no
		            bZeroChannel: false		// zero channel
		        };
			
			child.window.initcloudVideo(oLiveView);
		}
	};
	
	function showVentilating(){
		$("#tongfenging").show();
	}