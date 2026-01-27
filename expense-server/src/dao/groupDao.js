const Group = require('../models/group');

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
    removeMembers: async (...membersEmail) => {

    },
    getGroupByEmail: async (email) => {
        return await Group.find({ membersEmail: email });
    },
    getGroupByStatus: async (status) => {

    },



    getAuditLog: async (groupId) => {
        
    }

};

module.exports = groupDao;