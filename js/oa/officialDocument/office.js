//默认参数
var defaults = {
	title: "公文", //窗口标题
	view: "text", //视图类型["text","form"]
	edit : false, //是否可编辑
	save : true, //是否需保存
	toolbars : { //右侧工具栏
		show: false, //是否显示office工具栏
		menu : [ "seal", "textHeader", "comment", "trace", "file"], // 右侧工具栏功能 [电子签章,套红,批注,痕迹,文件(打印,下载)]
	},
	officialDocumentId : null, // 公文ID
	officialDocumentType : null, //公文类型
	formId : null, //封面ID
	textId : null, //正文ID
	formData : {} //封面数据
}

//参数
var options;

//用于Office的ActiviteX控件
var office = null;

//文档是否需要保存
var isNeedSave = true;

//文档是否已经保存
var hasSaved = true;

//文档是否包含头部
var hasHeader = false;

//文档是否包含头部
var hasHeaderData = true;

//是否显示保存按钮
var isSaveButtonEnadble = false;

//弹出框返回接货
var rtn = {
	officialDocumentId: null,
	textId: null
}

$(function() {
	
	$("#save-and-close-btn").click(function(){
		window.close();
	});
	$("#close-btn").click(function(){
		isNeedSave = false;
		window.close();
	});
	
	window.onbeforeunload = function() {
		isDocumentSaved();
	};
	
	if(checkOfficeInstall()) {
		options = $.extend(defaults, window.dialogArguments);
		
		if(options.title){
			document.title = options.title;
		}
		
		if(options.view == "text"){
			previewText();
		}else if(options.view == "form"){
			previewForm();
		}else{
			alert("参数'view'错误");
		}
		
		toolbarInit();
	}
	
});

function isDocumentSaved(){
	if(isNeedSave){
		try {
			hasSaved = office.ActiveDocument.Saved;
		} catch (e) {
		}
		
		if(!hasSaved){
			if(options.officialDocumentType != 3){
				upload();
			}
		}
	}
	
	try {
		office.ActiveDocument.Application.UserName = "";
	} catch (e) {
		console.error(e);
	}
	
	office.close();
	window.close();
}

