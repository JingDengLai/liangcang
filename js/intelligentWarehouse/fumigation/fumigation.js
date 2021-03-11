//var REMOTE_STATUS_BD = "1";//本地
//var REMOTE_STATUS_YC = "0";//远程
var result_type_0 = "0";//操作失败
var result_type_1 = "1";//操作成功
var result_type_2 = "2";//没有配置信息
var result_type_3 = "3";//开启设备异常
$(function() {
	var groupId = $("#searchform select[name=groupId] option:selected").val();
	var warehouseId = $("#searchform select[name=warehouseId] option:selected").val();
	
	//仓房图片显示默认仓名
	//changeStorehousePng();
	
	searchPageData(groupId,warehouseId);
	
	//设置
	$("#setings").click(function(){
		$("#formData input").val("");
		$("#formData").data('bootstrapValidator').resetForm();
		var warehouseName = $("#searchform select[name=warehouseId] option:selected");
		var groupName = $("#searchform select[name=groupId] option:selected");
		$("#formData input[name=groupName]").val(groupName.text());
		$("#formData input[name=groupId]").val(groupName.val());
		$("#formData input[name=warehouseName]").val(warehouseName.text());
		$("#formData input[name=warehouseId]").val(warehouseName.val());
		
		//根据库点和仓间，查找是否设置过阈值
		searchData(groupName.val(),warehouseName.val());
		$("#myModal").modal('show');
	});
	$('#myModal').on('hide.bs.modal', function() {
		$("#myModal form").each(function() {
			$(this).reset();
		});
	})
	var openStatus = $("#btn-start").val();
	var text = "";
	if(openStatus=="1"){
		text = "关闭";
	}else{
		text = "开启";
	};
	$("#start").html(text);
	//添加设置
	addOredit();
});
//库点改变时，修改仓间列表和默认仓房图片的仓间
function selectWarehouseByGroupId(){
	$("#searchform select[name=warehouseId]").empty();
	var groupId = $("#searchform select[name=groupId]").val();
	if(groupId){
		$.ajax({
			url : "fumigation/warehouseList?groupId="+groupId,
			type : 'GET',
			dataType : "json"
		}).done(function(data) {
			if(data){
				$.each(data,function(index,item){
					$("#searchform select[name=warehouseId]").append("<option value='"+item.warehouseId+"'>"+item.code+"</option>");
				});
				//仓房图片显示默认仓名
				$("#storehouse-png").text(data[0].code);
			}
		}).fail(function() {
			console.log("请求失败！");
		});
	}
	
}
//仓间号change事件，绑定仓房图片仓名
function changeStorehousePng(){
	var warehouseName = $("#searchform select[name=warehouseId] option:selected").text();
	//仓房图片显示默认仓名
	$("#storehouse-png").text(warehouseName);
	
	var warehouseId = $("#searchform select[name=warehouseId] option:selected").val();
	var groupId = $("#searchform select[name=groupId] option:selected").val();
	searchPageData(groupId,warehouseId);
}

