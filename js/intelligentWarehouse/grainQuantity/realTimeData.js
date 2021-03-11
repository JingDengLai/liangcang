$(function () {
	//加载账面数量
	initChart();
	//加载监测数量
	initChart1();
	//加载库存数量
	initChart2();
	
	// 手工采集
	$("#manualCollection").click(function() {
		$('#approver').modal('show');
		$("#inWidthDiv").show();
		$("#inLenthDiv").show();
		$("#circularDiameterDiv").hide();
		getWareHouseList();
		getWareHouse();
	});
	$('#approver').on('hide.bs.modal', function() {
		$("#approver form").each(function() {
			$(this).reset();
		});
	})
	manualCollection();
	collecting();
	
});
var myChart = echarts.init(document.getElementById('chart1'));
var myChart1 = echarts.init(document.getElementById('chart2'));
var myChart2 = echarts.init(document.getElementById('chart3'));
//账面数量
function initChart(){
	$.ajax({
		type: 'get',
		url: 'grainQuantity/realTimeData/paperAmount',
		toolbar:'',
		dataType: 'json',
	    data:{"groupId": $("#groupId").val()},
		success: function(data){
			if(data==null){
				if (myChart){
					myChart.clear();					
				}
			}else{
				if (myChart){
					myChart.setOption(dataOption_paperAmount(data));						
				}
			}
	    }		
   });
};

function changeGroupId(){
	//加载账面数量
	initChart();
	//加载监测数量
	initChart1();
	//加载库存数量
	initChart2();
	manualCollection();
	collecting();
}
//加载账面数量
function dataOption_paperAmount(json){  
    return{color: ['#5ac6ee'],
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		legend: {
			data: ['账面数量'],
			top: 30
		},
		grid: {
			top: '10%',
			left: '2%',
			right: '10%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			name: "吨",
			type: 'value',
			boundaryGap: [0, 0.01]
		},
		yAxis: {
			name: "仓间号",
			type: 'category',
			data: json.inventory.allWarehouseCode
		},
		series: [{
			name: '账面数量',
			type: 'bar',
			
			label: {
				normal: {
					position: 'right',
					show: true
				}
			},
			data:json.inventory.allWarehouseQuantity 
		}]
	};
}

//监测数量
function initChart1(){
	$.ajax({
		type: 'get',
		url: 'grainQuantity/realTimeData/monitorAmount',
		toolbar:'',
		dataType: 'json',
	    data:{"groupId": $("#groupId").val()},
		success: function(data){
			if(data==null){
				if (myChart1){
					myChart1.clear();					
				}
			}else{
				if (myChart1){
					var changeVal = ["Q1","P20"];
					var allWarehouseCode = data.inventory.allWarehouseCode;
					changeVal.forEach(function(item,i){
						var obj = {
							value: item + "(机)",
		                    textStyle: {
		                        fontWeight:'bold',
		                        color:"red"
		                    }
						};
						var index = allWarehouseCode.indexOf(item);
						allWarehouseCode.splice(index,1,obj);
					});
					
					myChart1.setOption(dataOption_monitorAmount(data));		
				}
			}
	    }		
   });
};
//加载监测数量
function dataOption_monitorAmount(json){  
    return{
    	color: ['#aed959'],
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		legend: {
			data: ['监测数量'],
			top: 30
		},
		grid: {
			top: '10%',
			left: '2%',
			right: '10%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			name: "吨",
			type: 'value',
			boundaryGap: [0, 0.01]
		},
		yAxis: {
			name: "仓间号",
			type: 'category',
			data:json.inventory.allWarehouseCode
		},
		series: [{
			name: '监测数量',
			type: 'bar', 
			label: {
				normal: {
					position: 'right',
					show: true
				}
			},
			data: json.inventory.allWarehouseQuantity
		}]
	};
}
//库存数量监测
function initChart2(){
	$.ajax({
		type: 'get',
		url: 'grainQuantity/realTimeData/inventoryAmount',
		toolbar:'',
		dataType: 'json',
	    data:{"groupId": $("#groupId").val()},
		success: function(data){
			if(data==null){
				if (myChart2){
					myChart2.clear();					
				}
			}else{
				if (myChart2){
					$("#errorValue").html(data.errorValue+"吨");
					$("#errorRate").html(data.errorRate+"%");
					myChart2.setOption(dataOption_inventoryAmount(data));							
				}
			}
	    }		
   });
};
//加载库存数量
function dataOption_inventoryAmount(json){  
    return{
    	color: ['#333'],
		tooltip: {
			
		},
		legend: {
			data: ['监测数量', '账面数量'],
			top: 30
		},
		grid: {
			top: '10%',
			left: '2%',
			right: '26%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			name: "数量类型",
			type: 'category',
			data: ['监测数量', '账面数量'],
		},
		yAxis: {
			name: "吨",
			type: 'value',
		},
		series: [{
			name: '数量类型',
			type: 'bar',
			barWidth: 30,
			data: [{
                value:json.monitorQuantityTotal,
	            itemStyle:{
	                  	normal:{color:'#aed959'}
	            }
            },
			{
                value:json.paperQuantityTotal,
	                itemStyle:{
	                  	normal:{color:'#5ac6ee'}
	            }
            }],
            label: {
				normal: {
					position: 'top',
					show: true
				}
			},
			 markLine : {
			 	silent: true,
			 	symbol: 'none',
			 	label: {
					normal: {
						show: false,
					}
				},
                data : [
                    {type : 'min', name: '最小值'}
                ]
            }
		}]
	};
}