//预览表单
function previewForm(){
	
	try {
		office.Toolbars = false;
	} catch (e) {
		console.error(e);
	}
	
	if(options.officialDocumentType == 3){
		var formUrl = modelpath + "templates/OFFICIAL_DOCUMENT_RECEIVE_FORM.docx";
		hasHeaderData = false;
		try {
			office.Open(formUrl);
		} catch (e) {
			console.error(e);
		}
	}else{
		var textUrl = null;
		if(options.textId){
			textUrl = getRootPath_dc() + "/oa/officialDocument/body/" + options.textId;
		}else if(options.officialDocumentId){
			textUrl = getRootPath_dc() + "/oa/officialDocument/" + options.officialDocumentId + "/body";
		}
		
		var formUrl = modelpath + "templates/OFFICIAL_DOCUMENT_FORM.docx"
		
		if(textUrl){
			try {
				office.Open(textUrl);
			} catch (e) {
				console.error(e);
			}
			
			//生成头部表单
			if(options.officialDocumentId){
				$.ajax({
					url : 'oa/officialDocument/' + options.officialDocumentId + "/header",
					type : 'GET',
					async: false,
					cache : false
				}).done(function(data) {
					if(data == false){
						try {
							office.ActiveDocument.Application.Selection.HomeKey(6, 0); 
							office.ActiveDocument.Application.Selection.Range.InsertFile(formUrl);
							hasHeader = true;
							hasHeaderData = false;
						} catch (e) {
							console.error(e);
						}
					}
				}).fail(function() {
					alert('公文正文查询失败!');
				});
			}else{
				try {
					office.ActiveDocument.Application.Selection.HomeKey(6, 0); 
					office.ActiveDocument.Application.Selection.Range.InsertFile(formUrl);
					hasHeader = true;
					hasHeaderData = false;
				} catch (e) {
					console.error(e);
				}
			}
		}else{
			try {
				office.Open(formUrl);
				hasHeaderData = false;
			} catch (e) {
				console.error(e);
			}
		}
	}
	
	if(!hasHeaderData){
		$.each(options.formData,function(key){
			try{
				if(key && office.ActiveDocument.Bookmarks(key)){
					office.ActiveDocument.Bookmarks(key).Range.Text = options.formData[key];
				}
			}catch(e){
				console.error(e);
			}
		});
	}
	
	try {
		office.ActiveDocument.Application.UserName = username;
	} catch (e) {
		console.error(e);
	}
	
	if(options.officialDocumentType == 3){
		var formData = options.formData;
		if(formData.commentList){
			if(formData.commentList[0]){
				UnProtectDoc();
				try {
					office.ActiveDocument.Bookmarks("comment1").Range.Text = formData.commentList[0].comment;
					
					var countersignature = getShapeByName("comment-signature-1");
					if(countersignature == null){
						commentsignature = office.ActiveDocument.Shapes.AddPicture(getRootPath_dc() + "/oa/officialDocument/signature/" + formData.commentList[0].receiveId + ".png", false, true, 320, 220);
						commentsignature.Width=70;
						commentsignature.Height=25;
						commentsignature.WrapFormat.Type = 3;
						commentsignature.ZOrder(5);
						commentsignature.Name="comment-signature-1";
					}
				} catch (e) {
					console.error(e);
				}
				ProtectDoc();
				
			}
			if(formData.commentList[1]){
				UnProtectDoc();
				try {
					office.ActiveDocument.Bookmarks("comment2").Range.Text = formData.commentList[1].comment;
					
					var countersignature = getShapeByName("comment-signature-2");
					if(countersignature == null){
						var commentsignature = office.ActiveDocument.Shapes.AddPicture(getRootPath_dc() + "/oa/officialDocument/signature/" + formData.commentList[1].receiveId + ".png", false, true, 320, 350);
						commentsignature.Width=70;
						commentsignature.Height=25;
						commentsignature.WrapFormat.Type = 3;
						commentsignature.ZOrder(5);
						commentsignature.Name="comment-signature-2";
					}
				} catch (e) {
					console.error(e);
				}
				ProtectDoc();
			}
			if(formData.commentList[formData.commentList.length - 1]){
				UnProtectDoc();
				try {
					office.ActiveDocument.Bookmarks("comment3").Range.Text = formData.commentList[formData.commentList.length - 1].comment;
					
					var countersignature = getShapeByName("comment-signature-3");
					if(countersignature == null){
						var commentsignature = office.ActiveDocument.Shapes.AddPicture(getRootPath_dc() + "/oa/officialDocument/signature/" + formData.commentList[formData.commentList.length - 1].receiveId + ".png", false, true, 320, 620);
						commentsignature.Width=70;
						commentsignature.Height=25;
						commentsignature.WrapFormat.Type = 3;
						commentsignature.ZOrder(5);
						commentsignature.Name="comment-signature-3";
					}
				} catch (e) {
					console.error(e);
				}
				ProtectDoc();
			}
		}

		if(options.officialDocumentId){
			//会签
			$.ajax({
				url : 'oa/officialDocument/counter-signatures?id=' + options.officialDocumentId + "&type=" + options.officialDocumentType,
				type : 'GET',
				cache : false
			}).done(function(data) {
				if (data) {
					UnProtectDoc();
					$.each(data, function(i, n){
						var left = 50 + parseInt(i%5)*70;
						var top = 390 + parseInt(i/5)*30;
						try {
							var countersignature = getShapeByName("counter-signature-" + n);

							if(countersignature == null){
								var signatureUrl = getRootPath_dc() + "/oa/officialDocument/signature/" + n + ".png";
								$.ajax({
									  url: signatureUrl,
									  type: 'GET',
									  cache: false,
									  complete: function(response) {
									   if(response.status == 200) {
										   UnProtectDoc();
										   try {
											   var countersignature = office.ActiveDocument.Shapes.AddPicture(signatureUrl, false, true, left, top);
											   countersignature.Width=70;
											   countersignature.Height=25;
											   countersignature.WrapFormat.Type = 3;
											   countersignature.ZOrder(5);
											   countersignature.Name="counter-signature-" + n;
											} catch (e) {
												console.error(e);
											}
											ProtectDoc();
									   }
									  }
								});
							}
						} catch (e) {
							console.error(e);
						}
					});
					ProtectDoc();
				}
			}).fail(function() {
				alert('会签电子签名查询失败!',"warning");
			});
		}
	}else{
		
		if(options.officialDocumentId){
			try {
				office.ActiveDocument.Application.Selection.HomeKey(6, 0); 
			} catch (e) {
				console.error(e);
			}
			//签发
			$.ajax({
				url : 'oa/officialDocument/issue?id=' + options.officialDocumentId,
				type : 'GET',
				cache : false
			}).done(function(data) {
				if (data) {
					UnProtectDoc();
					try {
						var issuesignature = getShapeByName("issue-signature");
						
						if(issuesignature == null){
							issuesignature = office.ActiveDocument.Shapes.AddPicture(getRootPath_dc() + "/oa/officialDocument/signature/" + data + ".png", false, true, 60, 150);
							issuesignature.Width=70;
							issuesignature.Height=25;
							issuesignature.WrapFormat.Type = 3;
							issuesignature.ZOrder(5);
							issuesignature.Name="issue-signature";
						}
						
					} catch (e) {
						console.error(e);
					}
					ProtectDoc();
				}
			}).fail(function() {
				alert('签发电子签名查询失败!',"warning");
			});
			
			try {
				office.ActiveDocument.Application.Selection.HomeKey(6, 0);
			} catch (e) {
				console.error(e);
			}
			//会签
			$.ajax({
				url : 'oa/officialDocument/counter-signatures?id=' + options.officialDocumentId + "&type=" + options.officialDocumentType,
				type : 'GET',
				cache : false
			}).done(function(data) {
				if (data) {
					UnProtectDoc();
					$.each(data, function(i, n){
						var left = 230 + parseInt(i%3)*70;
						var top = 110 + parseInt(i/3)*30;
						try {
							var countersignature = getShapeByName("counter-signature-" + n);
							if(countersignature == null){
								var signatureUrl = getRootPath_dc() + "/oa/officialDocument/signature/" + n + ".png";
								$.ajax({
									  url: signatureUrl,
									  type: 'GET',
									  cache: false,
									  complete: function(response) {
									   if(response.status == 200) {
										   UnProtectDoc();
										   try {
											   var countersignature = office.ActiveDocument.Shapes.AddPicture(signatureUrl, false, true, left, top);
											   countersignature.Width=70;
											   countersignature.Height=25;
											   countersignature.WrapFormat.Type = 3;
											   countersignature.ZOrder(5);
											   countersignature.Name="counter-signature-" + n;
											} catch (e) {
												console.error(e);
											}
											ProtectDoc();
									   }
									  }
								});
							}
						} catch (e) {
							console.error(e);
						}
					});
					ProtectDoc();
				}
			}).fail(function() {
				alert('会签电子签名查询失败!',"warning");
			});
		}
	}
	
	try {
		office.ActiveDocument.AcceptAllRevisions();
	} catch (e) {
		console.error(e);
	}
	
	HideRevisions();
	
	ProtectDoc();
}