//添加设置
function addOredit(){
	$("#formData").bootstrapValidator({
		fields:{
			fumigationTime:{
				validators:{
					notEmpty:{message:"不能为空"},
					stringLength:{max:5,message:"不能超过5位"},
					regexp:{
						regexp:/^[0-5]*[1-9][0-9]*$/,
						message:"只能填写数字"
					}
				}
			},
			fumigationThreshold:{
				validators:{
					notEmpty:{message:"不能为空"},
					stringLength:{max:5,message:"不能超过5位"},
					regexp:{
						regexp:/^[0-5]*[1-9][0-9]*$/,
						message:"只能填写数字"
					}
				}
			}
		}
	}).on("success.form.bv",function(e){
		e.preventDefault();//防止表单提交
		
		var data = $("#formData").serializeObject();
		$.ajax({
			type:"POST",
			url:"fumigation/settingsAdd",
			data:JSON.stringify(data)
		}).done(function(data){
			$("#myModal").modal("hide");
			if(data.flag == true){
				alert("提交成功！");
			}else{
				alert("提交失败！");
			}
		}).fail(function(err){
			alert("提交失败！","warning");
		}).always(function(){
			
		});
		
	});
}
//根据库点和仓间，查找是否设置过阈值
function searchData(groupId,warehouseId){
	$.ajax({
		type:"GET",
		url:"fumigation/getFumigation",
		data:{groupId:groupId,warehouseId:warehouseId}
	}).done(function(data){
		if(data){
			$("#formData input[name=fumigationTime]").val(data.fumigationTime);
			$("#formData input[name=fumigationThreshold]").val(data.fumigationThreshold);
		}
	}).fail(function(err){
		alert("获取信息失败！","warning");
	})
}
//模式切换
function opereateSwitch(obj) {
	var status = $("#hljStatus").val();
	if(status == 1){
		alert("设备开启状态下不能切换模式！！！","warning");
	}else{
		var text = "";
		if($(obj).hasClass("on")) {
			text = "手动模式";
		}else{
			text = "智能模式";
		};
		confirm("确定要切换到"+text+"吗？",function(){
			var fumigationType = "1";//默认人工模式
			if($(obj).hasClass("on")) {
				fumigationType = "1";
			} else {
				fumigationType = "2";//智能模式
			}
			/* 修改默认模式表的状态
			 2没有配置信息不可操作
			 1有设备配置信息且操作成功
			 0有设备配置信息但操作失败*/
			var isOperation = updateFumigationType(fumigationType);
			if(isOperation == 2){
				alert("该仓没有熏蒸设备配置信息！","warning");
				return;
			}
			if(isOperation == 0){
				alert("模式切换失败！");
				return;
			}
			if(isOperation == 1){
				if($(obj).hasClass("on")) {
					$(obj).removeClass("on");
					$(obj).addClass("off");
					$(obj).parent().find("span").text("手动模式");
					$(".suffocating-top-one button:gt(0)").hide();
				} else {
					$(obj).removeClass("off");
					$(obj).addClass("on");
					$(obj).parent().find("span").text("智能模式");
					$(".suffocating-top-one button:gt(0)").show();
				}
				alert("模式切换成功！");
			}
			
		});
	}
}
//获取各设备开启状态和链接状态  1开启0关闭
function searchPageData(groupId,warehouseId){
	if(warehouseId){}else{
		alert("没有可以操作的仓的设备信息！","warning");
		return;
	}
	$.ajax({
		type:"GET",
		url:"fumigation/getStatus",
		data:{groupId:groupId,warehouseId:warehouseId}
	}).done(function(data){
		if(data){
			//本地远程
			//$("#remotStatusHidden").val(data.remoteStatus);
			//$("#searchform .remot").text(data.remoteStatusHidden);
			//仓房图片显示默认仓名
			var warehouseName = $("#searchform select[name=warehouseId] option:selected").text();
			$("#storehouse-png").text(warehouseName);
			
			//设备开启状态
			equipmentStatus(data);
			//默认模式
			setmodeType(data);
			//开启时间和数据
			openData(data);
			//图表数据
			setChartsData(data);
		}
	}).fail(function(err){
		alert("获取信息失败！","warning");
	})
}
//设备是否开启状态 1开启0关闭
function equipmentStatus(data){
	$(".suffocating-top-one input[name=chuanghu]").val(data.windowStatus);
	$(".suffocating-top-one input[name=fengji]").val(data.axialfanStatus);
	$(".suffocating-top-one input[name=tongfengdao]").val(data.airventStatus);
	$("#hljStatus").val(data.circulationStatsus);
	if(data.windowStatus == 1){//窗户
		$(".suffocating-top-one i").eq(0).css({"background":"#1fd19d"});
	}else{
		$(".suffocating-top-one i").eq(0).css({"background":"#fd9c35"});
	}
	if(data.axialfanStatus == 1){//轴流风机
		$(".suffocating-top-one i").eq(1).css({"background":"#1fd19d"});
	}else{
		$(".suffocating-top-one i").eq(1).css({"background":"#fd9c35"});
	}
	if(data.airventStatus == 1){//通风机
		$(".suffocating-top-one i").eq(2).css({"background":"#1fd19d"});
	}else{
		$(".suffocating-top-one i").eq(2).css({"background":"#fd9c35"});
	}
	if(data.circulationStatsus == 1){//环流机
		$(".suffocating-top-one i").eq(3).css({"background":"#1fd19d"});
		$("#start").text("关闭");//按钮
		$("#btn-start").val("0");
		//$(".suffocating-top-one:gt(1)").css({"opacity": "1"});
		$("#startTime").css({"opacity": "1"});
		$(".collecting").show();//正在熏蒸图标
	}else{
		$(".suffocating-top-one i").eq(3).css({"background":"#fd9c35"});
		$("#start").text("开启");
		$("#btn-start").val("1");
		//$(".suffocating-top-one:gt(1)").css({"opacity": "0"});
		$("#startTime").css({"opacity": "0"});
		$(".collecting").hide();
	}
	//磷化氢浓度
	var avgph3 = 0;
	if(data.avgPH3){
		avgph3 = data.avgPH3; 
	}
	$(".suffocating-top-two-info h4").text(avgph3 + "ppm");//磷化氢浓度
}
//默认模式设置(1人工模式，2智能模式)
function setmodeType(data){
	var modetype = data.modeType;
	if(modetype == 1){
		$("#modeType").removeClass("on");
		$("#modeType").addClass("off");
		$("#modeType").parent().find("span").text("手动模式");
		$(".suffocating-top-one button:gt(0)").hide();
	}else if(modetype == 2){
		$("#modeType").removeClass("off");
		$("#modeType").addClass("on");
		$("#modeType").parent().find("span").text("智能模式");
		$(".suffocating-top-one button:gt(0)").show();
	}
}
//设备开启状态
function openData(data){
	//开始时间
	$("#openTime").text(data.operationTime);
	//开启设备总时长
	$("#totalTime").text(data.totalTime);
}
//修改默认模式表的状态
function updateFumigationType(fumigationType){
	var isOperation = "";
	var groupId = $("#searchform select[name=groupId] option:selected").val();
	var warehouseId = $("#searchform select[name=warehouseId] option:selected").val();
	$.ajax({
		type:"GET",
		url:"fumigation/editFumigationType",
		data:{groupId:groupId,warehouseId:warehouseId,fumigationType:fumigationType},
		async: false
	}).done(function(data){
		isOperation = data.isOperation;
	}).fail(function(err){
		alert("获取信息失败！","warning");
	});
	return isOperation;
}
//开启关闭操作
function setOpenOrclose(){
	/*var remoteStatus = $("#remotStatusHidden").val();
	if(remoteStatus == REMOTE_STATUS_BD){
		alert("本地链接状态下不能操作！","warning");
		return;
	}*/
	//判断是否有通风设备开启
	var windowStatus = $(".suffocating-top-one input[name=chuanghu]").val();
	var fengjiStatus = $(".suffocating-top-one input[name=fengji]").val();
	var tonfengdaoStatus = $(".suffocating-top-one input[name=tongfengdao]").val();
	if(windowStatus == 1||fengjiStatus ==1||tonfengdaoStatus == 1){//1开关开启
		alert("有通风设备开启，不能再开启熏蒸设备！","warning");
		return;
	}
	
	var openStatus = $("#btn-start").val();
	var groupId = $("#searchform select[name=groupId] option:selected").val();
	var warehouseId = $("#searchform select[name=warehouseId] option:selected").val();
	var text = "";
	if(openStatus=="1"){
		text = "开启";
	}else{
		text = "关闭";
	};
	confirm("确定要"+text+"吗？",function(){
		$.ajax({
			type:"GET",
			url:"fumigation/setSwitch",
			data:{groupId:groupId,warehouseId:warehouseId,openStatus:openStatus}
		}).done(function(data){
			if(data){
				 /* 操作状态。
				 * 3设备开启异常
				 * 2没有配置信息不可操作
				 * 1有设备配置信息且操作成功
				 * 0有设备配置信息但操作失败
				 */
				if(data.isOperation == result_type_3){
					alert("设备异常，请检查硬件设备及网络！","warning");
				}
				if(data.isOperation == result_type_2){
					alert("该仓没有熏蒸设备配置信息！","warning");
				}
				if(data.isOperation == result_type_1){
					alert("操作成功！");
					searchPageData(groupId,warehouseId);
				}
				if(data.isOperation == result_type_0){
					alert("操作失败！","warning");
				}
			}
		}).fail(function(err){
			alert("获取信息失败！","warning");
		})
	})
}
//图表

