import Recipe from '../models/Recipe.js';
import fs from "fs";
import path from "path";
import { s3 } from "../config/aws.js";

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar receitas.' });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const { _id } = req.params;
    const recipe = await Recipe.findById(_id);
    if (!recipe) {
      return res.status(404).json({ error: "Receita não encontrada." });
    }
    res.json(recipe);
  } catch (error) {
    console.error("Erro ao buscar a receita:", error);
    res.status(500).json({ error: "Erro ao buscar a receita." });
  }
};

export const createRecipe = async (req, res) => {
    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: req.file.originalname,
        Body: req.file.buffer,
      };

      s3.upload(params, async (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error uploading file');
        }
        const imageUrl = data.Location; 
    
        const newRecipe = new Recipe({
          ...req.body, 
          image: imageUrl, 
        });
    
        await newRecipe.save();
        res.status(201).json(newRecipe);
        // res.send('File uploaded successfully');
      });

    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Erro ao criar a receita." });
    }
  };
  
  export const updateRecipe = async (req, res) => {
    try {
      const recipe = await Recipe.findOne({ _id: req.params._id });
  
      if (!recipe) return res.status(404).json({ error: "Receita não encontrada" });
  
      if (req.file) {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: req.file.originalname,
        Body: req.file.buffer,
      };

      s3.upload(params, async (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error uploading file');
        }
        const imageUrl = data.Location; 
    
        req.body.image = imageUrl;

        const updatedRecipe = await Recipe.findOneAndUpdate(
          { _id: req.params._id },
          req.body,
          { new: true }
        );
    
        res.json(updatedRecipe);
      });

      }
  
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Erro ao atualizar a receita." });
    }
  };


  export const deleteRecipe = async (req, res) => {
    try {
      const recipe = await Recipe.findOneAndDelete({ _id: req.params._id });
      if (!recipe) {
        return res.status(404).json({ error: 'Receita não encontrada' });
      }
      res.status(200).json({ message: 'Receita apagada com sucesso' });
    } catch (err) {
      res.status(400).json({ error: 'Erro ao deletar a receita.' });
    }
  };

  export const searchRecipesByIngredient = async (req, res) => {
    const { ingredient } = req.query;
  
    if (!ingredient) {
      return res.status(400).json({ error: "Parâmetro 'ingredient' é obrigatório." });
    }
  
    try {
      const recipes = await Recipe.find({
        ingredients: { $regex: new RegExp(ingredient, "i") }
      });
  
      res.json(recipes);
    } catch (err) {
      console.error("Erro ao buscar receitas por ingrediente:", err);
      res.status(500).json({ error: "Erro ao buscar receitas." });
    }
  };


  export const likeRecipe = async (req, res) => {
    const { slug } = req.params;
    const { userToken } = req.body;
  
    if (!userToken) {
      return res.status(400).json({ error: "Token do usuário ausente." });
    }
  
    try {
      const recipe = await Recipe.findOne({ slug });
  
      if (!recipe) {
        return res.status(404).json({ error: "Receita não encontrada." });
      }
  
      if (recipe.likedUsers.includes(userToken)) {
        return res.status(400).json({ error: "Usuário já curtiu esta receita." });
      }
  
      recipe.likes += 1;
      recipe.likedUsers.push(userToken);
  
      await recipe.save();
  
      res.json({ likes: recipe.likes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao curtir a receita." });
    }
  };

  export const getSimilarRecipes = async (req, res) => {
  const { slug } = req.params;

  try {
    const currentRecipe = await Recipe.findOne({ slug });

    if (!currentRecipe) {
      return res.status(404).json({ error: "Receita principal não encontrada." });
    }

    const similar = await Recipe.find({
      mealType: currentRecipe.mealType,
      slug: { $ne: slug }, 
    }).limit(6); 

    res.json(similar);
  } catch (err) {
    console.error("Erro ao buscar receitas similares:", err);
    res.status(500).json({ error: "Erro ao buscar receitas similares." });
  }
};

export const getChefSuggestion = async (req, res) => {
  try {
    const chefRecipes = await Recipe.find({ chefSuggestion: true });
    if (chefRecipes.length === 0) {
      return res.status(404).json({ message: "Nenhuma sugestão do chef encontrada." });
    }
  
    const randomIndex = Math.floor(Math.random() * chefRecipes.length);
    const randomRecipe = chefRecipes[randomIndex];

    res.json(randomRecipe);
  } catch (error) {
    console.error("Erro ao buscar sugestão do chef:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
























  
  