require('dotenv').config();

const { List } = require('./app/models');

(async () => {
    try {
        const lists = await List.findAll({
            include: {
                association: 'cards',
                include: 'tags'
            }
        });
        for(const list of lists){
            console.log(list.name, ' : ');
            for(const card of list.cards){
                console.log(`\t - ${card.content} (${card.tags.map(tag => tag.name)})`);
            }
        }
    } catch(error){
        console.trace(error);
    }
})()