//手工采集
function manualCollection() {
	$('#dataForm').bootstrapValidator({
		fields : {
			groupId : {
				validators : {
					notEmpty : {
						 message: '不能为空'
					}
				}
			},
			warehouseId : {
				validators : {
					notEmpty : {
						 message: '不能为空'
	                 }
				}
			},
			deductVolume : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
	                     min: 1,
	                     max: 12,
	                     message:"不能超过12个字符"
	                 },
	                 regexp:{
							regexp:/^\d+(\.\d{1,2})?$/,
							message:"只能填写数字，小数点后不能超过2位"
						}
	                 
					
				}
			},
			volumeWeight : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			},
			ratio : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
	                     min: 1,
	                     max: 12,
	                     message:"不能超过12个字符"
	                 },
	                 regexp:{
							regexp:/^\d+(\.\d{1,2})?$/,
							message:"只能填写数字，小数点后不能超过2位"
						}
				}
			},
			transportWay : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			},
			storageMethod : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			}
			
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		var mydata =  $('#dataForm').serializeObject();
		mydata.equipCode=$("#equipCode").val();
		mydata.equipStatusId=$("#equipStatusId").val();
		$.ajax({
			type : 'POST',
			url : "grainQuantity/realTimeData/add",
			data :JSON.stringify(mydata)
		}).done(function(data) {
			$('#approver').modal('hide');
			if(data){
				if(data.collect=='-1'){
					alert(data.msg,"warning");
					return;
				}
				
				if(data.code !== "200"){
					alert("设备异常，请检查硬件设备及网络！","warning");
				}else if(data.flag >0){
					alert("采集成功！");
				}else{
					alert("采集失败！","warning");
				}
			}
		}).fail(function(err) {
			alert("添加失败!","warning");
		}).always(function() {
			$('#approver').modal('hide');
			$("#dataForm").reset();
			$('#table').bootstrapTable('refresh');
			collecting();
		});
	});
}
var warehouseData;
function getWareHouseList(){
	var groupId = $("#dataForm #groupId").val();
	$.ajax({
		url : 'grainQuantity/realTimeData/groupId/'+groupId,
		type : 'GET'
	}).done(function(data) {
		warehouseData=data;
		$("#warehouseId").empty();
		$.each(data,function(index,items){
			$("#warehouseId").append("<option value='"+items.warehouseId+"'>"+items.code+"</option>");
		});
		getWareHouse();
	}).fail(function(err) {
		
	}).always(function() {
		
	});
}

function getWareHouse(){
	var warehouseId = $("#warehouseId").val();
	$.each(warehouseData,function(index,items){
		if(warehouseId==items.warehouseId){
			$("#dataForm #equipCode").val(items.equipCode);
			$("#dataForm #equipStatusId").val(items.equipStatusId);
		}
	});
	$.ajax({
		url : 'grainQuantity/realTimeData/warehouseId',
		type : 'GET',
		data:{groupId: $("#approver #groupId").val(),warehouseId: $("#approver #warehouseId").val()},
	}).done(function(data) {
		$("#deductVolume").val("");
		$("#ratio").val("1");
		$("#density").val("");
		if(data.wareHouse.type==1){
			$("#inWidthDiv").show();
			$("#inLenthDiv").show();
			$("#circularDiameterDiv").hide();
			$("#inWidth").val(data.wareHouse.width);
			$("#inLenth").val(data.wareHouse.length);
		}else if(data.wareHouse.type==2){
			$("#inWidth").val("");
			$("#inLenth").val("");
			$("#inWidthDiv").hide();
			$("#inLenthDiv").hide();
			$("#circularDiameterDiv").show();
			$("#circularDiameter").val(data.wareHouse.circularDiameter);
			$("#circularHeight").val(data.wareHouse.circularHeight);
		}
		
		$("#volumeWeight").val(data.actualVolumeWeigh);
		volumeWeightPick();
		if(data.actualVolumeWeigh==null){
			alert("此仓没有仓间检验记录","warning")
		}
		calculateDensity();
	}).fail(function(err) {
		
	}).always(function() {
		
	});
}
//正在采集
function collecting(){
	$.ajax({
		url : 'grainQuantity/realTimeData/collecting/'+$("#groupId").val(),
		type : 'GET'
	}).done(function(data) {
		if(data.warehouseCode.length==0){
			$(".collecting").css("display","none");
		}else{
			var widthArr = data.completeRatio;
			$("#collectingInfo").html("");
			/*$("#collectingInfo").append("<h3>采集检测</h3>");*/
			for(var i=0;i<data.warehouseCode.length;i++){
				$("#collectingInfo").append('<div class="process-group">'
						+'	<span>'+data.warehouseCode[i]
						+'正在检测</span>'
						/*+'	<div class="process-bar">'
						+'		<div class="process-bar-body">'
						+'		</div>'
						+'		<span></span>'
						+'	</div>'
						+'	<span>检测剩余6分钟</span>'*/
						+'</div>');
			}
			
			$(".process-bar-body").each(function  (n, obj) {
				$(obj).width(widthArr[n] + "%");
				$(obj).next().text(widthArr[n] + "%");
			})
		}
		
		
	}).fail(function(err) {
		
	}).always(function() {
		
	});
	
}


//计算密度
function calculateDensity(){
	var ratio = $("#ratio").val();
	var volumeWeight = $("#volumeWeight").val();
	$("#density").val(Math.round(ratio*volumeWeight*100/100));
}

function volumeWeightPick(){
	$("#dataForm").data('bootstrapValidator')
	.updateStatus('volumeWeight', 'NOT_VALIDATED', null)
	.validateField('volumeWeight');
}
