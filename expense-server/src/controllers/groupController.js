const groupDao = require('../dao/groupDao');

const groupController = {

    // CREATE GROUP
    create: async (request, response) => {
        try {
            const user = request.user; // from authMiddleware
            const { name, description, membersEmail, thumbnail } = request.body;

            if (!name) {
                return response.status(400).json({ message: 'Group name is required' });
            }

            let allMembers = [user.email];
            if (membersEmail && Array.isArray(membersEmail)) {
                allMembers = [...new Set([...allMembers, ...membersEmail])];
            }

            const newGroup = await groupDao.createGroup({
                name,
                description,
                adminEmail: user.email,
                membersEmail: allMembers,
                thumbnail,
                paymentStatus: {
                    amount: 0,
                    currency: 'INR',
                    date: Date.now(),
                    isPaid: false,
                }
            });

            response.status(201).json({
                message: 'Group created successfully',
                groupId: newGroup._id
            });

        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    },

    // UPDATE GROUP
    updateGroup: async (request, response) => {
        try {
            const { groupId } = request.params;
            const { name, description, thumbnail, adminEmail, paymentStatus } = request.body;

            const updatedGroup = await groupDao.updateGroup(groupId, {
                name,
                description,
                thumbnail,
                adminEmail,
                paymentStatus
            });

            if (!updatedGroup) {
                return response.status(404).json({ message: 'Group not found' });
            }

            response.status(200).json({
                message: 'Group updated successfully',
                group: updatedGroup
            });

        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    },

    // ADD MEMBERS
    addMembers: async (request, response) => {
        try {
            const { groupId } = request.params;
            const { membersEmail } = request.body;

            if (!Array.isArray(membersEmail) || membersEmail.length === 0) {
                return response.status(400).json({ message: 'membersEmail must be a non-empty array' });
            }

            const updatedGroup = await groupDao.addMembers(groupId, ...membersEmail);

            if (!updatedGroup) {
                return response.status(404).json({ message: 'Group not found' });
            }

            response.status(200).json({
                message: 'Members added successfully',
                group: updatedGroup
            });

        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    },

    // REMOVE MEMBERS
    removeMembers: async (request, response) => {
        try {
            const { groupId } = request.params;
            const { membersEmail } = request.body;

            if (!Array.isArray(membersEmail) || membersEmail.length === 0) {
                return response.status(400).json({ message: 'membersEmail must be a non-empty array' });
            }

            const updatedGroup = await groupDao.removeMembers(groupId, ...membersEmail);

            if (!updatedGroup) {
                return response.status(404).json({ message: 'Group not found' });
            }

            response.status(200).json({
                message: 'Members removed successfully',
                group: updatedGroup
            });

        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    },

    // GET GROUPS BY USER EMAIL
    getGroupByEmail: async (request, response) => {
        try {
            const { email } = request.params;

            const groups = await groupDao.getGroupByEmail(email);

            if (!groups || groups.length === 0) {
                return response.status(404).json({ message: 'No groups found for this email' });
            }

            response.status(200).json({
                message: 'Groups retrieved successfully',
                groups
            });

        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    },

    // GET GROUPS BY PAYMENT STATUS
    getGroupByStatus: async (request, response) => {
        try {
            const { status } = request.params;

            const isPaid =
                status === 'true' ||
                status === '1' ||
                status === 'paid';

            const groups = await groupDao.getGroupByStatus(isPaid);

            if (!groups || groups.length === 0) {
                return response.status(404).json({
                    message: `No groups found with status: ${status}`
                });
            }

            response.status(200).json({
                message: 'Groups retrieved successfully',
                groups
            });

        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    },

    // GET AUDIT LOG
    getAuditLog: async (request, response) => {
        try {
            const { groupId } = request.params;

            const auditLog = await groupDao.getAuditLog(groupId);

            if (!auditLog) {
                return response.status(404).json({ message: 'Group not found' });
            }

            response.status(200).json({
                message: 'Audit log retrieved successfully',
                auditLog
            });

        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    },

    // GET GROUPS BY USER EMAIL (alternative method name for routes)
    getGroupsByUser: async (request, response) => {
        try {
            const user = request.user; // from authMiddleware
            const groups = await groupDao.getGroupByEmail(user.email);

            if (!groups || groups.length === 0) {
                return response.status(404).json({ message: 'No groups found for this user' });
            }

            response.status(200).json({
                message: 'Groups retrieved successfully',
                groups
            });

        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    },

    // GET GROUPS BY PAYMENT STATUS (alternative method name for routes)
    getGroupsByPaymentStatus: async (request, response) => {
        try {
            const { status } = request.params;

            const isPaid =
                status === 'true' ||
                status === '1' ||
                status === 'paid';

            const groups = await groupDao.getGroupByStatus(isPaid);

            if (!groups || groups.length === 0) {
                return response.status(404).json({
                    message: `No groups found with status: ${status}`
                });
            }

            response.status(200).json({
                message: 'Groups retrieved successfully',
                groups
            });

        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    },

    // GET AUDIT LOG (alternative method name for routes)
    getAudit: async (request, response) => {
        try {
            const { groupId } = request.params;

            const auditLog = await groupDao.getAuditLog(groupId);

            if (!auditLog) {
                return response.status(404).json({ message: 'Group not found' });
            }

            response.status(200).json({
                message: 'Audit log retrieved successfully',
                auditLog
            });

        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

module.exports = groupController;