function previewText(){
	
	var url = modelpath + "templates/OFFICIAL_DOCUMENT_TEXT.docx";
	if(options.textId){
		url = getRootPath_dc() + "/oa/officialDocument/body/" + options.textId;
	}else if(options.officialDocumentId){
		url = getRootPath_dc() + "/oa/officialDocument/" + options.officialDocumentId + "/body";
	}
	
	try {
		office.Open(url, true);
	} catch (e) {
		console.error(e);
	}
	
	try {
		office.ActiveDocument.Application.UserName = username;
	} catch (e) {
		console.error(e);
	}
	
	try {
		office.ActiveDocument.Application.Selection.HomeKey(6, 0); 
	} catch (e) {
		console.error(e);
	}
	
	try {
		office.ActiveDocument.TrackRevisions = true;
	} catch (e) {
		console.error(e);
	}
	
	HideRevisions();
	
	try {
		office.Save(getNewFileName(), true);
	} catch (e) {
		console.error(e);
	}
	
	if(options.edit){
		UnProtectDoc();
	}else{
		ProtectDoc();
	}
}

function toolbarInit() {
	if(options.toolbars.show){
		
		var toolbarsDiv = $(".animate-wrapper");
		var toolbarsIframe = $(".animate-iframe");
		$(toolbarsDiv).show();
		$(toolbarsIframe).show();
		setTimeout(function(){
			$(toolbarsDiv).removeClass("reset").addClass("animate");
		},5000);
		
		var timeout = null;
		$(toolbarsDiv).hover(function (){
			clearTimeout(timeout);
			$(toolbarsDiv).removeClass("animate").addClass("reset");
		}, function () {
			timeout = setTimeout(function(){
				$(toolbarsDiv).removeClass("reset").addClass("animate");
			}, 200);
		});
		
		if(options.toolbars.menu.indexOf("seal") >= 0){
			sealInit();
		}
		if(options.toolbars.menu.indexOf("comment") >= 0){
			commentInit();
		}
		if(options.toolbars.menu.indexOf("textHeader") >= 0){
			headerInit();
		}
		if(options.toolbars.menu.indexOf("trace") >= 0){
			traceInit();
		}
		if(options.toolbars.menu.indexOf("file") >= 0){
			fileInit();
		}
	}
}

