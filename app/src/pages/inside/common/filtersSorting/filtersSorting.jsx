import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { InputDropdownSorting } from 'components/inputs/inputDropdownSorting';
import {
  STATS_SKIPPED,
  STATS_FAILED,
  STATS_PASSED,
  STATS_TOTAL,
  STATS_AB_TOTAL,
  STATS_PB_TOTAL,
  STATS_SI_TOTAL,
  STATS_TI_TOTAL,
} from 'common/constants/statistics';
import { SORTING_ASC } from 'controllers/sorting';
import { ENTITY_START_TIME, ENTITY_NAME, ENTITY_NUMBER } from 'components/filterEntities/constants';
import styles from './filtersSorting.scss';

const cx = classNames.bind(styles);
const messages = defineMessages({
  sortBy: {
    id: 'FilterSort.sortBy',
    defaultMessage: 'Sort by',
  },
  [ENTITY_NAME]: {
    id: 'FilterSort.launchName',
    defaultMessage: 'Launch name',
  },
  [ENTITY_START_TIME]: {
    id: 'FilterSort.startTime',
    defaultMessage: 'Start time',
  },
  [STATS_TOTAL]: {
    id: 'FilterSort.total',
    defaultMessage: 'Total',
  },
  [STATS_PASSED]: {
    id: 'FilterSort.passed',
    defaultMessage: 'Passed',
  },
  [STATS_FAILED]: {
    id: 'FilterSort.failed',
    defaultMessage: 'Failed',
  },
  [STATS_SKIPPED]: {
    id: 'FilterSort.skipped',
    defaultMessage: 'Skipped',
  },
  [STATS_PB_TOTAL]: {
    id: 'FilterSort.productBug',
    defaultMessage: 'Product Bug',
  },
  [STATS_AB_TOTAL]: {
    id: 'FilterSort.autoBug',
    defaultMessage: 'Auto Bug',
  },
  [STATS_SI_TOTAL]: {
    id: 'FilterSort.systemIssue',
    defaultMessage: 'System Issue',
  },
  [STATS_TI_TOTAL]: {
    id: 'FilterSort.toInvestigate',
    defaultMessage: 'To Investigate',
  },
});
const options = [
  ENTITY_NAME,
  ENTITY_START_TIME,
  STATS_TOTAL,
  STATS_PASSED,
  STATS_FAILED,
  STATS_SKIPPED,
  STATS_PB_TOTAL,
  STATS_AB_TOTAL,
  STATS_SI_TOTAL,
  STATS_TI_TOTAL,
];

@injectIntl
export class FiltersSorting extends Component {
  static propTypes = {
    intl: intlShape,
    filter: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    sortingString: PropTypes.string,
  };

  static defaultProps = {
    intl: {},
    sortingString: '',
  };

  getFilterOptions = () => {
    const { intl } = this.props;

    return options.reduce((result, option) => {
      result.push({
        value: option,
        label: intl.formatMessage(messages[option]),
      });

      return result;
    }, []);
  };

  getFilterOrder = () => {
    const { filter, sortingString } = this.props;

    if (sortingString) {
      const parsed = sortingString.split(',');
      return { sortingColumn: parsed[0], isAsc: parsed[1] === SORTING_ASC };
    }

    let defaultValue = {
      isAsc: false,
      sortingColumn: ENTITY_START_TIME,
    };

    if (filter.orders) {
      const nonDefaultOrders = filter.orders.filter(
        (order) => order.sortingColumn !== ENTITY_NUMBER,
      );
      defaultValue = nonDefaultOrders.length ? nonDefaultOrders[0] : defaultValue;
    }
    return defaultValue;
  };

  render() {
    const { intl, sortingString, onChange } = this.props;
    const order = this.getFilterOrder();
    const prefix = sortingString ? 'launches' : 'filter';

    return (
      <div className={cx('sort', `${prefix}-sort`)}>
        <span className={cx(`${prefix}-sort-text`)}>{intl.formatMessage(messages.sortBy)}:</span>
        <InputDropdownSorting
          value={order.sortingColumn}
          sortingMode={order.isAsc}
          options={this.getFilterOptions()}
          onChange={onChange}
          transparent={Boolean(sortingString)}
        />
      </div>
    );
  }
}
