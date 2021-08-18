const { List } = require('../models');

module.exports = {

    getAllLists: async (request, response, next) => {
        try {
            const lists = await List.findAll({
                include: {
                    association: 'cards',
                    include: 'tags'
                },
        
                order: [
                    ['position', 'ASC'],
                    ['cards', 'position', 'ASC']
                ]
            });

            response.json(lists);
        } catch (error) {
            next(error);
        }
    },

    getOneList: async (request, response, next) => {

        const id = Number(request.params.id);

        if (isNaN(id)) {
            return response.status(400).json({
                error: `the provided id must be a number`
            });
        }

        try {
            const list = await List.findByPk(id, {
                include: {
                    association: 'cards',
                    include: 'tags'
                }
            });

            if (!list) {
                return next();
            }

            response.json(list);
        } catch (error) {
            next(error);
        }
    },

    createList: async (request, response, next) => {
        const data = request.body;

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
            const list = await List.create(data);

        } catch (error) {
            next(error);
        }
    },

    updateList: async (request, response, next) => {

        const data = request.body;

        const id = Number(request.params.id);

        if (isNaN(id)) {
            return response.status(400).json({
                error: `the provided id must be a number`
            });
        }

        if (data.position && isNaN(Number(data.position))) {
            return response.status(400).json({
                error: `position must be a number`
            });
        }


        try {
            const list = await List.findByPk(id);
            if (!list) {
                next();
            }

            for (const field in data) {
                if (typeof list[field] !== 'undefined') {
                    list[field] = data[field];
                }

            }
            await list.save();
            response.json(list);
        } catch (error) {
            next(error);
        }

    },

    deleteList: async (request, response, next) => {

        const id = Number(request.params.id);

        if (isNaN(id)) {
            return response.status(400).json({
                error: `the provided id must be a number`
            });
        }

        try {
            const list = await List.findByPk(id);
            if (!list) {
                return next();
            }

            await list.destroy();
            response.json('OK');

        } catch (error) {
            next(error);
        }

    },

}