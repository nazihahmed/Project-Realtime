
var files = [];

var socket = io();

var uploadFiles = function() {

    var fd = new FormData()
    for (var i in files) {
        fd.append("uploadedFile", files[i])
    }

    var subdir = 'images';
    var comments = $('#comments').val();
    var uniqueFilename = $('#uniqueFilename').prop('checked');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/media?subdir=' + subdir + '&comments=' + comments + '&uniqueFilename=' + uniqueFilename);
    xhr.onload = function() {
        var response = JSON.parse(this.responseText);
        console.log(response);
        if (this.status < 300) {
            giveMessage("Success", "Upload Success");
          for (var index in response) {
             appendUploadedFileToTable(response[index]);
          }
            socket.emit("newslide", response);
        } else {
          alert(response.message);
        }
    };
    xhr.onerror = function(err) {
        giveMessage("Error", err);
    }
    xhr.send(fd);

};

var appendUploadedFileToTable = function(file) {
    console.log(file);
    $('#result tr:last').after(
            "<tr><td><a href='upload_/" + file.subdir + "/" + file.filename + "'>" + file.filename + "</a></td>" +
            "<td>" + file.subdir + "</td>" +
            "<td>" + file.comments + "</td>" +
            "<td>" + file.filesize + "</td>" +
            "<td>" + file.originalFilename + "</td>" +
            "<td>" + new Date(file.creationDate).toLocaleString() + "</td>" +
            "<td><button class='btn btn-default btn-sm' " +
            "onClick='deleteFile(this, &quot;" + file.id + "&quot;)'>Delete</button></td></tr>");

}

var setFiles = function(element) {
  console.log('files:', element.files);
  // Turn the FileList object into an Array
    files = [];
    for (var i = 0; i < element.files.length; i++) {
      files.push(element.files[i]);
    }
};

dpd.media.get(function(data, statusCode, headers, config) {
    for(var index in data) {
        appendUploadedFileToTable(data[index]);
    }
});

var deleteFile = function(element, id) {
    $(element).closest('tr').remove();
    dpd.media.del(id, function(data, status) {
        giveMessage("Success", "the File has been removed");
        socket.emit("slide removed", id);
    });
}
