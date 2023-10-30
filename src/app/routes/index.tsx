import { useRoutes, Navigate } from 'react-router-dom';

import LogoOnlyLayout from 'app/pages/Layouts/LogoOnlyLayout';
import DashboardLayout from 'app/pages/Layouts/DashboardLayout';
import Auth from 'app/pages/Auth';
import NotFound from 'app/pages/NotFound';
import { isAuthenticated } from 'utils/auth';
import { useLocation } from 'react-router';
import { Dashboard } from 'app/pages/Dashboard/Loadable';
import { Comisstion } from 'app/pages/Comisstion/Loadable';
import { Customer } from 'app/pages/CustomerPotential/Loadable';
import { Settings } from 'app/pages/Settings/Loadable';
import { Esalekit } from 'app/pages/Esalekit/Loadable';
import { Staff } from 'app/pages/Staff/Loadable';
import { Carrers } from 'app/pages/Carrers/Loadable';
import { Orgchart } from 'app/pages/Orgchart/Loadable';
import { Leads } from 'app/pages/Leads/Loadable';
import { TakeCareLeads } from 'app/pages/Leads/component/TakeCare/Loadable';
import CreateContract from 'app/pages/Settings/create';
import CreateComisstion from 'app/pages/Comisstion/create';
import UploadComisstion from 'app/pages/Comisstion/upload';
import CreateCustomer from 'app/pages/CustomerPotential/create';
import Overview from 'app/pages/Esalekit/Overview';
import PreviewEsalekit from 'app/pages/Esalekit/PreviewEsalekit';
import CreateStaff from 'app/pages/Staff/create';
import CreateRealEstate from 'app/pages/Carrers/create';
import CreateOrgchart from 'app/pages/Orgchart/create';
import EditComisstion from 'app/pages/Comisstion/edit';
import EditCustomer from 'app/pages/CustomerPotential/edit';
import EditStaff from 'app/pages/Staff/edit';
import EditContract from 'app/pages/Settings/edit';
import EditOrgchart from 'app/pages/Orgchart/edit';
import EditRealEstate from 'app/pages/Carrers/edit';
import { CreateProject } from 'app/pages/Projects/create';
import { CreatePermission } from 'app/pages/Settings/permission/create';
import { RealEstateDetail } from 'app/pages/Carrers/detail/Loadable';
import { OrgchartDetail } from 'app/pages/Orgchart/detail/Loadable';
import { ComisstionRequest } from 'app/pages/ComisstionRequest/Loadable';
import FinanceStaff from 'app/pages/Leads/leads';
import { Reports } from 'app/pages/Reports';
import CreatCategory from 'app/pages/Reports/create';
import EditCatgory from 'app/pages/Reports/edit';
import DetailCategory from 'app/pages/Reports/detail';
import RegisterForm from 'app/pages/CityStar/components/RegisterForm';
import Membership from 'app/pages/CityStar/components/Membership';
import RegisterActive from 'app/pages/CityStar/components/RegisterActive';

import { CustomerTransaction } from 'app/pages/CustomerTransaction';
import { LogImportCustomer } from 'app/pages/LogImportCustomer';
import { ComisstionPolicy } from 'app/pages/ComisstionPolicy/Loadable';
import CreateComisstionRule from 'app/pages/ComisstionPolicy/create';
import { Project } from 'app/pages/Projects/Loadable';
import { KPIMission } from 'app/pages/KPIMission';
import EditComisstionPolicy from 'app/pages/ComisstionPolicy/edit';
import { PermissionCreate } from 'app/pages/Settings/permission';
import EditProject from 'app/pages/Projects/edit';
import { ProductTableSetting } from 'app/pages/ProductTableSetting/Loadable';

import { MembershipCard } from 'app/pages/MembershipCard/Loadable';
import { CityStar } from 'app/pages/CityStar/Loadable';

import { TransactionManagement } from 'app/pages/TransactionManagement';
import EsalekitLayout from 'app/pages/Layouts/EsalekitLayout';
import PreviewEsalekitLayout from 'app/pages/Layouts/PreviewEsalekitLayout';
import CityStarLayout from 'app/pages/Layouts/CityStarLayout';
import { ProjectSetting } from 'app/pages/ProjectSetting';
import { CreateReservation } from 'app/pages/TransactionManagement/components/reservationManagement/create';
import EditReservation from 'app/pages/TransactionManagement/components/reservationManagement/edit';

import { ProcessManagement } from 'app/pages/ProcessManagement';
import CreateProcess from 'app/pages/ProcessManagement/create';
import CopyReservation from 'app/pages/TransactionManagement/components/reservationManagement/copyReservation';
import EditProcess from 'app/pages/ProcessManagement/edit';
import { ReceiptsPage } from 'app/pages/Payment/Receipts';

