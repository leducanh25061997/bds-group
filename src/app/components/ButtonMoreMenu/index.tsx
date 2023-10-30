import { useRef, useState } from 'react';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemText,
  useTheme,
} from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
interface ButtonAction {
  name: string;
  link?: string;
  icon?: string;
  iconDisable?: string;
  itemComponent: React.ElementType<any>;
  onClick?: any;
  disabled?: boolean;
}
interface Props {
  items: ButtonAction[];
  width?: number | string;
}

export default function ButtonMoreMenu(props: Props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const handleClickItem = (item: ButtonAction) => () => {
    if (!item.disabled) {
      item.onClick?.();
      setIsOpen(false);
    }
  };

  return (
    <div onClick={e => e.stopPropagation()}>
      <IconButton
        ref={ref}
        sx={{ padding: '8px 0' }}
        onClick={e => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <MoreVertIcon sx={{ color: theme.palette.common.black }} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 'max-content', maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {props?.items?.map(item => (
          <MenuItem
            key={item.name}
            component={item.itemComponent}
            to={item?.link}
            sx={{
              color: item.disabled ? theme.palette.grey[100] : 'text.secondary',
              width: '100%',
              textAlign: 'left',
            }}
            onClick={handleClickItem(item)}
          >
            {item?.icon && (
              <img
                alt="Icon"
                src={item.disabled ? item.iconDisable : item.icon}
              />
            )}
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
              sx={{
                ml: 2,
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
