// useAppLogic.ts
import { useProjectLogic } from "./useProjectLogic";
import { useStoryLogic } from "./useStoryLogic";
import { UserSession } from "../utils/UserSession";
import { useTaskLogic } from "./useTaskLogic";

export const useAppLogic = () => {
    const user = UserSession.getLoggedUser();

    const {
        projects,
        activeProject,
        projectName,
        projectDescription,
        setProjectName,
        setProjectDescription,
        handleAddProject,
        handleProjectSelect,
    } = useProjectLogic();

    const {
        storyName,
        storyDescription,
        storyPriority,
        activeHistory,
        setStoryName,
        setStoryDescription,
        setStoryPriority,
        handleAddStory,
        handleChangeStoryState,
        filterStoriesByState,
        handleStorySelect
    } = useStoryLogic(activeProject);

    const { 
        tasks,
        handleAddTask,
        handleUpdateTask,
        handleDeleteTask,
        filterTasksByState,
        handleAssignUser,
        handleChangeTaskState,
    } = useTaskLogic(activeHistory);

    return {
        user,
        projects,
        activeProject,
        projectName,
        projectDescription,
        setProjectName,
        setProjectDescription,
        handleAddProject,
        handleProjectSelect,
        storyName,
        storyDescription,
        storyPriority,
        activeHistory,
        setStoryName,
        setStoryDescription,
        setStoryPriority,
        handleAddStory,
        handleChangeStoryState,
        filterStoriesByState,
        handleStorySelect,
        tasks,
        handleAddTask,
        handleUpdateTask,
        handleDeleteTask,
        filterTasksByState,
        handleAssignUser,
        handleChangeTaskState,
    };
};