import CopyProcess from 'app/pages/ProcessManagement/copy';
import CreateSalesProgram from 'app/pages/SalesProgram/create';
import EditSalesProgram from 'app/pages/SalesProgram/edit';
import { CreateKpiMission } from 'app/pages/KPIMission/components/create';
import { EditKpiMission } from 'app/pages/KPIMission/components/edit';
import ListMision from 'app/pages/KPIMission/components/list';
import { RefundsPage } from 'app/pages/Payment/Refunds';

import SaleEventLayout from 'app/pages/Layouts/SaleEventLayout';
import { SaleEventControl } from 'app/pages/SaleEventControl/Loadable';
import { SaleEventTransaction } from 'app/pages/SaleEventTransaction/Loadable';
import { ContentManagement } from 'app/pages/ContentManagement/Loadable';
import { Profile } from 'app/pages/ProfileManagerment';
import ProfileLayout from 'app/pages/Layouts/ProfileLayout';
import GroundEsalekitMobile from 'app/pages/Esalekit/GroundEsalekitMobile';
import { TermConditions } from 'app/pages/TermConditions/Loadable';

import { VirtualTable } from 'app/pages/virtualTable/Table/Loadable';
import { VirtualView } from 'app/pages/virtualTable/View/Loadable';
import WebViewIntroduce from 'app/pages/WebView/webViewIntroduce';
import WebViewPolicy from 'app/pages/WebView/webViewPolicy';
import WebViewProvise from 'app/pages/WebView/webViewProvise';

import path from './path';

