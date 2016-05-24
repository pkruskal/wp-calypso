/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { getSelectedSite } from 'state/ui/selectors';
import { getGuidedTourState } from 'state/ui/guided-tours/selectors';
import { nextGuidedTourStep, quitGuidedTour } from 'state/ui/guided-tours/actions';
import { query } from './positioning';
import {
	BasicStep,
	FirstStep,
	LinkStep,
	FinishStep,
	ActionStep,
} from './steps';
import wait from './wait';

class GuidedTours extends Component {
	constructor() {
		super();
		this.bind( 'next', 'quit', 'finish' );
	}

	bind( ...methods ) {
		methods.forEach( m => this[ m ] = this[ m ].bind( this ) );
	}

	componentDidMount() {
		const { stepConfig } = this.props.tourState;
		this.updateTarget( stepConfig );
	}

	shouldComponentUpdate( nextProps ) {
		return this.props.tourState !== nextProps.tourState;
	}

	componentWillUpdate( nextProps ) {
		const { stepConfig } = nextProps.tourState;
		this.updateTarget( stepConfig );
	}

	updateTarget( step ) {
		this.tipTargets = this.getTipTargets();
		this.currentTarget = step && step.target
			? this.tipTargets[ step.target ]
			: null;
	}

	getTipTargets() {
		const tipTargetDomNodes = query( '[data-tip-target]' );
		return tipTargetDomNodes.reduce( ( tipTargets, node ) => Object.assign( tipTargets, {
			[ node.getAttribute( 'data-tip-target' ) ]: node
		} ), {} );
	}

	next() {
		const nextStepName = this.props.tourState.stepConfig.next;
		const nextStepConfig = this.props.tourState.nextStepConfig;

		const predicate = () => {
			console.log( 'predicate' );
			if ( nextStepConfig && nextStepConfig.target ) {
				const target = this.getTipTargets()[nextStepConfig.target];
				console.log( target && target.getBoundingClientRect() );
				return target && target.getBoundingClientRect().left >= 0;
			}
			return true;
		};
		const consequence = () => {
			console.log( 'consequence!' );
			window.wut = false;
			this.props.nextGuidedTourStep( { stepName: nextStepName } );
		};
		wait( predicate, consequence );
	}

	quit( options = {} ) {
		this.currentTarget && this.currentTarget.classList.remove( 'guided-tours__overlay' );
		this.props.quitGuidedTour( Object.assign( {
			stepName: this.props.tourState.stepName
		}, options ) );
	}

	finish() {
		this.quit( { finished: true } );
	}

	render() {
		const { stepConfig } = this.props.tourState;

		if ( ! stepConfig ) {
			return null;
		}

		const StepComponent = {
			FirstStep,
			ActionStep,
			LinkStep,
			FinishStep,
		}[ stepConfig.type ] || BasicStep;

		return (
			<div className="guided-tours">
				<StepComponent
					{ ...stepConfig }
					key={ stepConfig.target }
					targetSlug={ stepConfig.target }
					onNext={ this.next }
					onQuit={ this.quit }
					onFinish={ this.finish } />
			</div>
		);
	}
}

export default connect( ( state ) => ( {
	selectedSite: getSelectedSite( state ),
	tourState: getGuidedTourState( state ),
} ), {
	nextGuidedTourStep,
	quitGuidedTour,
} )( GuidedTours );
