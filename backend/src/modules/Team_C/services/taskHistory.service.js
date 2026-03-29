import TaskHistory from "../models/taskHistory.model.js" 

//function that allows the supervisor to check all the task history related to him and of a specific task
export const getTaskHistory = async (taskId) => {
    const taskHistory = await TaskHistory.find({ taskId })
        .populate({ path: "modifiedBy", select: "fullName" })
        .sort({ modifiedAt: -1 })
    return taskHistory
}