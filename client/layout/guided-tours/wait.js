const WAIT_INITIAL = 1; // initial wait in milliseconds
const WAIT_MULTIPLIER = 2;
const WAIT_MAX = 10000; // give up waiting when delay has grown to 10 seconds

const wait = ( condition, consequence, delay = 0 ) => {
	if ( condition() ) {
		consequence();
		return;
	}

	if ( delay >= WAIT_MAX ) {
		return;
	}

	window.setTimeout( wait.bind( null,
		condition,
		consequence,
		delay ? delay * WAIT_MULTIPLIER : WAIT_INITIAL
	), delay );
};

export default wait;
