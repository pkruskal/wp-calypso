/**
 * External dependencies
 */
var React = require( 'react' ),
	wrapWithClickOutside = require( 'react-click-outside' ),
	noop = require( 'lodash/noop' );

/**
 * Internal dependencies
 */
var SiteSelector = require( 'components/site-selector' ),
	hasTouch = require( 'lib/touch-detect' ).hasTouch;

const SitePicker = React.createClass( {
	displayName: 'SitePicker',

	propTypes: {
		onClose: React.PropTypes.func,
		layoutFocus: React.PropTypes.object
	},

	getInitialState: function() {
		return {
			isAutoFocused: false
		};
	},

	getDefaultProps: function() {
		return {
			onClose: noop
		};
	},

	componentWillReceiveProps: function( nextProps ) {
		if ( ! nextProps.layoutFocus || hasTouch() ) {
			return;
		}

		// The 200ms delay here is necessary to accomodate for LayoutFocus
		// toggling the visibility of inactive views via `setFocusHideClass`
		clearTimeout( this._autofocusTimeout );
		this._autofocusTimeout = setTimeout( function() {
			this.setState( {
				isAutoFocused: nextProps.layoutFocus.getCurrent() === 'sites'
			} );
		}.bind( this ), 200 );
	},

	componentWillMount: function() {
		window.addEventListener( 'keyup', this.keyUp, false );
	},

	componentWillUnmount: function() {
		window.removeEventListener( 'keyup', this.keyUp, false );
		clearTimeout( this._autofocusTimeout );
		this._autofocusTimeout = null;
	},

	keyUp: function( event ) {
		// this handles Escape key that was pressed outside the search box
		if ( event.keyCode === 27 && event.target.tagName !== 'INPUT' ) {
			this.closePicker();
		}
	},

	onClose: function( event ) {
		this.props.layoutFocus && this.props.layoutFocus.setNext( 'sidebar' );
		this.scrollToTop();
		this.props.onClose( event );
	},

	scrollToTop: function() {
		document.getElementById( 'secondary' ).scrollTop = 0;
		window.scrollTo( 0, 0 );
	},

	closePicker: function() {
		if ( this.props.layoutFocus && this.props.layoutFocus.getCurrent() === 'sites' ) {
			this.props.layoutFocus.set( 'sidebar' );
			this.scrollToTop();
		}
	},

	handleClickOutside: function() {
		this.closePicker();
	},

	render: function() {
		return (
			<SiteSelector
				ref="siteSelector"
				indicator={ true }
				showAddNewSite={ true }
				showAllSites={ true }
				sites={ this.props.sites }
				allSitesPath={ this.props.allSitesPath }
				siteBasePath={ this.props.siteBasePath }
				user={ this.props.user }
				autoFocus={ this.state.isAutoFocused }
				onClose={ this.onClose }
				groups={ true }
			/>
		);
	}
} );

module.exports = wrapWithClickOutside( SitePicker );
