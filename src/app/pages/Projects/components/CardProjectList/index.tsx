import { Box, Grid, Stack, Typography } from '@mui/material';
import { useProfile } from 'app/hooks';
import EDIT_ICON from 'assets/background/edit-project-icon.svg';
import LOCATION_ICON from 'assets/background/location-icon.svg';
import HANDED_OVER_ICON from 'assets/icons/project-done-icon.svg';
import HANDING_OVER_ICON from 'assets/icons/project-handingover-icon.svg';
import ON_SALE_ICON from 'assets/icons/project-processing-icon.svg';
import ABOUT_TO_SALE_ICON from 'assets/icons/project-waiting-icon.svg';
import { useNavigate } from 'react-router-dom';
import palette from 'styles/theme/palette';
import { PermissionKeyEnum } from 'types/Permission';
import { ProjectItem, ProjectStatusEnum } from 'types/Project';
import {
  RenderClassicProduct,
  checkPermissionExist,
  renderFile,
} from 'utils/helpers';
interface Props {
  data: ProjectItem;
  hanldeEditProject: (id: any) => void;
  hanldeChooseProject: (item: ProjectItem) => void;
}

export default function CardProjectList(props: Props) {
  const { data, hanldeChooseProject, hanldeEditProject } = props;
  const navigate = useNavigate();
  const userInfo = useProfile();
  const renderStatus = (status: ProjectStatusEnum) => {
    let img = HANDING_OVER_ICON;
    switch (status) {
      case ProjectStatusEnum.ABOUT_TO_SALE:
        img = ABOUT_TO_SALE_ICON;
        break;
      case ProjectStatusEnum.HANDED_OVER:
        img = HANDED_OVER_ICON;
        break;
      case ProjectStatusEnum.ON_SALE:
        img = ON_SALE_ICON;
        break;
      case ProjectStatusEnum.HANDING_OVER:
        img = HANDING_OVER_ICON;
        break;
      default:
        break;
    }
    return <img src={img} style={{ position: 'absolute' }} />;
  };

  return (
    <Grid item xs={6} sm={4} md={3} xl={2.4}>
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          cursor: 'pointer',
        }}
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault()
          hanldeChooseProject(data);
        }}
      >
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'inherit',
          }}
        >
          <Box
            component={'img'}
            src={renderFile(data?.image?.path)}
            sx={{
              aspectRatio: '4/3',
              width: '100%',
              objectFit: 'cover',
              height: '200px',
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
            }}
          >
            {renderStatus(data.status)}
            {checkPermissionExist(
              PermissionKeyEnum.PROJECT_UPDATE,
              userInfo,
            ) && (
              <Box
                sx={{
                  width: '32px',
                  height: '32px',
                  background: 'white',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  right: 0,
                  m: '4px',
                  boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 5px',
                  ':hover': { background: '#dddddd' },
                }}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.stopPropagation()
                  hanldeEditProject(data.id)
                }}
              >
                <img
                  src={EDIT_ICON}
                  alt="edit-icon"
                  height={16}
                  width={16}
                />
              </Box>
            )}
          </Box>
        </Box>
        <Box
          p={1}
          sx={{
            flex: '1',
          }}
        >
          <Box
            p={'3px 9px'}
            sx={{
              background: '#CCE4FF',
              borderRadius: '30px',
              display: data?.classification ? 'inline-flex' : 'none',
              mb: '6px',
            }}
          >
            <Typography color={'#0042C1'} fontSize={'10px'}>
              {RenderClassicProduct(data.classification)}
            </Typography>
          </Box>
          <Typography
            fontWeight={700}
            fontSize={'14px'}
            color={palette.common.black}
          >
            {data.name}
          </Typography>
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              mt: '3px',
            }}
          >
            <img
              src={LOCATION_ICON}
              alt="icon location"
              style={{
                marginTop: '2.5px',
              }}
            />
            <Typography
              fontSize={'12px'}
              color={palette.common.black}
              ml={'5px'}
              sx={{
                WebkitLineClamp: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'break-spaces',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
              }}
            >
              {data.address}
              {data.address && ', '}
              {data.ward}
              {data.ward && ', '}
              {data.district}
              {data.district && ', '}
              {data.province}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Grid>
  );
}
