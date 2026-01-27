const groupController = {
    create: async ({request, response}) => {
        try {
            const {name, description, adminEmail, membersEmail, thumbnail} = request.body;

            let allMembers = [adminEmail];
            if(membersEmail && Array.isArray(membersEmail)) {
                allMembers = [...new Set([...allMembers, ...membersEmail])];
            }

            const newGroup = await groupDao.createGroup({
                name,description, adminEmail, allMembers, thumbnail,
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
        }catch (error) {
            console.log(error);
            response.status(500).send({ message: 'Internal Server Error' });
        }
    }
};

module.exports = groupController;