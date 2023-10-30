import React, { useRef } from 'react';
import styled from 'styled-components';
import { Divider, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import palette from 'styles/theme/palette';
import SEARCH_ICON from 'assets/background/search-icon.svg';

const SearchContainer = styled.div`
  width: 40%;
  display: inline-flex;
  background: #fff;
  align-items: center;
  border-radius: 8px;
  padding: 0 16px;
  border: 1px solid #c6d7e0;
  height: 41px;
  .search-icon {
    margin-left: 16px;
  }
  input {
    font-size: 16px;
    padding-left: 16px;
    border: none;
    height: 100%;
    width: 100%;
    outline: none;
    border-radius: 8px;
  }
`;

const Title = styled.div`
  width: 120px;
`;

interface Props {
  onChangeSearchInput: (keyword: string) => void;
  placeholder: string;
}

function Search(props: Props) {
  const { onChangeSearchInput, placeholder } = props;
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();

  const handleChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    timeoutId.current && clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      onChangeSearchInput(e.target.value);
    }, 500);
  };

  return (
    <SearchContainer
      className="input"
      style={{
        height: '48px',
        width: '346px',
        borderRadius: '16px',
        padding: 0,
        paddingLeft: 10,
        marginRight: 10,
      }}
    >
      <input
        placeholder={placeholder}
        onChange={handleChangeSearchInput}
        style={{ padding: 10 }}
      />
      <Box
        sx={{
          background: palette.primary.button,
          cursor: 'pointer',
          display: 'flex',
          width: '56px',
          height: '46px',
          borderRadius: '16px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src={SEARCH_ICON} alt="icon table" />
      </Box>
    </SearchContainer>
  );
}

export default React.memo(Search);
