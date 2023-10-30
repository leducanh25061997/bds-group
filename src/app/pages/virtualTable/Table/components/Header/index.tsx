import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { selectVirtualTable } from '../../../slice/selectors';
import { EventSaleStatus } from '../../../components/EventSaleStatus';
import { Search } from '../../../components/Search';
import Button from 'app/components/Button';
import { useNavigate, Link } from 'react-router-dom';
import path from 'app/routes/path';

export const Header = () => {
  const { virtualDataTable } = useSelector(selectVirtualTable);
  const params = useParams();
  const { id, projectId } = params;
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        {virtualDataTable?.infProject.settingSalesProgram.name}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <EventSaleStatus />
        <Search />
        <Link
          to={`${path.saleEvent}/project/${projectId}/transaction/${id}/virtual/view`}
          target="_blank"
        >
        <Button
          title="View"
          isIcon
          buttonMode="view"
          // handleClick={() => navigate(`${path.saleEvent}/project/${projectId}/transaction/${id}/virtual/view`)}
          sxProps={{
            borderRadius: '8px',
            height: { xs: '44px' },
          }}
          sxPropsText={{ fontSize: '14px', fontWeight: 700 }}
        />
        </Link>
      </Box>
    </Box>
  );
};
