import { Turnstile } from "../models/Turnstile.js";

export const getTurnstiles = async (req, res) => {
  try {
    const turnstile = await Turnstile.findAll();
    res.json(turnstile);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const getTurnstilesMQTT = async () => {
  try {
    const turnstile = await Turnstile.findAll();
    return turnstile;
  } catch (error) {
    return error;
  }
};

export const createTurnstile = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newTurnstile = await Turnstile.create({
      name,
      description,
    });
    return res.json(newTurnstile);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const getTurnstile = async (req, res) => {
  const { id } = req.params;
  try {
    const turnstile = await Turnstile.findByPk(id);
    res.json(turnstile);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const updateTurnstile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const turnstile = await Turnstile.findByPk(id);
    turnstile.name = name;
    turnstile.description = description;
    await turnstile.save();
    res.json(turnstile);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};