export default function Router() {
  const location = useLocation();
  return useRoutes([
    {
      path: path.root,
      element: isAuthenticated() ? (
        <DashboardLayout />
      ) : (
        <Navigate to={path.login} state={{ from: location }} />
      ),
      children: [
        // { element: <Navigate to={path.root} replace /> },
        {
          element: <Navigate to={path.potentialAccount} replace />,
          path: path.root,
        },
        {
          element: <Dashboard />,
          path: path.dashboards,
        },
        {
          element: <Project />,
          path: path.project,
        },
        {
          element: <EditProject />,
          path: path.editProject,
        },
        {
          element: <EditComisstionPolicy />,
          path: path.editComisstionRules,
        },
        {
          element: <CreateProject />,
          path: path.createProject,
        },
        {
          element: <CreatePermission />,
          path: path.createpermission,
        },
        {
          element: <ContentManagement />,
          path: path.contentManagement,
        },
        {
          element: <Comisstion />,
          path: path.ComisstionsAccount,
        },
        {
          element: <ComisstionPolicy />,
          path: path.ComisstionRules,
        },
        {
          element: <CreateComisstionRule />,
          path: path.createComisstionRules,
        },
        {
          element: <KPIMission />,
          path: path.kpi,
        },
        {
          element: <ListMision />,
          path: path.kpiPotentialCustomers,
        },
        {
          element: <CreateKpiMission />,
          path: path.createKpiMission,
        },
        {
          element: <EditKpiMission />,
          path: path.editKpiMission,
        },
        {
          element: <UploadComisstion />,
          path: path.uploadComisstion,
        },
        {
          element: <EditComisstion />,
          path: path.editComisstion,
        },
        {
          element: <Customer />,
          path: path.potentialAccount,
        },
        {
          element: <CreateCustomer />,
          path: path.createCustomer,
        },
        {
          element: <EditCustomer />,
          path: path.editCustomer,
        },
        {
          element: <EditStaff />,
          path: path.StaffDetail,
        },
        {
          element: <CustomerTransaction />,
          path: path.customerTransaction,
        },
        {
          element: <LogImportCustomer />,
          path: path.logImportCustomer,
        },
        {
          element: <TransactionManagement />,
          path: path.transactionManagementProject,
        },
        {
          element: <ProjectSetting />,
          path: path.projectSetting,
        },
        {
          element: <CreateSalesProgram />,
          path: path.createSalesProgram,
        },
        {
          element: <EditSalesProgram />,
          path: path.editSalesProgram,
        },
        {
          element: <ProcessManagement />,
          path: path.processManagement,
        },
        {
          element: <CreateProcess />,
          path: path.createProcessManagement,
        },
        {
          element: <EditProcess isEdit isShow={false} />,
          path: path.editProcessManagement,
        },
        {
          element: <CopyProcess />,
          path: path.copyProcessManagement,
        },
        {
          element: <CreateReservation />,
          path: path.createReservation,
        },
        {
          element: <CopyReservation />,
          path: path.copyReservation,
        },
        {
          element: <EditReservation />,
          path: path.editReservation,
        },
        {
          element: <ProductTableSetting />,
          path: path.productTableSetting,
        },
        {
          element: <MembershipCard />,
          path: path.cityStarMembership,
        },
        {
          element: <CityStar />,
          path: path.cityStarCustomer,
        },
        // {
        //   element: <RoleList />,
        //   path: path.roleList,
        // },
        {
          element: <PermissionCreate />,
          path: path.permission,
        },
        {
          element: <Settings />,
          path: path.settings,
        },
        {
          element: <ComisstionRequest />,
          path: path.ComisstionsRequest,
        },
        {
          element: <CreateContract />,
          path: path.createContract,
        },
        {
          element: <EditContract />,
          path: path.editComisstionsRequest,
        },
        {
          element: <EditContract />,
          path: path.liquidContract,
        },
        {
          element: <EditContract />,
          path: path.appendixContract,
        },
        {
          element: <Staff />,
          path: path.staff,
        },
        {
          element: <CreateStaff />,
          path: path.createStaff,
        },
        {
          element: <Carrers />,
          path: path.carrers,
        },
        {
          element: <CreateRealEstate />,
          path: path.createCarrers,
        },
        {
          element: <RealEstateDetail />,
          path: path.carrersDetail,
        },
        {
          element: <EditRealEstate />,
          path: path.editCarrers,
        },
        {
          element: <Orgchart />,
          path: path.Orgcharts,
        },
        {
          element: <CreateOrgchart />,
          path: path.createOrgchart,
        },
        {
          element: <OrgchartDetail />,
          path: path.OrgchartDetail,
        },
        {
          element: <EditOrgchart />,
          path: path.editOrgchart,
        },
        {
          element: <Leads />,
          path: path.leadManagement,
        },
        {
          element: <TakeCareLeads />,
          path: path.leadsCare,
        },
        {
          element: <FinanceStaff />,
          path: path.financeStaff,
        },
        {
          element: <Reports />,
          path: path.reports,
        },
        {
          element: <CreatCategory />,
          path: path.createCategory,
        },
        {
          element: <EditCatgory />,
          path: path.editCategory,
        },
        {
          element: <DetailCategory />,
          path: path.detailCategory,
        },
        {
          element: <DetailCategory />,
          path: path.detailCategory,
        },
        {
          element: <ReceiptsPage />,
          path: path.payment,
        },
        {
          element: <ReceiptsPage />,
          path: path.receipts,
        },
        {
          element: <RefundsPage />,
          path: path.refunds,
        },
      ],
    },
    {
      path: path.esalekit,
      element: <EsalekitLayout />,
      children: [
        {
          element: <Esalekit />,
          path: path.esalekit,
        },
        {
          element: <Overview />,
          path: path.esalekitOverview,
        },
        {
          element: <PreviewEsalekit />,
          path: path.esalekitPreview,
        },
      ],
    },
    {
      path: path.Profile,
      element: <ProfileLayout />,
      // children: [
      //   {
      //     element: <Profile />,
      //     path: path.Profile
      //   },
      // ],
    },
    {
      path: path.esalekitPreview,
      element: <PreviewEsalekitLayout />,
      children: [
        {
          element: <Esalekit />,
          path: path.esalekitPreview,
        },
      ],
    },
    {
      path: path.cityStar,
      element: <CityStarLayout />,
      children: [
        {
          element: <RegisterForm />,
          path: path.cityStarWelcome,
        },
        {
          element: <Membership />,
          path: path.creataCityStarMembrship,
        },
        {
          element: <RegisterActive />,
          path: path.cityStarRegisterSuccess,
        },
      ],
    },
    {
      path: path.root,
      element: isAuthenticated() ? (
        <SaleEventLayout />
      ) : (
        <Navigate to={path.login} state={{ from: location }} />
      ),
      children: [
        {
          path: path.saleEventControl,
          element: <SaleEventControl />,
        },
        {
          path: path.saleEventTransaction,
          element: <SaleEventTransaction />,
        },
        {
          path: path.virtualTable,
          element: <VirtualTable />,
        },
        {
          path: path.virtualTableView,
          element: <VirtualView />,
        },
      ],
    },
    {
      path: path.root,
      element: <CityStarLayout />,
      children: [
        {
          path: path.termCondition,
          element: <TermConditions />,
        },
      ],
    },

    {
      element: <LogoOnlyLayout />,
      children: [
        {
          path: path.login,
          element: isAuthenticated() ? <Navigate to={path.root} /> : <Auth />,
        },
        {
          element: <Auth isUpdatePassword />,
          path: path.updatePassword,
        },
        { path: path.notFound, element: <NotFound /> },
        { path: path.groundEsalekit, element: <GroundEsalekitMobile /> },
        {
          path: path.webViewPolicy,
          element: <WebViewPolicy />,
        },
        {
          path: path.webViewProvise,
          element: <WebViewProvise />,
        },
        {
          path: path.webViewIntroduce,
          element: <WebViewIntroduce />,
        },
      ],
    },
    { path: path.all, element: <Navigate to={path.notFound} replace /> },
  ]);
}
