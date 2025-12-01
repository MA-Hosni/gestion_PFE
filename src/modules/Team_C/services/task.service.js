import Task from "../models/task.model.js"
import Project from "../../Team_A/models/project.model.js"
import CompSupervisor from "../../Authentication/models/compSupervisor.model.js"
import UnivSupervisor from "../../Authentication/models/uniSupervisor.model.js"
import UserStory from "../../Team_B/models/UserStory.model.js"

async function verifyUserStoryExists(userStoryId) {
  const userStory = await UserStory.findById(userStoryId);
  if (!userStory) {
    const error = new Error("User story not found.");
    error.status = 404;
    throw error;
  }
  return true;
}

export const createTask = async (data) => {
  const { title, user_story_id } = data;

  if (!title || !user_story_id) {
    const error = new Error("Title and user_story_id are required.");
    error.status = 400;
    throw error;
  }

  await verifyUserStoryExists(user_story_id);

  const existing = await Task.findOne({ title, user_story_id });
  if (existing) {
    const error = new Error("Task with this title already exists for this user story.");
    error.status = 409;
    throw error;
  }

  const newTask = await Task.create(data);

  // Add the created task to the UserStory's tasks array
  await UserStory.findByIdAndUpdate(user_story_id, {
    $push: { tasks: newTask._id }
  });
  return newTask;
};

//function that allows the supervisor to extract all the tasks he is envolved with 
export const getAllTasksForCompSupvisor = async (compSupervisorId) => {
  // Fetch the company supervisor to get the list of student IDs they are in charge of
  const compSupervisor = await CompSupervisor.findById(compSupervisorId).populate('studentsId');
  if (!compSupervisor) {
    const error = new Error("Company supervisor not found.");
    error.status = 404;
    throw error;
  }

  const studentIds = compSupervisor.studentsId.map(student => student._id);
  // Fetch all projects that include these students
  const projects = await Project.find({ contributors: { $in: studentIds } }).populate('sprints');
  const sprintIds = projects.flatMap(project => project.sprints.map(sprint => sprint._id));
  // Fetch all user stories that belong to these sprints
  const userStories = await UserStory.find({ sprintId: { $in: sprintIds } });
  const userStoryIds = userStories.map(userStory => userStory._id);

  // Fetch all tasks that belong to these user stories
  const tasks = await Task.find({ userStoryId: { $in: userStoryIds } });
  return { message: "Tasks retrieved successfully", tasks };
};
//function that allows the university supervisor to extract all the tasks he is envolved with 
export const getAllTasksForUnivSupervisor = async (univSupervisorId) => {
  const univSupervisor = await UnivSupervisor.findById(univSupervisorId).populate('studentsId');
  if (!univSupervisor) {
    const error = new Error("University supervisor not found.");
    error.status = 404;
    throw error;
  }

  const studentIds = univSupervisor.studentsId.map(student => student._id);
  // Fetch all projects that include these students
  const projects = await Project.find({ contributors: { $in: studentIds } }).populate('sprints');
  const sprintIds = projects.flatMap(project => project.sprints.map(sprint => sprint._id));
  // Fetch all user stories that belong to these sprints
  const userStories = await UserStory.find({ sprintId: { $in: sprintIds } });
  const userStoryIds = userStories.map(userStory => userStory._id);

  // Fetch all tasks that belong to these user stories
  const tasks = await Task.find({ userStoryId: { $in: userStoryIds } });
  return { message: "Tasks retrieved successfully", tasks };
};


export const getAllTasks = async () => {
  const tasks = await Task.find();
  if (!tasks.length) {
    const error = new Error("No tasks found.");
    error.status = 404;
    throw error;
  }
  return { message: "Tasks retrieved successfully", tasks };
};

export const getTaskById = async (id) => {
  const task = await Task.findById(id);
  if (!task) {
    const error = new Error("Task not found.");
    error.status = 404;
    throw error;
  }
  return { message: "Task retrieved successfully", task };
};

export const updateTask = async (id, data) => {
  const task = await Task.findByIdAndUpdate(id, data, { new: true });
  if (!task) {
    const error = new Error("Task not found.");
    error.status = 404;
    throw error;
  }
  return { message: "Task updated successfully", task };
};

export const deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    const error = new Error("Task not found.");
    error.status = 404;
    throw error;
  }
  return { message: "Task deleted successfully", task };
};
