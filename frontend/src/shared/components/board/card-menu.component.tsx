import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { colors } from '@/shared/styles';

interface CardMenuProps {
  cardId: string;
  onView?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export const CardMenu: React.FC<CardMenuProps> = ({
  cardId,
  onView,
  onUpdate,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (handler?: () => void) => {
    if (handler) handler();
    handleClose();
  };

  return (
    <div className="absolute top-2 right-2 z-10">
      <IconButton
        data-testid={`card-menu-${cardId}`}
        onClick={handleClick}
        size="small"
        sx={{ padding: '4px', color: '#3d3d3d' }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: colors.d_gray,
              color: colors.l_sakura,
              '& .MuiMenuItem-root': {
                '&:hover': {
                  backgroundColor: colors.gray,
                },
              },
            },
          },
        }}
      >
        {onView && (
          <MenuItem
            onClick={() => handleMenuClick(onView)}
            data-testid={`card-menu-view-${cardId}`}
          >
            View
          </MenuItem>
        )}
        {onUpdate && (
          <MenuItem
            onClick={() => handleMenuClick(onUpdate)}
            data-testid={`card-menu-update-${cardId}`}
          >
            Update
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem
            onClick={() => handleMenuClick(onDelete)}
            data-testid={`card-menu-delete-${cardId}`}
          >
            Delete
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};
