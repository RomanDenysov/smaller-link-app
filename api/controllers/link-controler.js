const { body  } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const linkService = require("../service/link-service");

class LinkControler {

    async generate(req, res, next) {
        try {
            const { from, username } = req.body;
            if(!body(from).isURL()){
                return next(ApiError.BadRequest('Wrong URL!', errors.array()));
            }
            const newLink = await linkService.generate(from, username);
            return res.status(201).json(newLink);
        } catch (error) {
            next(error);
        }
    }

    async edit(req, res, next) {
        try {
            const { from, username } = req.body;
            if (!body(from).isURL()) {
                return next(ApiError.BadRequest('Wrong URL!', errors.array()));
            }
    
            const editedLink = await linkService.edit(req.params.id, { from, username });
            return res.status(200).json(editedLink);
        } catch(error) {
            next(error)
        }

    }

    async delete(req, res, next) {
        try {
            const linkId = req.params.id;

        // Проверка существования ссылки
        const existingLink = await linkService.getLink(linkId);

        // Проверка прав доступа (пример: пользователь должен быть владельцем ссылки)
        if (existingLink.user !== req.user.id) {
            return next(ApiError.Forbidden('You do not have permission to delete this link'));
        }

        // Удаление ссылки
        await linkService.delete(linkId);

        // Вернуть успешный статус или другой ответ, если необходимо
        return res.status(204).send();
        } catch (error) {
            next(error)
        }
    }

    async findLink(req, res, next) {
        try {
            const link = await linkService.getLink(req.params.id)
            return res.status(201).json(link)
        } catch (error) {
            next(error)
        }
    }

    async findAll(req, res, next) {
        try {
            const userId = req.query.userId;
            const links = await linkService.getAllLinks(userId)
            return res.status(201).json(links)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new LinkControler();