function checkOfficeInstall() {
	office = document.getElementById("office");
	if (typeof (office) === 'undefined') {
		alert("请安装电子签章控件");
		return false;
	} else {
		try{
			office.Activate();
		}catch(e){
			console.error(e);
		}
		return true;
	}
}

function ProtectDoc(){
	if(options.edit){
		return;
	}else{
		try {
			office.ActiveDocument.Protect(3, true, "");
		} catch (e) {
			console.error(e);
		}
	}
}

function UnProtectDoc(){
	try {
		office.ActiveDocument.UnProtect();
	} catch (e) {
		console.error(e);
	}
}

function ShowRevisions(){
	try {
		UnProtectDoc();
		office.ActiveDocument.ShowRevisions = true;
		ProtectDoc();
	} catch (e) {
		console.error(e);
	}
}

function HideRevisions(){
	try {
		UnProtectDoc();
		office.ActiveDocument.ShowRevisions = false;
		ProtectDoc();
	} catch (e) {
		console.error(e);
	}
}


/**
 * 痕迹 功能初始化
 * @returns
 */
function traceInit(){
	$(".trace").show();

	var flag = true;
	$("#trace-show-btn").click(function(){
		if(flag){
			HideRevisions();
			flag = false;
		}
		ShowRevisions();
	});
	$("#trace-hide-btn").click(function(){
		HideRevisions();
	});
}

/**
 * 套红
 * @returns
 */
function headerInit(){
	$(".header-wrapper").show();
	var flag = false;
	$("#header-add-btn").click(function(){
		if (flag && !confirm("已经添加过文件红头,是否在此添加")){
			return;
		}
		UnProtectDoc();
		try {
			office.ActiveDocument.Application.Selection.HomeKey(6, 0); 
			office.ActiveDocument.Application.Selection.Range.InsertFile(modelpath + "templates/OFFICIAL_DOCUMENT_HEADER.docx");
			office.ActiveDocument.Application.Selection.MoveDown(5, 4, 0); 
			flag = true;
		} catch (e) {
			console.error(e);
		}
		ProtectDoc();
	});
}
/**
 * 批注 功能初始化
 * @returns
 */
function commentInit(){
	$(".comment-wrapper").show();
	
	$("#comment-add-btn").click(function(){
		var comment = document.getElementById("comment-input").value;
		if(comment){
			UnProtectDoc();
			try {
				office.ActiveDocument.Comments.Add(office.ActiveDocument.Application.Selection.Range, comment);
				ShowRevisions();
			} catch (e) {
				console.error(e);
			}
			ProtectDoc();
			document.getElementById("comment-input").value = "";
		}
	});
	
	var commentCount = 0;
	try {
		commentCount = office.ActiveDocument.Comments.Count;
	} catch (e) {
		console.error(e);
	};
	$("#comment-delete-btn").click(function(){
		if(commentCount < office.ActiveDocument.Comments.Count){
			var comment = null;
			for (var i = 1; i <= office.ActiveDocument.Comments.Count; i++) {
					var temp = office.ActiveDocument.Comments.Item(i);
					if(temp.Author == username){
						comment = temp;
					}
			}
			if(comment){
				UnProtectDoc();
				try {
					comment.Delete();
				} catch (e) {
					console.error(e);
				}
				ProtectDoc();
			}
		}
	});
}

