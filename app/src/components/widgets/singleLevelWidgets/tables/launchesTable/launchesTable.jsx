import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  STATS_TOTAL,
  STATS_SKIPPED,
  STATS_PASSED,
  STATS_FAILED,
} from 'common/constants/statistics';
import {
  PRODUCT_BUG,
  TO_INVESTIGATE,
  AUTOMATION_BUG,
  SYSTEM_ISSUE,
} from 'common/constants/defectTypes';
import { ALL } from 'common/constants/reservedFilterIds';
import { activeProjectSelector } from 'controllers/user';
import { TEST_ITEM_PAGE, LAUNCHES_PAGE } from 'controllers/pages';
import { createFilterAction } from 'controllers/filter';
import { Grid } from 'components/main/grid';
import { AbsRelTime } from 'components/main/absRelTime';
import {
  ENTITY_ATTRIBUTE_KEYS,
  ENTITY_ATTRIBUTE_VALUES,
  CONDITION_HAS,
  CONDITION_IN,
  ENTITY_USER,
} from 'components/filterEntities/constants';
import { ItemInfo } from 'pages/inside/common/itemInfo';
import { ExecutionStatistics } from 'pages/inside/common/launchSuiteGrid/executionStatistics';
import { DefectStatistics } from 'pages/inside/common/launchSuiteGrid/defectStatistics';
import { StatisticsLink } from 'pages/inside/common/statisticsLink';
import { DefectLink } from 'pages/inside/common/defectLink';
import { formatStatus } from 'common/utils/localizationUtils';
import { ScrollWrapper } from 'components/main/scrollWrapper';
import { getItemNameConfig } from 'components/widgets/common/utils';
import { defaultDefectsMessages, defaultStatisticsMessages } from '../components/messages';
import { getStatisticsStatuses, groupFieldsWithDefectTypes } from '../components/utils';
import {
  START_TIME,
  NAME,
  END_TIME,
  STATUS,
  TIME_COLUMN_KEY,
  DEFECT_COLUMN_KEY,
  STATISTICS_COLUMN_KEY,
  STATUS_COLUMN_KEY,
  NAME_COLUMN_KEY,
} from './constants';
import { COLUMN_NAMES_MAP, hintMessages } from './messages';
import styles from './launchesTable.scss';

const cx = classNames.bind(styles);

const NameColumn = (
  { className, value },
  name,
  { linkPayload, onOwnerClick, onClickAttribute },
) => {
  const { values, attributes } = value;
  const itemPropValue = {
    id: value.id,
    name: value.name,
    owner: values.user,
    number: value.number,
    description: values.description,
    attributes: attributes || null,
  };
  const ownLinkParams = {
    page: TEST_ITEM_PAGE,
    payload: linkPayload,
  };

  return (
    <div className={cx('name-col', className)}>
      <ItemInfo
        customProps={{ ownLinkParams, onOwnerClick, onClickAttribute }}
        value={itemPropValue}
        hideEdit
      />
    </div>
  );
};
NameColumn.propTypes = {
  value: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
};

const StatusColumn = ({ className, value: { values } }, name, { formatMessage }) => (
  <div className={cx('status-col', className)}>
    <span className={cx('mobile-hint')}>{formatMessage(hintMessages.statusHint)}</span>
    {formatStatus(formatMessage, values.status)}
  </div>
);
StatusColumn.propTypes = {
  value: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
};

const TimeColumn = ({ className, value }, name, { formatMessage }) => (
  <div className={cx('time-col', className)}>
    <span className={cx('mobile-hint')}>
      {formatMessage(name === START_TIME ? hintMessages.startTimeHint : hintMessages.endTimeHint)}
    </span>
    <AbsRelTime
      startTime={new Date(name === START_TIME ? value.startTime : value.values.endTime).getTime()}
    />
  </div>
);
TimeColumn.propTypes = {
  value: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
};

const StatisticsColumn = ({ className, value }, name, { linkPayload }) => {
  const defaultColumnProps = {
    itemId: Number(value.id),
    statuses: getStatisticsStatuses(name),
    ownLinkParams: {
      page: TEST_ITEM_PAGE,
      payload: linkPayload,
    },
  };
  const itemValue = Number(value.values[name]);
  return (
    <div className={cx('statistics-col', className)}>
      <div className={cx('desktop-block')}>
        <ExecutionStatistics value={itemValue} {...defaultColumnProps} />
      </div>
      <div className={cx('mobile-block', `statistics-${name.split('$')[2]}`)}>
        <div className={cx('block-content')}>
          {!!itemValue && (
            <StatisticsLink className={cx('value')} {...defaultColumnProps}>
              {Number(value.values[name])}
            </StatisticsLink>
          )}
          <span className={cx('message')}>{defaultStatisticsMessages[name]}</span>
        </div>
      </div>
    </div>
  );
};
StatisticsColumn.propTypes = {
  value: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
};

