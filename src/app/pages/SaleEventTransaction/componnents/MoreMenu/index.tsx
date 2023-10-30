import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';

// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { PermissionKeyEnum } from 'types/Permission';
import { useProfile } from 'app/hooks';
import { checkPermissionExist } from 'utils/helpers';
interface Props {
  items: {
    name: string;
    link?: string;
    icon?: string;
    itemComponent: React.ElementType<any>;
    onClick?: any;
  }[];
}

export default function MoreMenu(props: Props) {
  const ref = useRef(null);
  const userInfo = useProfile();
  const [isOpen, setIsOpen] = useState(false);

  const items =
    props?.items?.filter(x => {
      let permission = '';
      switch (x.name) {
        case 'Chuyển sản phẩm':
          permission = PermissionKeyEnum.EVENT_SALES_FORWARD_PRODUCT;
          break;
        case 'Thu hồi sản phẩm':
          permission = PermissionKeyEnum.EVENT_SALES_REGAIN_PRODUCT;
          break;
      }
      if (permission) return checkPermissionExist(permission, userInfo);
      return true;
    }) || [];

  return (
    <div onClick={e => e.stopPropagation()}>
      <IconButton
        ref={ref}
        disabled={items.length === 0}
        onClick={e => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <Icon icon="mdi:dots-vertical" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 150, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {items?.map(item => (
          <MenuItem
            key={item.name}
            component={item.itemComponent}
            to={item?.link}
            sx={{
              color: '#000',
              width: '100%',
              '&:hover': { background: '#FDEAF4' },
            }}
            onClick={
              item?.onClick
                ? item.onClick
                : () => {
                    return 0;
                  }
            }
          >
            {item.icon && (
              <ListItemIcon>
                <Icon icon={item.icon} width={24} height={24} />
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
