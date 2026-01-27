const Group = require('../model/group');

const groupDao = {
    createGroup: async (data) => {
        const newGroup = new Group(data);
        return await newGroup.save();
    },
    updateGroup: async (groupId, data) => {
        const {name, description, thumbnail, adminEmail, paymentStatus} = data;
        return await Group.findByIdAndUpdate(groupId, {
            name, description, thumbnail, adminEmail, paymentStatus   
        }, {new: true});
    },
    addMembers: async (groupId, ...membersEmails) => {
        return await Group.findByIdAndUpdate(groupId, {
            $addToSet: { membersEmail: { $each: membersEmails } }
        }, { new: true});
    },
    removeMembers: async (groupId, ...membersEmails) => {
        return await Group.findByIdAndUpdate(groupId, {
            $pull: { membersEmail: { $in: membersEmails } }
        }, { new: true});
    },
    getGroupByEmail: async (email) => {
        return await Group.find({ membersEmail: email });
    },
    getGroupByStatus: async (status) => {
        return await Group.find({ 'paymentStatus.isPaid': status });
    },

    getAuditLog: async (groupId) => {
        return await Group.findById(groupId).select('name adminEmail createdAt membersEmail paymentStatus');
    }

};

module.exports = groupDao;