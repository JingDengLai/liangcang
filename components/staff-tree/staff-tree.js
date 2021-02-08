(function($) {
	
	var modalHtml = '<div class="modal fade" id="approval-modal-0" tabindex="-1" role="dialog" data-backdrop="true" aria-hidden="true">' + 
	'	<div class="modal-dialog">' + 
	'		<div class="modal-content">' + 
	'			<div class="modal-header">' + 
	'				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
	'				<h4 class="modal-title">选择审批人</h4>' + 
	'			</div>' + 
	'			<div class="modal-body wicket_body">' + 
	'				<form id="updateform" class="updateform">' + 
	'					<div class="clearfix scroll-model">' + 
	'						<div class="staff-tree"></div>' + 
	'					</div>' + 
	'					<div class="btn-footer">' + 
	'						<button name="approverSubmitButton" type="button" class="btn btn-primary btn_add btn-common" data-dismiss="modal">添加</button>' + 
	'						<button type="button" class="btn btn-default btn-common" data-dismiss="modal">取消</button>' + 
	'					</div>' + 
	'				</form>' + 
	'			</div>' + 
	'		</div>' + 
	'	</div>' + 
	'</div>';
	
	var divHtml = '<span class="examine" title="点击修改审批人" style="vertical-align: top;"></span><span class="add-apply"  title="点修添加审批人" data-toggle="modal" data-target="#approval-modal-0">+</span>';
	
	var count = 0;
	function init(callback) {
		
		var obj = $(this);
		
		var modalId = "approval-modal-" + (++count);
		$("body").append(modalHtml.replace("approval-modal-0", modalId));
		obj.data("modalId", modalId);

		$('#' + obj.data("modalId") + ' button[name="approverSubmitButton"]').click(function() {
			setSelectName.apply(obj);
		});

		$.ajax({
			url : 'common/staff/tree',
			type : 'GET'
		}).done(function(result) {

			var data = [];
			$.each(result, function(i, n) {

				getTree(n, function(item) {
					data.push(item);
				});
			});

			var options = {
				multiSelect : true,
				expandIcon : 'glyphicon glyphicon-chevron-right',
				collapseIcon : 'glyphicon glyphicon-chevron-down',
				data : data
			};

			$('#' + obj.data("modalId") + ' .staff-tree').treeview(options);

			var ids = obj.data("selected-staff");
			setSelectNode(ids);
		}).fail(function(err) {
		}).always(function() {
			if (callback) {
				callback();
			}
		});

		$('#' + obj.data("modalId")).on('shown.bs.modal', function() {

			var ids = obj.data("selected-staff");
			setSelectNode(ids);

		});
		obj.html(divHtml.replace("approval-modal-0", modalId));
	}
	
	function getTree(parent, callback){
		var item = {
			id : "p_" + parent.id,
			text : parent.name,
			selectable : false,
			nodes : []
		}
		
		if (parent.staff) {
			item.nodes = item.nodes.concat($.map(parent.staff,function(n){
				return {
					id : "s_" + n.id,
					text : n.name,
					selectable : true,
					icon : "glyphicon glyphicon-user"
				};
			}));
		}
		
		if (parent.children) {
			$.each(parent.children, function(i,n){
				getTree(n, function(itemChild){
					item.nodes = item.nodes.concat(itemChild)
				});
			});
		}
		if(callback){
			callback(item);
		}
	}
	
	function setSelectNode(ids){
		var obj = $(this);
		var selectNodes = $('#' + obj.data("modalId") + ' .staff-tree').treeview('getSelected');
		$.each(selectNodes,function(i,n){
			$('#' + obj.data("modalId") + ' .staff-tree').treeview('unselectNode', [ n, { silent: true } ]);
		});
		if(ids){
			$.each(ids,function(i,n){
				$('#' + obj.data("modalId") + ' .staff-tree').treeview('selectNode', [ "s_" + n, { silent: true ,multiSelect:true} ]);
			});
		}
	}
	
	function setSelectName(){
		var obj = $(this);
		var selectNodes =  $('#' + obj.data("modalId") + ' .staff-tree').treeview('getSelected');
		var names = selectNodes.map(function(item) {
			return item.text;
		});
		var ids = selectNodes.map(function(item) {
			if(item.id && item.id.indexOf('s_') == 0) {
				return item.id.substring(2,item.id.length);
			}else{
				return item.id;
			}
		});
		
		var html = '<span class="leader">' + (!names ? "" : names.join(",")) + '</span>';
		obj.find('.examine').html(html);
		obj.data("selected-staff", ids);
		obj.find('.add-apply').hide();
		obj.find('.examine').click(function() {
			$('#' + obj.data("modalId")).modal("show");
		});
	}

	var methods = {
		setVal : function(ids) {
			var obj = $(this);
			if(obj && obj.find('.examine').length > 0){
				var selectNodes = $('#' + obj.data("modalId") + ' .staff-tree').treeview('getSelected');
				if(selectNodes){
					$.each(selectNodes,function(i,n){
						$('#' + obj.data("modalId") + ' .staff-tree').treeview('unselectNode', [ n, { silent: true } ]);
					});
				}
				
				if(ids){
					$.each(ids,function(i,n){
						$('#' + obj.data("modalId") + ' .staff-tree').treeview('selectNode', [ "s_" + n, { silent: true } ]);
					});
				}
				setSelectName.apply(obj);
			}else{
				init.apply(obj,[function(){
					var selectNodes = $('#' + obj.data("modalId") + ' .staff-tree').treeview('getSelected');
					if(selectNodes){
						$.each(selectNodes,function(i,n){
							$('#' + obj.data("modalId") + ' .staff-tree').treeview('unselectNode', [ n, { silent: true } ]);
						});
					}
					
					if(ids){
						$.each(ids,function(i,n){
							$('#' + obj.data("modalId") + ' .staff-tree').treeview('selectNode', [ "s_" + n, { silent: true } ]);
						});
					}
					setSelectName.apply(obj);
				}]);
			}
		},
		getVal : function() {
			var obj = $(this);
			var array = new Array();
			return obj.data("selected-staff");
		}
	};

	$.fn.staffView = function() {
		var method = arguments[0];
		if(methods[method]) {
			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
			return method.apply(this, arguments);
		} else if( typeof(method) == 'object' || !method ) {
			return init.apply(this, arguments);
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.pluginName' );
			return this;
		}
	  };

})(jQuery);