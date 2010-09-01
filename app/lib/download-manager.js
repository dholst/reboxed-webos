DownloadManager = {
  download: function(source, targetDirectory, targetFile, callback) {
    Log.debug("downloading " + source, " to " + targetDirectory + "/" + targetFile);

    new Mojo.Service.Request("palm://com.palm.downloadmanager/", {
      method: 'download',

      parameters: {
        target: source,
        targetDir : targetDirectory,
        subscribe: true,
        targetFilename: targetFile
      },

      onSuccess: function(resp) {
        if(this.downloadComplete(resp)) {
          callback(resp.target);
        }
      }.bind(this)
    });
  },

  downloadComplete: function(response) {
    return response.completed ||
           (response.completed == false &&
            response.interrupted == true &&
            response.amountReceived == response.amountTotal &&
            response.completionStatusCode == 11);
  }};
