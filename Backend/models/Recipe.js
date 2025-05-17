import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  ingredients: [String],
  mealType: String,
  difficulty: String,
  time: String,
  instructions: String,
  slug: { type: String, unique: true },
  likes: { type: Number, default: 0 },
  likedUsers: [String],
  image: String,
  chefSuggestion: {
    type: Boolean,
    default: false,
  },
}, {
  versionKey: false,
  timestamps: true,  
});


const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);
 
export default Recipe;