/**
 * 文件 功能初始化
 * @returns
 */
function fileInit(){
	$("#print-btn").click(function(){
		office.printout(true);
	});
	$("#preview-btn").click(function(){
		try {
			office.ActiveDocument.ActiveWindow.View.Type = 4;
		} catch (e) {
			console.error(e);
		}
		$("#preview-exit-btn").show();
		$("#preview-btn").hide();
	});
	$("#preview-exit-btn").click(function(){
		try {
			office.ActiveDocument.ClosePrintPreview();
		} catch (e) {
			console.error(e);
		}
		$("#preview-exit-btn").hide();
		$("#preview-btn").show();
	});
	$("#download-btn").click(function(){
		office.showdialog(3);
	});
	
	if(options.edit){
		isSaveButtonEnadble = true;
	}
	if(options.toolbars.menu.indexOf("seal") >= 0){
		isSaveButtonEnadble = true;
	}
	if(options.toolbars.menu.indexOf("comment") >= 0){
		isSaveButtonEnadble = true;
	}
	if(options.toolbars.menu.indexOf("textHeader") >= 0){
		isSaveButtonEnadble = true;
	}
	
	if(isSaveButtonEnadble){
		$("#save-and-close-btn").show();	
		$("#save-btn").show();	
		$("#save-btn").click(function(){
			if(options.officialDocumentType != 3){
				upload();
			}
		});
	}
}

/**
 * 电子签章 功能初始化
 * @returns
 */
