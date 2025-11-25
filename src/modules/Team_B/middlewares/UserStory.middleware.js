import { UserStorySchema } from "../validators/UserStory.validator.js";

/**
 * Middleware pour valider les données d'une User Story
 */
export const validateUserStory = (req, res, next) => {
  // Validation des données du corps de la requête
  const { error } = UserStorySchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Transformer les erreurs Joi en tableau lisible
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ errors });
  }

  // Si tout est valide, passer au controller
  next();
};