const DefectsColumn = ({ className, value }, name, { linkPayload }, fieldKeys) => {
  const defaultColumnProps = {
    itemId: Number(value.id),
    ownLinkParams: {
      page: TEST_ITEM_PAGE,
      payload: linkPayload,
    },
  };
  let total = 0;
  const data = fieldKeys.reduce((acc, item) => {
    const itemValue = value.values[item];
    if (!itemValue) {
      return acc;
    }
    const { locator } = getItemNameConfig(item);
    total += parseInt(itemValue, 10);

    return { ...acc, [locator]: itemValue };
  }, {});
  data.total = total;

  return (
    <div className={cx('defect-col', className)}>
      <div className={cx('desktop-block')}>
        <DefectStatistics type={name} data={data} {...defaultColumnProps} />
      </div>
      <div className={cx('mobile-block', `defect-${name}`)}>
        <div className={cx('block-content')}>
          {!!total && (
            <DefectLink {...defaultColumnProps} defects={Object.keys(data)}>
              {total}
            </DefectLink>
          )}
          <span className={cx('message')}>{defaultDefectsMessages[name]}</span>
        </div>
      </div>
    </div>
  );
};
DefectsColumn.propTypes = {
  value: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
};

const columnComponentsMap = {
  [STATISTICS_COLUMN_KEY]: StatisticsColumn,
  [DEFECT_COLUMN_KEY]: DefectsColumn,
  [TIME_COLUMN_KEY]: TimeColumn,
  [NAME_COLUMN_KEY]: NameColumn,
  [STATUS_COLUMN_KEY]: StatusColumn,
};

const COLUMNS_KEYS_MAP = {
  [NAME]: NAME_COLUMN_KEY,
  [STATUS]: STATUS_COLUMN_KEY,
  [START_TIME]: TIME_COLUMN_KEY,
  [END_TIME]: TIME_COLUMN_KEY,
  [STATS_TOTAL]: STATISTICS_COLUMN_KEY,
  [STATS_PASSED]: STATISTICS_COLUMN_KEY,
  [STATS_FAILED]: STATISTICS_COLUMN_KEY,
  [STATS_SKIPPED]: STATISTICS_COLUMN_KEY,
  [PRODUCT_BUG]: DEFECT_COLUMN_KEY,
  [AUTOMATION_BUG]: DEFECT_COLUMN_KEY,
  [SYSTEM_ISSUE]: DEFECT_COLUMN_KEY,
  [TO_INVESTIGATE]: DEFECT_COLUMN_KEY,
};

const getColumn = (name, customProps, fieldKeys) => ({
  id: name,
  title: COLUMN_NAMES_MAP[name],
  component: (data) =>
    columnComponentsMap[COLUMNS_KEYS_MAP[name]](data, name, customProps, fieldKeys),
});

@connect(
  (state) => ({
    projectId: activeProjectSelector(state),
  }),
  {
    createFilterAction,
  },
)
@injectIntl
export class LaunchesTable extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    widget: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    createFilterAction: PropTypes.func.isRequired,
  };

  getColumns = () => {
    const {
      intl: { formatMessage },
      widget: { contentParameters },
      projectId,
    } = this.props;
    const fieldsMap = groupFieldsWithDefectTypes(contentParameters.contentFields);
    const customProps = {
      formatMessage,
      linkPayload: {
        projectId,
        filterId: ALL,
      },
      onOwnerClick: this.handleOwnerFilterClick,
      onClickAttribute: this.handleAttributeFilterClick,
    };

    return Object.keys(COLUMNS_KEYS_MAP).reduce(
      (columns, item) =>
        fieldsMap[item] ? [...columns, getColumn(item, customProps, fieldsMap[item])] : columns,
      [],
    );
  };

  handleAttributeFilterClick = (attribute) => {
    const filter = {
      type: LAUNCHES_PAGE,
      conditions: [
        {
          condition: CONDITION_HAS,
          filteringField: ENTITY_ATTRIBUTE_KEYS,
          value: attribute.key || '',
        },
        {
          condition: CONDITION_HAS,
          filteringField: ENTITY_ATTRIBUTE_VALUES,
          value: attribute.value || '',
        },
      ],
    };

    this.props.createFilterAction(filter);
  };

  handleOwnerFilterClick = (owner) => {
    const filter = {
      type: LAUNCHES_PAGE,
      conditions: [
        {
          condition: CONDITION_IN,
          filteringField: ENTITY_USER,
          value: owner || '',
        },
      ],
    };

    this.props.createFilterAction(filter);
  };

  render() {
    const { result } = this.props.widget.content;
    const columns = this.getColumns();

    return (
      <ScrollWrapper hideTracksWhenNotNeeded>
        <Grid columns={columns} data={result} />
      </ScrollWrapper>
    );
  }
}
