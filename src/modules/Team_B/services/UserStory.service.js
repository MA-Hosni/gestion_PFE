
// Placeholder (sera remplacé quand Team_A livrera son module)
// Vérifier si le projet appartient à cet étudiant

async function verifyProjectRelatedToStudent(studentId , projectId) {
    console.log("⚠️ Placeholder: User story existence check not yet implemented.")
    return true
}

async function verifySprintAppartientAProject(projectId ,SprintID  ) {
    console.log("⚠️ Placeholder: sprint related to project  not yet implemented.")
    return true
}


export const creatUS = async () => {
    const { title, user_story_id } = data
  
    await verifyUserStoryExists(user_story_id)
  
    const existing = await Task.findOne({ title, user_story_id })
    if (existing) {
      const error = new Error("Task with this title already exists for this user story.")
      error.status = 409
      throw error
    }
  
    const newTask = await Task.create(data)
    return newTask
  }
