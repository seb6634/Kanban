const { Card, Tag } = require('../models');

module.exports = {

    getAllTags: async (request, response, next) => {
        try {
            const tags = await Tag.findAll({
                order: [
                    ['name', 'ASC']
                ]
            });
            response.json(tags);
        } catch (error) {
            next(error);
        }
    },

    createTag: async (request, response, next) => {
        const data = request.body;

        if (!data.name) {
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
            const tag = await Tag.create(data);
            response.json(tag);

        } catch (error) {
            next(error);
        }
    },

    updateTag: async (request, response, next) => {

        const data = request.body;

        const id = Number(request.params.id);

        if (isNaN(id)) {
            return response.status(400).json({
                error: `the provided id must be a number`
            });
        }

        if (!data.name) {
            return response.status(400).json({
                error: `You must provide a name`
            });
        }

        if (data.position && isNaN(Number(data.position))) {
            return response.status(400).json({
                error: `position must be a number`
            });
        }

        try {
            const tag = await Tag.findByPk(id);
            if (!tag) {
                return next();
            }

            for (const field in data) {

                if (typeof tag[field] !== 'undefined') {
                    tag[field] = data[field];
                }

            }
            await tag.save();
            response.json(tag);
        } catch (error) {
            next(error);
        }

    },

    deleteTag: async (request, response, next) => {

        const id = Number(request.params.id);

        if (isNaN(id)) {
            return response.status(400).json({
                error: `the provided id must be a number`
            });
        }

        try {
            const tag = await Tag.findByPk(id);
            if (!tag) {
                next();
            }

            await tag.destroy();
            response.json('OK');

        } catch (error) {
            next(error);
        }

    },

    addTagToCard: async (request, response, next) => {

        const cardId = request.params.id;

        if (isNaN(cardId)) {
            return response.status(400).json({
                error: `the provided id must be a number`
            });
        }

        const tagId = request.body.tag_id;

        if (isNaN(tagId)) {
            return response.status(400).json({
                error: `the provided tag_id must be a number`
            });
        }

        try {

            let card = await Card.findByPk(cardId, {
                include: ['tags']
            });

            if (!card) {
                return next();
            }

            let tag = await Tag.findByPk(tagId);
            if (!tag) {
                return next();
            }

            await card.addTag(tag);
            card = await Card.findByPk(cardId, {
                include: ['tags']
            });
            response.json(card);

        } catch (error) {
            next(error);
        }
    },

    removeTagFromCard: async (request, response) => {

        const { card_id, tag_id } = request.params;

        if (isNaN(card_id)) {
            return response.status(400).json({
                error: `the provided cardId must be a number`
            });
        }

        if (isNaN(tag_id)) {
            return response.status(400).json({
                error: `the provided tagId must be a number`
            });
        }

        try {
            let card = await Card.findByPk(card_id);
            if (!card) {
                return next();
            }

            let tag = await Tag.findByPk(tag_id);
            if (!tag) {
                return next();
            }

            await card.removeTag(tag);
            card = await Card.findByPk(card_id, {
                include: ['tags']
            });
            response.json(card);

        } catch (error) {
            next(error);
        }
    }

}