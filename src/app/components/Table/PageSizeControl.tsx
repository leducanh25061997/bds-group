import { Popover } from '@mui/material';
import React from 'react';
import classNames from 'classnames';
import pageSizePickerIcon from 'assets/table/page-size-picker.svg';
import styled from 'styled-components';

const RootContainer = styled.div`
  display: flex;
  align-items: center;
  color: #676a6c;
  font-size: 14px;
  line-height: 19px;
  margin-right: 40px;
  cursor: pointer;
  .row-per-page {
    margin-right: 8px;
  }
  img {
    cursor: pointer;
  }
`;

const DropItems = styled.div`
  background: #ffffff;
  box-shadow: 0px 10px 30px rgba(38, 51, 77, 0.15);
  border-radius: 15px;
  overflow: hidden;
  padding-block: 15px;
`;

const DropItem = styled.div`
  white-space: nowrap;
  cursor: pointer;
  height: 37px;
  display: flex;
  align-items: center;
  padding-inline: 16px;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  color: #223250;
  :hover {
    background: #f8f9fa;
  }
  &.active {
    background: #f8f9fa;
  }
`;

interface Props {
  page: number;
  pageSize: number;
  onPageSizeChange?: (size: number) => void;
  rowCount: number;
  rowsPerPageOptions: number[];
}

export default function PageSizeControl(props: Props) {
  const { pageSize, rowsPerPageOptions, onPageSizeChange } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'page-size-dropdown' : undefined;

  const handleChangePageSize = (size: number) => {
    onPageSizeChange && onPageSizeChange(size);
    handleClose();
  };

  return (
    <>
      <RootContainer aria-describedby={id} onClick={handleOpen}>
        <div className="row-per-page">Dòng trên trang: {pageSize}</div>
        <img src={pageSizePickerIcon} alt="icon size" />
      </RootContainer>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <DropItems>
          {rowsPerPageOptions.map(item => (
            <DropItem
              key={item}
              onClick={() => handleChangePageSize(item)}
              className={classNames({ active: item === pageSize })}
            >
              {item}
            </DropItem>
          ))}
        </DropItems>
      </Popover>
    </>
  );
}
