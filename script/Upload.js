
//--------------------------------- Upload : StaticPanel ------------------------
var Upload = function(){
	this.setTitle("Upload geodat");
	this.setId('upload');
}
Upload.prototype = new StaticPanel();

Upload.prototype.submitted = function () {
	$("#upload-loading").ajaxStart(function () {
		$(this).show();
	}).ajaxComplete(function () {
		$(this).hide();
	});

	$.ajaxFileUpload({
		url: './upload.php',
		secureuri: false,
		fileElementId: 'upload-file',
		dataType: 'json',
		success: function (data, status) {
			if (typeof(data.error) != 'undefined') {
				if (data.error != '') {
					alert(data.error);
				} else {
					$('#upload-file').value('');
					OSMCZ.changeQuery(data.msg);
				}
			}
		},
		error: function (data, status, e) {
			alert(e);
		}
	});

	return false;
}

