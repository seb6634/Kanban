module.exports = {

    notFound : (request, response, next) => {
        response.status(404).json({
            error: '404 Not Found'
        });
    },

    errorServer: (error, request, response, next) => {
        console.trace(error);
        response.status(500).json({
            error: 'Error : Something went wrong !'
        });
    } 



}