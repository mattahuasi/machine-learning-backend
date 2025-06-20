import { CardType } from "../models/Card.js";

export const getCardTypes = async (req, res) => {
  try {
    const cardType = await CardType.findAll({
      order: [["id", "ASC"]],
    });
    res.json(cardType);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const createCardType = async (req, res) => {
  const { name, color, description } = req.body;
  try {
    const newCardType = await CardType.create({
      name,
      color,
      description,
    });
    return res.json(newCardType);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const getCardType = async (req, res) => {
  const { id } = req.params;
  try {
    const cardType = await CardType.findByPk(id);
    res.json(cardType);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const deleteCardType = async (req, res) => {
  const { id } = req.params;
  try {
    const cardType = await CardType.findByPk(id);
    if (!cardType)
      return res
        .status(404)
        .json({ errors: ["Tipo de tarjeta no encontrada"] });

    await cardType.destroy();
    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const updateCardType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, description } = req.body;
    const cardType = await CardType.findByPk(id);
    cardType.color = color;
    cardType.name = name;
    cardType.description = description;
    await cardType.save();
    res.json(cardType);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};
