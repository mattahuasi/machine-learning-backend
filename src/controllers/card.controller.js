import { Op } from "sequelize";
import { Card, CardType } from "../models/Card.js";
import { Employee, User } from "../models/User.js";

export const getCards = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await Employee.findByPk(userId);
    let cards;
    if (user.admin) {
      cards = await Card.findAll({
        include: [
          {
            model: CardType,
            attributes: ["id", "name", "color"],
          },
          {
            model: User,
          },
        ],
        order: [["id", "ASC"]],
      });
    } else {
      cards = await Card.findAll({
        include: [
          {
            model: CardType,
            attributes: ["id", "name", "color"],
          },
          {
            model: User,
            include: [
              {
                model: Employee,
              },
            ],
          },
        ],
        where: {
          "$user.employee.admin$": {
            [Op.or]: {
              [Op.eq]: false,
              [Op.is]: null,
            },
          },
        },
      });
    }

    const cardModify = cards.map((card) => ({
      id: card.id,
      cardTypeId: card.cardTypeId,
      rfid: card.rfid,
      description: card.description,
      createdAt: card.createdAt,
      type: card.cardType.name,
      color: card.cardType.color,
      userName: card.user ? card.user.firstName + " " + card.user.lastName : "",
      connect: card.user ? true : false,
    }));
    res.json(cardModify);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const getCardTypes = async (req, res) => {
  const { id, userId } = req.params;
  try {
    const cards = await Card.findAll({
      where: {
        [Op.or]: [{ userId: null }, { userId: userId }],
      },
      include: [
        {
          model: CardType,
          attributes: ["id", "name", "color"],
          where: { id },
        },
      ],
      order: [["id", "ASC"]],
    });
    const cardModify = cards.map((card) => ({
      id: card.id,
      cardTypeId: card.cardTypeId,
      rfid: card.rfid,
      description: card.description,
      createdAt: card.createdAt,
      type: card.cardType.name,
    }));
    res.json(cardModify);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const createCard = async (req, res) => {
  const { cardTypeId, rfid, description } = req.body;
  try {
    const foundCard = await Card.findOne({ where: { rfid } });
    if (foundCard)
      return res.status(500).json({ errors: ["La tarjeta ya esta ingresada"] });

    const newCard = await Card.create({
      cardTypeId,
      description,
      rfid,
    });
    return res.json(newCard);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const getCard = async (req, res) => {
  const { id } = req.params;
  try {
    const card = await Card.findByPk(id, {
      include: [{ model: CardType, attributes: ["id", "name", "color"] }],
    });
    res.json({
      id: card.id,
      cardTypeId: card.cardTypeId,
      rfid: card.rfid,
      description: card.description,
      createdAt: card.createdAt,
      type: card.cardType.name,
      color: card.cardType.color,
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const getCardEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    const card = await Card.findOne({ where: { userId: employee.userId } });
    if (!card)
      return res.status(404).json({ errors: ["El usuario no tiene tarjeta"] });
    return res.json({
      card: card.id,
      type: card.cardTypeId,
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const deleteCard = async (req, res) => {
  const { id } = req.params;
  try {
    const card = await Card.findByPk(id);
    if (!card)
      return res.status(404).json({ errors: ["Tarjeta no encontrada"] });

    await card.destroy();
    res.sendStatus(202);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { cardTypeId, rfid, description } = req.body;
    const card = await Card.findByPk(id);
    card.cardTypeId = cardTypeId;
    card.description = description;
    card.rfid = rfid;
    await card.save();
    res.json(card);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const connectCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ errors: ["User not found"] });
    const cardOld = await Card.findOne({ where: { userId: userId } });

    if (cardOld) {
      if (cardOld.id == id) return res.json(cardOld);
      cardOld.userId = null;
      cardOld.save();
    }
    const card = await Card.findByPk(id);
    card.userId = userId;
    card.save();
    res.json(card);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};
export const disconnectCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.findByPk(id);
    if (!card.userId)
      return res.status(400).json({ errors: ["Tarjeta no vinculada"] });
    card.userId = null;
    card.save();
    res.json(card);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const disconnectEmployeeCard = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);
    const card = await Card.findOne({ where: { userId: employee.userId } });
    if (!card)
      return res.status(400).json({ errors: ["Tarjeta no vinculada"] });
    card.userId = null;
    card.save();
    res.json(card);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};
