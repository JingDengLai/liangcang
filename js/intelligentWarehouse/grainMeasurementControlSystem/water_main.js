$(function(){
	//初始化
	initChart();
	
	hove();
	/*$(".lookCode").click(function(){
		$(".temperature").removeClass("storehouse-border");
   		$(this).addClass("storehouse-border");
   		window.location.href="retrospect/retrospectDetails.html";
	});*/
				
})

function initChart(){
	var groupId = $("#groupId").val();
	$.ajax({
		url: 'water/getWaterMainData',
        datatype: 'json',
        type: 'GET',
        data:{'groupId':groupId},
        success: function (data) {
        	if(data){
        		$(".retrospect-content").empty();
        		var location = $("#location").val();
        		$.each(data, function (i, item){
                	var html="<div style='height:11rem;' class='temperature' id='"+i+"' onclick='showTemp(this.id)'>"+
					"<div class='storehouse-left'><input type='hidden' name='warehouseId' value='"+item.warehouseId+"'>"+
						"<span class='storehouse-png' id='"+item.warehouseId+"'>"+item.warehouseCode+"<span>"+
					"</div>"+
					"<div class='storehouse-right storehouse-other temp'>"+
						"<span class='confirm_arrow' id='confirm_arrow_"+i+"'></span>"+
						"<span class='store-span'>粮食品种&nbsp:</span>"+
						"<span>"+(item.variety== null? "无":item.variety) +"</span><br>"+
						"<span class='store-span'>粮食性质&nbsp:</span>"+
						"<span>"+(item.nature == null? "无":item.nature)+"</span><br>"+
						"<span class='store-span'>粮食水分&nbsp:</span>"+
						"<span>"+(item.avgWaterValue == null? "无":item.avgWaterValue+"%")+"</span><br>"+
						"<span><img onclick='imgCilck(this)' src='images/collect.png' style='width:75px' class='temCode'/><a href='water/main?groupId="+item.groupId+"&warehouseId="+item.warehouseId+"'><img style='width:100px' src='images/in.png' class='temCode'/></a></span>"+
					"</div>"+
				"</div>";
                	
                	$(".retrospect-content").append(html);
                	$(".confirm_arrow").css('display','none');
                });  
        	}
        }
	});
}			
			function showTemp(id){
				if($("#"+id).hasClass("storehouse-border")){
					$("#"+id).removeClass("storehouse-border");
					$("#confirm_arrow_"+id).css('display','none');
				}else{
					$("#"+id).addClass("storehouse-border");
					$("#confirm_arrow_"+id).css('display','block');
				}					
			}

			$("#checkAll").click(function(){
				if($(this).prop("checked")){
					$(".temperature").addClass("storehouse-border");
					$(".confirm_arrow").css('display','block');
				}else{
					$(".temperature").removeClass("storehouse-border");
					$(".confirm_arrow").css('display','none');
				}
			})
/**
 * 采集状态
 */	
function hove(){
	$(".collecting").hover(function(){
			var groupId = $("#groupId").val();
			$.ajax({
				url: 'water/getCollectStatus',
		        datatype: 'json',
		        type: 'GET',
		        data:{'groupId':groupId},
		        success: function (data) {
		        	var collectStatus = data.collectStatus
		        	if(collectStatus){
		        		$("#collect_info").empty();
		        		$("#collect_info").append("<h3>采集检测</h3>");
		        		$.each(collectStatus, function (i, item){
		                	var html="<div class='process-group'><span>"+item+"号仓正在检测</span></div>";
		                	$("#collect_info").append(html);
		                });  
		        	}
		        }
			});			
		},function(){
			$("#collect_info").html("");
		});		
}			
/*function getCollectStatus(){
	
}*/
			
//采集按钮事件
$("#collectBtn").click(function() {
	var flag=false;//判断有无选中的
	var ids = [];
	$(".temperature").each(function(){
		if($(this).hasClass('storehouse-border')){//有选中的蓝框即对勾
				flag=true;
				var warehouseId = $(this).find("input[name='warehouseId']").val();
				ids.push(warehouseId);
		}
	})
	
	var warehouseIds = ids.join(",");
	if(warehouseIds){
		var groupId = $("#groupId").val();
		$.ajax({
			url : "water/collectWaterValue?groupId="+groupId+"&warehouseIds="+warehouseIds,
			type : 'POST'
		}).done(function(data) {
				if(data.status=='200'){
					if($(".collecting").html()==undefined||$(".collecting").html()==''){
						$(".collecting").css('display','block');
						var html = '<span class="collecting"> 正在采集... <img class="collecting-slider" src="images/collect-slider.png" /><div class="collecting-info" style="width: 200px" id="collect_info"><h3>采集检测</h3></div></span>';
						$("#collectBtn").after(html);
						hove();
					};
					
					alert("请求成功，正在采集");
				}else if(data.collect=='-1'){
					alert(data.msg,"warning");
				}else if(data.status=='405'){
					alert("采集过于频繁,请三分钟后再试！","warning");
				}else if(data.status=='401'){
					alert("设备异常，请检查硬件设备及网络！","warning");
				}else{
					alert("请求失败！","warning");
				}
		}).fail(function() {
			alert("请求失败！","warning");
			return
		});
	}
	if(!flag){
		alert("请选择仓间号！","warning");
		return;
	}
	
})

function imgCilck(obj){
	var groupId = $("#groupId").val();
	var warehouseId = $(obj).parent().parent().parent().find("input[name='warehouseId']").val();
			if(warehouseId==''||warehouseId==undefined){
				alert("请选择仓间号！","warning");
				return;
			}
			if(warehouseId){
				$.ajax({
					url : "water/collectWaterValue?groupId="+groupId+"&warehouseIds="+warehouseId,
					type : 'POST'
				}).done(function(data) {
					if(data){
						if(data.status=='200'){
							if($(".collecting").html()==undefined||$(".collecting").html()==''){
								$(".collecting").css('display','block');
								var html = '<span class="collecting"> 正在采集... <img class="collecting-slider" src="images/collect-slider.png" /><div class="collecting-info" style="width: 200px" id="collect_info"><h3>采集检测</h3></div></span>';
								$("#collectBtn").after(html);
								hove();
							};
							
							alert("请求成功，正在采集");
						}else if(data.collect=='-1'){
							alert(data.msg,"warning");
						}else if(data.status=='405'){
							alert("采集过于频繁,请三分钟后再试！","warning");
						}else if(data.status=='401'){
							alert("设备异常，请检查硬件设备及网络！","warning");
						}else{
							alert("请求失败！","warning");
						}
					}
				}).fail(function() {
					alert("请求失败！","warning");
				});
			}
}
