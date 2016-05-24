const wait = ( condition, consequence, delay = 0 ) => {
	if ( condition() ) {
		consequence();
		return;
	}

	window.setTimeout( wait.bind( null,
		condition,
		consequence,
		delay ? delay * 2 : 1
	), delay );
};

export default wait;
