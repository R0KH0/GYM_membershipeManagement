export const MemberStatus = {
    Active: 'active',
    Pending: 'pending',
    Frozen: 'frozen',
    Cancelled: 'cancelled',
};

// You can use JSDoc comments for type documentation if needed:

/**
 * @typedef {Object} Member
 * @property {number} id
 * @property {string} name
 * @property {string} phone
 * @property {string} date
 * @property {string} createdBy
 * @property {string} status
 */

/**
 * @typedef {Object} EarningMember
 * @property {number} id
 * @property {string} name
 * @property {string} type
 * @property {number} price
 */

/**
 * @typedef {Object} ChartData
 * @property {string} name
 * @property {number} value
 */