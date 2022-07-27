import React, { lazy } from "react";
import { match } from "react-router-dom";
import ScreenResolutionMessage from "../Layout/ScreenResolutionMessage";
import { PendingChangeItem } from "../VersionControl/PendingChangesContext";
import { isMobileOnly } from "react-device-detect";
import CompleteInvitation from "../User/CompleteInvitation";
import "./WorkspaceLayout.scss";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceFooter from "./WorkspaceFooter";
import useAuthenticated from "../authentication/use-authenticated";
import useProjectSelector from "./hooks/useProjectSelector";
import { AppContextProvider } from "../context/appContext";
import useWorkspaceSelector from "./hooks/useWorkspaceSelector";
import { CircularProgress } from "@amplication/design-system";
import useResources from "./hooks/useResources";

const MobileMessage = lazy(() => import("../Layout/MobileMessage"));

export type PendingChangeStatusData = {
  pendingChanges: PendingChangeItem[];
};

type Props = {
  match: match<{
    workspace: string;
  }>;
  moduleClass: string;
  // eslint-disable-next-line no-undef
  InnerRoutes: JSX.Element | undefined;
};

const WorkspaceLayout: React.FC<Props> = ({
  InnerRoutes,
  moduleClass,
}) => {
  const authenticated = useAuthenticated();
  const {
    currentWorkspace,
    handleSetCurrentWorkspace,
    createWorkspace,
    createNewWorkspaceError,
    loadingCreateNewWorkspace,
  } = useWorkspaceSelector(
    authenticated
  );
  const {
    currentProject,
    createProject,
    projectsList,
    onNewProjectCompleted,
  } = useProjectSelector(authenticated, currentWorkspace);

  const { resources, handleSearchChange, loadingResources, errorResources } = useResources(
    currentProject
  );

  return currentWorkspace ? (
    <AppContextProvider
      newVal={{
        currentWorkspace,
        currentProject,
        projectsList,
        setNewProject: createProject,
        onNewProjectCompleted,
        handleSetCurrentWorkspace,
        resources,
        handleSearchChange,
        loadingResources,
        errorResources,
        createWorkspace,
        createNewWorkspaceError,
        loadingCreateNewWorkspace
      }}
    >
      {isMobileOnly ? (
        <MobileMessage />
      ) : (
        <div className={moduleClass}>
          <WorkspaceHeader />
          <CompleteInvitation />
          <div className={`${moduleClass}__page_content`}>
            <div className={`${moduleClass}__main_content`}>{InnerRoutes}</div>
            <div className={`${moduleClass}__changes_menu`}>
              pending changes
            </div>
          </div>
          <WorkspaceFooter />
          <ScreenResolutionMessage />
        </div>
      )}
    </AppContextProvider>
  ) : (
    <CircularProgress />
  );
};

export default WorkspaceLayout;
