import classNames from 'classnames';
import DropdownIcon from 'assets/icons/dropdown.svg';

interface Props {
  onClick: () => void;
  label: string;
  className?: {
    parent?: string;
    child?: string;
  };
  open: boolean;
  isUpper?: boolean;
}

export function CollapseTitle(props: Props) {
  const { label, onClick, className, open, isUpper } = props;
  return (
    <div className={classNames('flex', className?.parent)}>
      <p className={className?.child}>
        {isUpper ? label.toUpperCase() : label}
      </p>
      <img
        className={classNames('ml-4 cursor-pointer', {
          'transform rotate-[-90deg]': !open,
        })}
        src={DropdownIcon}
        alt="dropdown-icon"
        onClick={onClick}
      />
    </div>
  );
}
