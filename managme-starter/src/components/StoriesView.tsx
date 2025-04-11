import React from "react";
import { StoryState, StoryPriority } from "../types/Story";
import { useAppLogic } from "../logicfunction/useAppLogic";
import "../styles/StoriesView.css";

function StoriesView() {
  const {
    storyName,
    storyDescription,
    storyPriority,
    setStoryName,
    setStoryDescription,
    setStoryPriority,
    handleAddStory,
    filterStoriesByState,
    handleChangeStoryState,
  } = useAppLogic();

  return (
    <div>
      <h3 className="section-title">Dodaj historyjkę</h3>
      <div className="form-container">
        <input
          type="text"
          placeholder="Nazwa"
          value={storyName}
          onChange={(e) => setStoryName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Opis"
          value={storyDescription}
          onChange={(e) => setStoryDescription(e.target.value)}
          className="input-field"
        />
        <select
          value={storyPriority}
          onChange={(e) => setStoryPriority(e.target.value as StoryPriority)}
          className="input-field"
        >
          <option value="niski">Niski</option>
          <option value="średni">Średni</option>
          <option value="wysoki">Wysoki</option>
        </select>
        <button onClick={handleAddStory} className="submit-button">
          Dodaj
        </button>
      </div>

      {/* Lista historyjek z możliwością zmiany statusu */}
      {["todo", "in-progress", "done"].map((state) => (
        <div key={state} className="state-section">
          <h3 className="state-title">
            {state === "todo" && "Do zrobienia"}
            {state === "in-progress" && "W trakcie"}
            {state === "done" && "Zakończone"}
          </h3>
          <ul className="story-list">
            {filterStoriesByState(state as StoryState).map((story) => (
              <li key={story.id} className="story-item">
                <span>
                  <strong>{story.name}</strong> ({story.priority}) - {story.description}
                </span>
                <button
                  onClick={() => handleChangeStoryState(story.id)}
                  className="change-status-button"
                >
                  Zmień status
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default StoriesView;
