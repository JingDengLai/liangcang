$(function () {
    initTable();
	// 查询按钮事件
	$('#submit_search').click(function() {
		var name = $.trim($('#searchform #name').val());
		$('#searchform #name').val(name);
		$('#table').bootstrapTable('refresh', {url : 'basic/variety/varieties'});
	});
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform").reset();
	});
	
});

function initTable() {
    $('#table').bootstrapTable({
        // url: '../js/safe/data1.json',
        // method: 'get',
        columns: [ {
            title: '全选',
            field: '全选',
            checkbox: true
        }, {
            field: 'code',
            title: '编号'
        }, {
            field: 'date',
            title: '日期'
        }, {
            field: 'name',
            title: '计划名称'
        },{
            field: 'desc',
            title: '完成情况'
        }],
		data: [{
		    code: 1,
		    date: 'Item 1',
		    name: '$1',
			desc: 'ss'
		}, {
		    code: 2,
		    date: 'Item 2',
		    name: '$2',
		    desc: 'ss2'
		}]
    })
}