$(function() {
	var groupId = $("#groupId").val();
	getVentilates(groupId);
});

function onchangeGroup(groupId){
	getVentilates(groupId);
}

function getVentilates(groupId){
	$.ajax({
        url: 'ventilate/main/getVentilates',
        datatype: 'json',
        type: 'GET',
        timeout: 20000, //超时时间：10秒
        data:{'groupId':groupId},
        success: function (data) {
        	var ventLen=eval("("+data+")"); 
        	var html = '';
            $.each(ventLen, function (i, item) {  
            	html += '<div class="ventilate-box">' +
				'<div class="ventilate-box-top">' +
					'<div class="suffocating-top-one">' +
						'<span class="storehouse-png"><span>'+item.warehouseCode+'</span></span>&emsp;' +
						'<div class="ventilate-box-top-info">' +
							'<p>' +
								'<span>粮食品种：</span>' +
								'<span>'+item.variety+'</span>' +
							'</p>' +
							'<p>' +
								'<span>储粮性质：</span>' +
								'<span>'+item.nature+'</span>' +
							'</p>' +
							'<p>' +
								'<span>仓内温度：</span>' +
								'<span>'+item.warehouseTemperature+'</span>' +
							'</p>' +
							'<p>' +
								'<span>平均粮温：</span>' +
								'<span>'+item.averageTemperature+'</span>' +
							'</p>' +
							'<p>' +
								'<span>本地 /远程：</span>' +
								'<span>'+item.remoteStatus+'</span>' +
							'</p>' +
							'<p>' +
								'<span>通风模式：</span>' +
								'<span>'+item.ventilateStatus+'</span>' +
							'</p>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<div class="ventilate-box-footer">' +
					'<a href="ventilate/detail?groupId='+groupId+'&warehouseId='+item.warehouseId+'"><img class="in-operator" src="images/in.png"/></a>' + 
				'</div>' + 
			'</div>';
            });  
            $(".ventilate-body").html(html);
        }
    });
}
