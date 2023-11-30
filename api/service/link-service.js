const Link = require('../models/Link')
const shortId = require('shortid');

class LinkService {
    async generate( from, username ) {
        const code = shortId.generate()

        const to = `${username}/t/${code}`;
        const newLink = await Link.create({user: username, from, to, code})

        return newLink
    }

    async edit(id, data) {
        const link = await Link.findByIdAndUpdate(id, data, { new: true });
        if (!link) {
            throw new ApiError.BadRequest('Link not found');
        }
        return link;
        
    }

    async delete(id) {
        const link = await Link.findById(id);
        if (!link) {
            throw new ApiError.BadRequest('Link not found');
        }
        if (link.user !== userId) {
            throw new ApiError.Forbidden('You do not have permission to delete this link');
        }
        await link.remove();
    }

    async getLink(id) {
        const link = await Link.findById(id)
        if(!link){
            throw ApiError.BadRequest('Chosen link does not exist!');
        }
        return link;
    }

    async getAllLinks(userId) {
        const links = await Link.find({ user: userId });
        return links;
    }
}

module.exports = new LinkService();