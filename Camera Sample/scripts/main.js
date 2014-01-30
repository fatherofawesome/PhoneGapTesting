
var database;

document.addEventListener("deviceready", onDeviceReady, false);
 
function id(element) {
    return document.getElementById(element);
}

function dbErrorHandler(err) {
    alert("DB Error: " + err.message + "\nCode=" + err.code);
}

function onDeviceReady() {
	cameraApp = new cameraApp();
	cameraApp.run();

	console.log("Before - Database Opened/Created");
	database = window.openDatabase("GAA_Database", 2, "GAA_Database", 10000000);
	console.log("After - Database Opened/Created");

	database.transaction(createTables, dbErrorHandler, getEntries);
	console.log("Database Transaction Initiated");
}

function createTables(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,first,last,dob)");
}

function getEntries() {
    dbShell.transaction(function (tx) {
        tx.executeSql("select id, first, last, dob from notes order by id desc", [], renderEntries, dbErrorHandler);
    }, dbErrorHandler);
}

function renderEntries(tx, results) {
    console.log("attempting to render entries");
}

function cameraApp(){}

cameraApp.prototype={
    _pictureSource: null,
    
    _destinationType: null,
    
    run: function(){
        var that=this;
	    that._pictureSource = navigator.camera.PictureSourceType;
	    that._destinationType = navigator.camera.DestinationType;
	    id("capturePhotoButton").addEventListener("click", function(){
            that._capturePhoto.apply(that,arguments);
        });
	    id("capturePhotoEditButton").addEventListener("click", function(){
            that._capturePhotoEdit.apply(that,arguments)
        });
	    id("getPhotoFromLibraryButton").addEventListener("click", function(){
            that._getPhotoFromLibrary.apply(that,arguments)
        });
	    id("getPhotoFromAlbumButton").addEventListener("click", function(){
            that._getPhotoFromAlbum.apply(that,arguments);
        });
    },
    
    _capturePhoto: function() {
        var that = this;
        
        // Take picture using device camera and retrieve image as base64-encoded string.
        navigator.camera.getPicture(function(){
            that._onPhotoDataSuccess.apply(that,arguments);
        },function(){
            that._onFail.apply(that,arguments);
        },{
            quality: 50,
            destinationType: that._destinationType.DATA_URL
        });
    },
    
    _capturePhotoEdit: function() {
        var that = this;
        // Take picture using device camera, allow edit, and retrieve image as base64-encoded string. 
        // The allowEdit property has no effect on Android devices.
        navigator.camera.getPicture(function(){
            that._onPhotoDataSuccess.apply(that,arguments);
        }, function(){
            that._onFail.apply(that,arguments);
        }, {
            quality: 20, allowEdit: true,
            destinationType: cameraApp._destinationType.DATA_URL
        });
    },
    
    _getPhotoFromLibrary: function() {
        var that= this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that._getPhoto(that._pictureSource.PHOTOLIBRARY);         
    },
    
    _getPhotoFromAlbum: function() {
        var that= this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that._getPhoto(that._pictureSource.SAVEDPHOTOALBUM)
    },
    
    _getPhoto: function(source) {
        var that = this;
        // Retrieve image file location from specified source.
        navigator.camera.getPicture(function(){
            that._onPhotoURISuccess.apply(that,arguments);
        }, function(){
            cameraApp._onFail.apply(that,arguments);
        }, {
            quality: 50,
            destinationType: cameraApp._destinationType.FILE_URI,
            sourceType: source
        });
    },
    
    _onPhotoDataSuccess: function(imageData) {
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
    
        // Show the captured photo.
        smallImage.src = "data:image/jpeg;base64," + imageData;
    },
    
    _onPhotoURISuccess: function(imageURI) {
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
         
        // Show the captured photo.
        smallImage.src = imageURI;
    },
    
    _onFail: function(message) {
        alert(message);
    }
}