var mychart1;
var option1 = {
	color: ['#faae51', '#a4d150', '#58c5ee', '#333'],
	legend: {
		data: ['磷化氢浓度值(ppm)', '氧气浓度值(%)', '二氧化碳浓度值(ppm)'],
		top: '30'
	},
	grid: {
		top: "20%",
		bottom: "10%",
		left: '5%',
		right: '5%',
	},
	tooltip: {
		trigger: 'axis'
	},
	xAxis: [{
		type: 'category',
		boundaryGap: false,
		data: [''],
		name: '时间节点'
	}],
	yAxis: [{
		type: 'value',
		name: '气体浓度值(%)'
	}],
	series: [{
		name: '磷化氢浓度值(ppm)',
		type: 'line',
		symbolSize: 10,
		symbol: 'circle',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true,
					position: 'top'
				}
			}
		},
		data: [0.0]
	}, {
		name: '氧气浓度值(%)',
		type: 'line',
		symbolSize: 10,
		smooth: true,
		symbol: 'circle',
		itemStyle: {
			normal: {
				label: {
					show: true,
					position: 'top'
				}
			}
		},
		data: [0.0]
	}, {
		name: '二氧化碳浓度值(ppm)',
		type: 'line',
		smooth: true,
		symbolSize: 10,
		symbol: 'circle',
		itemStyle: {
			normal: {
				label: {
					show: true,
					position: 'top'
				}
			}
		},
		data: [0.0]
	}, {
		name: '当前气体浓度',
		type: 'line',
		markLine: {
			name: '当前气体浓度',
			symbol: 'none',
			data: [
				[{
					coord: ['12点', 0]
				}, {
					//30为纵轴的最大值
					coord: ['12点', 90]
				}]
			]
		}
	}]
};
myChart1 = echarts.init(document.getElementById('chart'));
myChart1.setOption(option1);

function setChartsData(data){
	option1.xAxis[0].data = data.xTime;
	option1.series[0].data = data.ph3List;
	option1.series[1].data = data.o2List;
	option1.series[2].data = data.co2List;
	
	myChart1.setOption(option1);
}