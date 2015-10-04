function cleanup(ref){
	ref.once("value", function(snapshot) {

	  	snapshot.forEach(function(childSnapshot) {

	    	var currentTime = new Date().getTime();

	    	var key = childSnapshot.key();
	    	var childData = childSnapshot.val();

	    	if (currentTime - childData.time >= 43200000) {
	    		var child = childSnapshot.ref();
	    		child.remove();
    } 
  });
});
}