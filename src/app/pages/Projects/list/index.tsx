import { Box, Grid, useTheme } from '@mui/material';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useFilter, useProfile } from 'app/hooks';
import path from 'app/routes/path';
import ADD_ICON from 'assets/background/plus-icon.svg';
import { translations } from 'locales/translations';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FilterParams } from 'types';
import { ProjectItem } from 'types/Project';
import { PermissionKeyEnum } from 'types/Permission';
import { checkPermissionExist } from 'utils/helpers';
import ChooseSaleEventDialog from 'app/pages/SaleEvent/components/ChooseSaleEventDialog';
import { PictureAsPdf } from '@mui/icons-material';
import { useSalesProgramSlice } from 'app/pages/SalesProgram/slice';
import { selectSalesProgram } from 'app/pages/SalesProgram/slice/selectors';

import CardProjectList from '../components/CardProjectList';
import ProjectSettingDialog from '../components/ProjectSettingDialog';
import { useProjectSlice } from '../slice';
import { selectProject } from '../slice/selector';

function MyProjectList() {
  const theme = useTheme();
  const { t } = useTranslation();
  const userInfo = useProfile();
  // const initialFilter = useMemo(() => {
  //   return {
  //     page: 1,
  //     limit: 20,
  //   };
  // }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [filterSelect, setFilterSelect] = useState<FilterParams>(initialFilter);
  const [textSearching, setTextSearching] = useState<string>('');
  const { actions } = useProjectSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { ProjectManagement, isLoading } = useSelector(selectProject);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [projectPick, setProjectPick] = useState<ProjectItem>();
  const [isOpenChooseSaleEventDialog, setIsOpenChooseSaleEventDialog] =
    useState<boolean>(false);
  const { actions: saleProgramActions } = useSalesProgramSlice();
  const [sortedData, setSortedData] = useState(ProjectManagement?.data || []);
  const urlParams = new URLSearchParams(window.location.search);

  const redirectToCreatePage = () => navigate(path.createProject);
  // const { filter, onFilterToQueryString } = useFilter({
  //   onFetchData: (params: FilterParams) => {
  //     fetchDataForPage(params);
  //   },
  //   defaultFilter: initialFilter,
  // });

  // const fetchDataForPage = (params: FilterParams) => {
  //   dispatch(actions.fetchListProject(params));
  // };

  // const submitFilter = () => {
  //   onFilterToQueryString({
  //     ...filterSelect,
  //     page: 1,
  //     search: textSearching,
  //   });
  // };

  useEffect(() => {
    if (projectPick?.id) {
      dispatch(
        saleProgramActions.fetchListSalesProgram({
          ...{ page: 1, limit: 100 },
          projectID: projectPick?.id,
        }),
      );
    }
  }, [projectPick?.id]);

  useEffect(() => {
    sortData(urlParams.get('sort')?.toString() || '');
  }, [ProjectManagement]);

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const handleSettingTable = (id: string) => {
    setIsOpenDialog(false);
    navigate(`/project/product-table-setting/${id}`);
  };

  const handleSettingProject = (id: string) => {
    setIsOpenDialog(false);
    navigate(`/project/project-setting/${id}`);
  };
  const hanldeManagerTransfer = (id: string) => {
    setIsOpenDialog(false);
    navigate(`/project/transaction-management/${id}`);
  };
  const hanldeManagerEsalekit = (item: ProjectItem) => {
    if (item?.esalekit) {
      navigate(`/esalekit/overview/${item?.esalekit.id}`);
    }
    setIsOpenDialog(false);
  };

  const hanldePreviewProject = (item: ProjectItem) => {
    setIsOpenDialog(false);
    if (item?.esalekit) {
      navigate(`/esalekit/preview/${item?.esalekit.id}`);
    }
  };

  const handleSaleEvent = (state: boolean) => () => {
    setIsOpenDialog(prev => !prev);
    setIsOpenChooseSaleEventDialog(state);
  };

  const hanldeEditProject = (id: any) => {
    setIsOpenDialog(false);
    navigate(`/project/${id}`);
  };

  const hanldeChooseProject = (item: ProjectItem) => {
    setIsOpenDialog(true);
    setProjectPick(item);
  };

  const sortData = (order: string) => {
    const sorted = [...(ProjectManagement?.data || [])].sort((a, b) => {
      const dateA: any = new Date(a.updatedAt);
      const dateB: any = new Date(b.updatedAt);

      if (order === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    setSortedData(sorted);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {sortedData?.map((item, index) => {
          return (
            <CardProjectList
              key={item.id}
              data={item}
              hanldeEditProject={hanldeEditProject}
              hanldeChooseProject={hanldeChooseProject}
            />
          );
        })}
      </Grid>
      <Box
        sx={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#D45B7A',
          position: 'fixed',
          right: '36px',
          bottom: '50px',
          justifyContent: 'center',
          alignItems: 'center',
          display: checkPermissionExist(
            PermissionKeyEnum.PROJECT_CREATE,
            userInfo,
          )
            ? 'flex'
            : 'none',
          zIndex: 1,
          cursor: 'pointer',
        }}
        onClick={redirectToCreatePage}
      >
        <img src={ADD_ICON} alt="add icon" />
      </Box>
      {isOpenDialog && (
        <ProjectSettingDialog
          data={projectPick}
          isOpen={isOpenDialog}
          handleClose={handleCloseDialog}
          hanldeSettingTable={handleSettingTable}
          handleSettingProject={handleSettingProject}
          hanldeManagerTransfer={hanldeManagerTransfer}
          hanldeManagerEsalekit={hanldeManagerEsalekit}
          hanldePreviewProject={hanldePreviewProject}
          hanldeSaleEvent={handleSaleEvent(true)}
          hanldeEditProject={hanldeEditProject}
          actionName={t(translations.common.unlock)}
        />
      )}
      {isOpenChooseSaleEventDialog && (
        <ChooseSaleEventDialog
          open={isOpenChooseSaleEventDialog}
          onClose={handleSaleEvent(false)}
          projectId={projectPick?.id}
        />
      )}
    </Box>
  );
}

export default React.memo(MyProjectList);
