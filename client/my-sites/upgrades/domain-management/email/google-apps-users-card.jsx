/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import CompactCard from 'components/card/compact';
import Notice from 'components/notice';
import NoticeAction from 'components/notice/notice-action';
import paths from 'my-sites/upgrades/paths';
import support from 'lib/url/support';
import analyticsMixin from 'lib/mixins/analytics';
import SectionHeader from 'components/section-header';
import GoogleAppsUserItem from './google-apps-user-item';
import { getSelectedDomain } from 'lib/domains';

const learnMoreLink = <a href={ support.ADDING_GOOGLE_APPS_TO_YOUR_SITE } target="_blank" />,
	strong = <strong />;

const GoogleAppsUsers = React.createClass( {
	mixins: [ analyticsMixin( 'domainManagement', 'googleApps' ) ],

	propTypes: {
		domains: React.PropTypes.object.isRequired,
		googleAppsUsers: React.PropTypes.array.isRequired,
		selectedDomainName: React.PropTypes.string,
		selectedSite: React.PropTypes.oneOfType( [
			React.PropTypes.object,
			React.PropTypes.bool
		] ).isRequired,
		user: React.PropTypes.object.isRequired
	},

	canAddUsers() {
		const domainsInContext = this.props.selectedDomainName
			? [ getSelectedDomain( this.props ) ]
			: this.props.domains.list;
		return domainsInContext.some( domain =>
			domain.googleAppsSubscription.ownedByUserId === this.props.user.ID
		);
	},

	generateClickHandler( user ) {
		return () => {
			this.recordEvent( 'manageClick', this.props.selectedDomainName, user );
		};
	},

	goToAddGoogleApps() {
		this.recordEvent( 'addGoogleAppsUserClick', this.props.selectedDomainName );
	},

	getGoogleAppsUrl( domain ) {
		return `https://mail.google.com/a/${ domain }`;
	},

	pendingTosAcceptanceNotice() {
		const pendingAccounts = this.props.googleAppsUsers.filter( user => ! user.agreed_to_terms );

		switch( pendingAccounts.length ) {
			case 0:
				return null;

			case 1:
				return this.pendingAccountNotice( pendingAccounts[0] );

			default:
				return this.pendingAccountsNotice( pendingAccounts );
		}
	},

	pendingAccountNotice( { domain, email } ) {
		return (
			<Notice
				status="is-error"
				showDismiss={ false }
				key="pending-tos-acceptance-account"
				text={ this.translate( 'Log in to your {{strong}}%(email)s{{/strong}} Google Apps account to accept Google\'s Terms of Service or else it will get suspended soon. {{learnMoreLink}}Learn more{{/learnMoreLink}}.', { args: { email }, components: { learnMoreLink, strong } } ) }>
				<NoticeAction href={ this.getGoogleAppsUrl( domain ) } external>
					{ this.translate( 'Log in' ) }
				</NoticeAction>
			</Notice>
		);
	},

	pendingAccountsNotice( pendingAccounts ) {
		return (
			<Notice
				status="is-error"
				showDismiss={ false }
				key="pending-tos-acceptance-accounts">
				{ this.translate( 'You need to log in to the following Google Apps accounts and accept Google\'s Terms of Service or else those accounts will get suspended. {{learnMoreLink}}Learn more{{/learnMoreLink}}.', { components: { learnMoreLink } } ) }
				<ul>{
					pendingAccounts.map( ( { domain, email, mailbox } ) => {
						return <li key={ `${ mailbox }${ domain }` }>
							<strong>{ email }</strong> <a href={ this.getGoogleAppsUrl( domain ) } target="_blank">{ this.translate( 'Log in' ) }</a>
						</li>;
					} )
				}</ul>
			</Notice>
		);
	},

	render() {
		return (
			<div>
				{ this.pendingTosAcceptanceNotice() }

				<SectionHeader
					count={ this.props.googleAppsUsers.length }
					label={ this.translate( 'Google Apps Users' ) }>
					{ this.canAddUsers() && (
						<a
							href={ paths.domainManagementAddGoogleApps(
								this.props.selectedSite.slug, this.props.selectedDomainName
							) }
							className="button is-compact is-primary"
							onClick={ this.goToAddGoogleApps }>
							{ this.translate( 'Add Google Apps User' ) }
						</a>
					) }
				</SectionHeader>

				<CompactCard className="google-apps-users-card">
					<ul className="google-apps-users-card__user-list">
						{ this.props.googleAppsUsers.map(
							( user, index ) => (
								<GoogleAppsUserItem
									key={ index } user={ user }
									onClick={ this.generateClickHandler( user ) }/>
							)
						) }
					</ul>
				</CompactCard>
			</div>
		);
	}
} );

export default GoogleAppsUsers;
