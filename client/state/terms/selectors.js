/**
 * External dependencies
 */
import get from 'lodash/get';
import values from 'lodash/values';

/**
 * Internal dependencies
 */
import TreeConvert from 'lib/tree-convert';
import createSelector from 'lib/create-selector';
import {
	getSerializedTermsQuery
} from './utils';

/**
 * Memoized selector returns an array of terms for the taxonomies query
 * or null if no terms have been received.
 *
 * @param  {Object}  state           Global state tree
 * @param  {Number}  siteId          Site ID
 * @param  {String}  taxonomy        Taxonomy slug
 * @param  {String}  serializedQuery Post query object
 * @return {?Array}                  Posts for the post query
 */
const getTermsForSerializedQuery = createSelector(
	( state, siteId, taxonomy, serializedQuery ) => {
		const queryResults = get( state.terms.queries, [ siteId, taxonomy, serializedQuery ] );
		if ( ! queryResults ) {
			return null;
		}

		return queryResults.reduce( ( memo, termId ) => {
			const term = get( state.terms, [ 'items', siteId, taxonomy, termId ] );
			if ( term ) {
				memo.push( term );
			}

			return memo;
		}, [] );
	},
	( state ) => [ state.terms.items ]
);

/**
 * Returns an array of terms for the taxonomy query, including all known queried
 * terms, preserving hierarchy. Returns null if no terms have been received.
 * Hierarchy is represented by `parent` and `items` properties on each post.
 *
 * @param  {Object} state           Global state tree
 * @param  {Number} siteId          Site ID
 * @param  {String} taxonomy        Taxonomy slug
 * @param  {Object} serializedQuery Post query object
 * @return {?Array}                 Hierarchical terms for the taxonomy query
 */
const getTermsHierarchyForQuery = createSelector(
	( state, siteId, taxonomy, serializedQuery ) => {

	},
	( state ) => [ state.terms.items ]
);

/**
 * Returns true if currently requesting terms for the taxonomies query, or false
 * otherwise.
 *
 * @param  {Object}  state  Global state tree
 * @param  {Number}  siteId Site ID
 * @param  {String}  taxonomy Taxonomy slug
 * @param  {Object}  query  Taxonomy query object
 * @return {Boolean}        Whether terms are being requested
 */
export function isRequestingTermsForQuery( state, siteId, taxonomy, query ) {
	const serializedQuery = getSerializedTermsQuery( query );
	return !! get( state.terms.queryRequests, [ siteId, taxonomy, serializedQuery ] );
}

/**
 * Returns an array of terms for the taxonomies query, or null if no terms have been
 * received.
 *
 * @param  {Object}  state    Global state tree
 * @param  {Number}  siteId   Site ID
 * @param  {String}  taxonomy Taxonomy slug
 * @param  {Object}  query    Post query object
 * @return {?Array}           Posts for the post query
 */
export function getTermsForQuery( state, siteId, taxonomy, query ) {
	const serializedQuery = getSerializedTermsQuery( query );
	return getTermsForSerializedQuery( state, siteId, taxonomy, serializedQuery );
}

/**
 * Returns terms for a site, filtered by taxonomy.
 *
 * @param  {Object} state    Global state tree
 * @param  {Number} siteId   Site ID
 * @param  {String} taxonomy Taxonomy slug
 * @return {Array}           Terms
 */
export function getTerms( state, siteId, taxonomy ) {
	const terms = get( state.terms, [ 'items', siteId, taxonomy ] );

	if ( ! terms ) {
		return null;
	}

	return values( terms );
}
