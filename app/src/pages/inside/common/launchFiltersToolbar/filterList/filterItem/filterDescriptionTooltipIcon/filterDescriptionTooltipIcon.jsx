import classNames from 'classnames/bind';
import Parser from 'html-react-parser';
import { ALIGN_LEFT } from 'components/main/tooltips/constants';
import { withTooltip } from 'components/main/tooltips/tooltip';
import { TextTooltip } from 'components/main/tooltips/textTooltip';
import TooltipIcon from 'common/img/tooltip-icon-inline.svg';
import styles from './filterDescriptionTooltipIcon.scss';

const cx = classNames.bind(styles);

export const FilterDescriptionTooltipIcon = withTooltip({
  TooltipComponent: TextTooltip,
  data: {
    align: ALIGN_LEFT,
    leftOffset: -50,
    noArrow: true,
    dynamicWidth: true,
  },
})(() => <div className={cx('filter-tooltip-icon')}>{Parser(TooltipIcon)}</div>);
