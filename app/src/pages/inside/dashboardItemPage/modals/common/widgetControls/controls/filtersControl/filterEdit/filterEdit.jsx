import React, { Component } from 'react';
import PropTypes from 'prop-types';
import track from 'react-tracking';
import classNames from 'classnames/bind';
import { DASHBOARD_PAGE_EVENTS } from 'components/main/analytics/events';
import { InputRadio } from 'components/inputs/inputRadio';
import { messages } from '../common/messages';
import { AddEditFilter } from '../common/addEditFilter';
import styles from './filterEdit.scss';

const cx = classNames.bind(styles);

@track()
export class FilterEdit extends Component {
  static propTypes = {
    filter: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
    eventsInfo: PropTypes.object,
  };

  static defaultProps = {
    onSave: () => {},
    onCancel: () => {},
    onChange: () => {},
    eventsInfo: {},
  };

  onFilterSave = () => {
    this.props.tracking.trackEvent(DASHBOARD_PAGE_EVENTS.SUBMIT_EDIT_FILTER_EDIT_WIDGET_MODAL);
    this.props.onSave(this.props.filter);
  };

  onFilterCancel = () => {
    this.props.tracking.trackEvent(DASHBOARD_PAGE_EVENTS.CANCEL_BTN_EDIT_FILTER_ADD_WIDGET_MODAL);
    this.props.onCancel(this.props.filter);
  };

  onFilterChange = (data) => {
    this.props.onChange(data);
  };

  getCustomBlock = (filter) => (
    <div className={cx('filter-edit-header')}>
      <InputRadio value={filter.id} ownValue={filter.id} name="filter-item" circleAtTop>
        {filter.name}
      </InputRadio>
    </div>
  );

  render() {
    const { filter, eventsInfo } = this.props;

    return (
      <AddEditFilter
        filter={filter}
        onCancel={this.onFilterCancel}
        onSubmit={this.onFilterSave}
        onChange={this.onFilterChange}
        customBlock={this.getCustomBlock(filter)}
        blockTitle={messages.editTitle}
        eventsInfo={eventsInfo}
      />
    );
  }
}
