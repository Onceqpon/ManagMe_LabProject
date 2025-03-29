import { useState, useEffect } from "react";
import { Story, StoryPriority, StoryState } from "../types/Story";
import { StoryStorage } from "../utils/StoryStorage";
import { UserSession } from "../utils/UserSession";
import { v4 as uuidv4 } from "uuid";

export const useStoryLogic = (activeProject: string | null) => {
    const user = UserSession.getLoggedUser();
    const [stories, setStories] = useState<Story[]>([]);
    const [storyName, setStoryName] = useState("");
    const [storyDescription, setStoryDescription] = useState("");
    const [storyPriority, setStoryPriority] = useState<StoryPriority>("średni");

    useEffect(() => {
        if (activeProject) {
            setStories(StoryStorage.getByProject(activeProject));
        }
    }, [activeProject]);

    const handleAddStory = () => {
        if (!storyName || !activeProject) return;

        const newStory: Story = {
            id: uuidv4(),
            name: storyName,
            description: storyDescription,
            priority: storyPriority,
            projectId: activeProject,
            createdAt: new Date().toISOString(),
            state: "todo",
            ownerId: user.id,
        };
        StoryStorage.add(newStory);
        setStories(StoryStorage.getByProject(activeProject));

        setStoryName("");
        setStoryDescription("");
    };

    const handleChangeStoryState = (storyId: string) => {
        if (!activeProject) return;

        const allStories = StoryStorage.getByProject(activeProject);
        const updatedStories = allStories.map((story) => {
            if (story.id === storyId) {
                let newState: StoryState;
                switch (story.state) {
                    case "todo":
                        newState = "in-progress";
                        break;
                    case "in-progress":
                        newState = "done";
                        break;
                    case "done":
                    default:
                        newState = "todo";
                        break;
                }
                return { ...story, state: newState };
            }
            return story;
        });

        localStorage.setItem(
            "stories",
            JSON.stringify([
                ...StoryStorage.getAll().filter((s) => s.projectId !== activeProject),
                ...updatedStories,
            ])
        );
        setStories(updatedStories);
    };

    const filterStoriesByState = (state: StoryState) =>
        stories.filter((story) => story.state === state);

    return {
        storyName,
        storyDescription,
        storyPriority,
        setStoryName,
        setStoryDescription,
        setStoryPriority,
        handleAddStory,
        handleChangeStoryState,
        filterStoriesByState,
    };
};
        