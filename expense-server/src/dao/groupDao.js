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
        // take email as input then filter groups by email
        // check in member'sEmail field
        return await Group.find({ 'paymentStatus.isPaid': status });
    },

    getAuditLog: async (groupId) => {
        const group =  await Group.findById(groupId).select('paymentStatus.date');
        return group ? group.paymentStatus.date : null;
    }

};

module.exports = groupDao;