function sealInit(){
	$(".seal-wrapper").show();
	
	var seal = getShapeByName("seal");
	if(seal){
		$("#seal-select-btn").text("修改");
	}else{
		$("#seal-select-btn").text("添加");
	}

	$("#seal-select-btn").click(function(){
		var option = "dialogHeight:" + 530 + "px;dialogWidth:" + 600 + "px;status:no;scroll:no;resizable:no;center:yes";
		var result = window.showModalDialog("seal", null, option);
		if(result){
			
			var sealUrl = getRootPath_dc() + "/oa/officialDocument/seal/" + result + ".png";
			$.ajax({
				  url: sealUrl,
				  type: 'GET',
				  cache: false,
				  complete: function(xhr) {
					   if(xhr.status == 200) {
						   
						   UnProtectDoc();
						   var oldSeal = null;
						   try{
							   oldSeal = getShapeByName("seal");
						   }catch(e){
							   console.error(e);
						   }
						   try{
							   var seal = office.ActiveDocument.Shapes.AddPicture(sealUrl, false, true, 0, 0, 100, 100);
							   if(seal){
								   seal.WrapFormat.Type = 3;
								   seal.Name="seal";
							   }else{
								   alert("电子签章添加失败");
							   }
						   }catch(e){
							   console.error(e);
						   }
						   try{
							   if(oldSeal){
								   oldSeal.Delete();
							   }
							}catch(e){
								console.error(e);
							}
							ProtectDoc();
					   }else if(xhr.status == 404){
						   alert("未上传签章文件，请选择其他签章");
					   }else{
						   alert("电子签章获取失败");
					   }

						if(getShapeByName("seal")){
							$("#seal-select-btn").text("修改");
						}else{
							$("#seal-select-btn").text("添加");
						}
				  }
			});
			
		}
	});
	$("#seal-delete-btn").click(function(){
		var seal = getShapeByName("seal");
		if(seal){
			UnProtectDoc();
			try {
				seal.Delete();
			} catch (e) {
				console.error(e);
			}
			ProtectDoc();
			
			if(getShapeByName("seal")){
				$("#seal-select-btn").text("修改");
			}else{
				$("#seal-select-btn").text("添加");
			}
		}
	});
	
	var interval = null;
	$("#fit-up-btn").click(function(){
		var seal = getShapeByName("seal");
		if(seal){
			UnProtectDoc();
			try{
				seal.IncrementTop(-5);
			}catch(e){
				console.error(e);
			}
			ProtectDoc();
		}
	}).mousedown(function(){
		var seal = getShapeByName("seal");
		if(seal){
			UnProtectDoc();
			try{
				interval = setInterval(function(){
					seal.IncrementTop(-5);
				}, 50);
			}catch(e){
				console.error(e);
			}
			ProtectDoc();
		}
	}).mouseup(function(){
		clearInterval(interval);
	});
	$("#fit-down-btn").click(function(){
		var seal = getShapeByName("seal");
		if(seal){
			UnProtectDoc();
			try{
				seal.IncrementTop(5);
			}catch(e){
				console.error(e);
			}
			ProtectDoc();
		}
	}).mousedown(function(){
		var seal = getShapeByName("seal");
		if(seal){
			UnProtectDoc();
			try{
				interval = setInterval(function(){
					seal.IncrementTop(5);
				}, 50);
			}catch(e){
				console.error(e);
			}
			ProtectDoc();
		}
	}).mouseup(function(){
		clearInterval(interval);
	});
	$("#fit-left-btn").click(function(){
		var seal = getShapeByName("seal");
		if(seal){
			UnProtectDoc();
			try{
				seal.IncrementLeft(-5);
			}catch(e){
				console.error(e);
			}
			ProtectDoc();
		}
	}).mousedown(function(){
		var seal = getShapeByName("seal");
		if(seal){
			UnProtectDoc();
			try{
				interval = setInterval(function(){
					seal.IncrementLeft(-5);
				}, 50);
			}catch(e){
				console.error(e);
			}
			ProtectDoc();
		}
	}).mouseup(function(){
		clearInterval(interval);
	});
	$("#fit-right-btn").click(function(){
		var seal = getShapeByName("seal");
		if(seal){
			UnProtectDoc();
			try{
				seal.IncrementLeft(5);
			}catch(e){
				console.error(e);
			}
			ProtectDoc();
		}
	}).mousedown(function(){
		var seal = getShapeByName("seal");
		if(seal){
			UnProtectDoc();
			try{
				interval = setInterval(function(){
					seal.IncrementLeft(5);
				}, 50);
			}catch(e){
				console.error(e);
			}
			ProtectDoc();
		}
	}).mouseup(function(){
		clearInterval(interval);
	});
}

function getShapeByName(name){
	var shape = null;
	try {
		var count = office.ActiveDocument.Shapes.Count;
		for (var i = 1; i <= count; i++) {
			var item = office.ActiveDocument.Shapes.Item(i);
			if(item.Name == name){
				shape = item;
				break;
			}
		}
	} catch (e) {
		console.error(e);
	}
	return shape;
}

//上传本地word到服务器上
function upload() {
	
	if(!options.save){
		return;
	}
	
	office.HttpInit();
	
	var file = getNewFileName();
	office.Save(file, true);
	
	if(options.officialDocumentId){
		office.HttpAddPostString("officialDocumentId", options.officialDocumentId);
	}
	if(options.textId){
		office.HttpAddPostString("textId", options.textId);
	}
	if(hasHeader){
		office.HttpAddPostString("header",hasHeader);
	}
	
	office.HttpAddPostFile("file", file);
	
	var data = office.HttpPost(getRootPath_dc() + "/oa/officialDocument/body"); 

	if(data){
		var obj = JSON.parse(data);
		rtn.textId = obj.id;
		window.returnValue = JSON.stringify(rtn);
	}
	office.DeleteLocalFile(file);
}

function getNewFileName() {
	var path = office.DocumentFullName;
	var newPath = "";
    if (path != "") {
        var array = path.split("\\");
        for (var i = 0; i < array.length - 1; i++) {
        	newPath += (array[i] + "\\");
		}
        newPath += "TEMP.docx";
    }
    return newPath;
}

//获取项目绝对路径
function getRootPath_dc() {
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    if (webName == "") {
        return window.location.protocol + '//' + window.location.host;
    }
    else {
        return window.location.protocol + '//' + window.location.host + '/' + webName;
    }
}
