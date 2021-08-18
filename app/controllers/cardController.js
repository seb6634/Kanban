const { Card } = require('../models');

module.exports = {

    getCardsInList: async (request, response, next) => {

        // Id de la liste
        const id = Number(request.params.id);

        if (isNaN(id)) {
            return response.status(400).json({
                error: `the provided id must be a number`
            });
        }

        try {
            const cards = await Card.findAll({
                where: {
                    list_id: id
                },
                include: 'tags',
                order: [
                    ['position', 'ASC']
                ]
            });

            response.json(cards);
        } catch (error) {
            next(error);
        }
    },

    getOneCard: async (request, response, next) => {

        const id = Number(request.params.id);

        if (isNaN(id)) {
            return response.status(400).json({
                error: `the provided id must be a number`
            });
        }

        try {
            const card = await Card.findByPk(id, {
                include: 'tags'
            });

            if (!card) {
                return next();
            }

            response.json(card);
        } catch (error) {
            next(error);
        }
    },

    createCard: async (request, response, next) => {
        const data = request.body;

        if (!data.content) {
            return response.status(400).json({
                error: `You must provide a content`
            });
        }

        if (data.position && isNaN(Number(data.position))) {
            return response.status(400).json({
                error: `position must be a number`
            });
        }

        try {
            const card = await Card.create(data);
            response.json(card);

        } catch (error) {
            next(error);
        }
    },

    updateCard: async (request, response, next) => {

        const data = request.body;

        const id = Number(request.params.id);

        if (isNaN(id)) {
            return response.status(400).json({
                error: `the provided id must be a number`
            });
        }

        if (!data.content) {
            return response.status(400).json({
                error: `You must provide a content`
            });
        }

        if (data.position && isNaN(Number(data.position))) {
            return response.status(400).json({
                error: `position must be a number`
            });
        }

        try {
            const card = await Card.findByPk(id);
            if (!card) {
                return next();
            }
            
            for (const field in data) {

                if (typeof card[field] !== 'undefined') {
                    card[field] = data[field];
                }

            }
            await card.save();
            response.json(card);
        } catch (error) {
            next(error);
        }

    },

    deleteCard: async (request, response, next) => {

        const id = Number(request.params.id);

        if (isNaN(id)) {
            return response.status(400).json({
                error: `the provided id must be a number`
            });
        }

        try {
            const card = await Card.findByPk(id);
            if (!card) {
                next();
            }

            await card.destroy();
            response.json('OK');

        } catch (error) {
            next(error);
        }

    },

}