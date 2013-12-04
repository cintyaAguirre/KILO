var jQT = $.jQTouch({
        	icon: 'icon.png',
        	statusBar: 'black'
    		});
    		
$(document).ready(function(){
	$('#createEntry form').submit(createEntry);
	$('#settings form').submit(saveSettings);
	$('#settings').bind('pageAnimationStart',loadSettings);
	$('#dates li a').bind('click touchend', function(){
        var dayOffset = this.id;
        var date = new Date();
        date.setDate(date.getDate() - dayOffset);
        sessionStorage.currentDate = date.getMonth() + 1 + '/' + 
                                     date.getDate() + '/' + 
                                     date.getFullYear();
        refreshEntries();
    });
    var shortName = 'Kilo';
    var version = '1.0';
    var displayName = 'Kilo';
    var maxSize = 65536;
    db = openDatabase(shortName, version, displayName, maxSize);
    db.transaction(
        function(transaction) {
            transaction.executeSql(
                'CREATE TABLE IF NOT EXISTS entries ' +
                '  (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                '   date DATE NOT NULL, food TEXT NOT NULL, ' +
                ' calories INTEGER NOT NULL );'
            );
        }
    );
});

function refreshEntries() {
    var currentDate = sessionStorage.currentDate;
    $('#date h1').text(currentDate);
    //$('#date ul li:gt(0)').remove();
    db.transaction(
        function(transaction) {
            transaction.executeSql(
                'SELECT * FROM entries WHERE date = ? ORDER BY food;', 
                [currentDate], 
                function (transaction, result) {
                    for (var i=0; i < result.rows.length; i++) {
                        
                        var row = result.rows.item(i);
                        //var newEntryRow = $('#entryTemplate');
                        var newEntryRow = $('#entryTemplate').clone();
                        newEntryRow.removeAttr('id');
                        newEntryRow.removeAttr('style');
                        newEntryRow.data('entryId', row.id);
                        newEntryRow.appendTo('#date ul');
                        newEntryRow.find('.label').text(row.food);
                        newEntryRow.find('.calories').text(row.calories);
                    }
                }, 
                errorHandler
            );
        }
    );
}

function createEntry() {
    var date = sessionStorage.currentDate;
    var calories = $('#calories').val();
    var food = $('#food').val();
    db.transaction(
        function(transaction) {
            transaction.executeSql(
                'INSERT INTO entries (date, calories, food) VALUES (?, ?, ?);', 
                [date, calories, food], 
                function(){
                    refreshEntries();
                    jQT.goBack();
                }, 
                errorHandler
            );
        }
    );
    return false;
}

function errorHandler(transaction, error) {
    alert('Oops. Error was '+error.message+' (Code '+error.code+')');
    return true;
}

function saveSettings(){
	localStorage.age=$('#age').val();
	localStorage.budget=$('#budget').val();
	localStorage.weight=$('#weight').val();
	jQT.goBack();
	return false;
}

function loadSettings(){

	if(!localStorage.age){
		localStorage.age="";
	}
	
	if(!localStorage.budget){
		localStorage.budget="";
	}
	
	if(!localStorage.weight){
		localStorage.weight="";
	}

	$('#age').val(localStorage.age);
	$('#budget').val(localStorage.budget);
	$('#weight').val(localStorage.weight);
}
	